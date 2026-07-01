import { STATS } from "../types.js";

/**
 * Given an array of daily temperature values,compute mean and standard deviation.
 * @param {number[]} values
 * @returns {typeof STATS}
 */
export function computeStats(values) {
  const count = values.length;
  if (count === 0) return { mean: 0, std: 1, count: 0 };

  const mean = values.reduce((sum, v) => sum + v, 0) / count;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / count;
  const std = Math.sqrt(variance);

  return { mean, std: std || 1, count };
}

/**
 * Convert a value to a sigma score given a baseline.
 *
 * @param {number} value The observed value
 * @param {number} mean Historical mean
 * @param {number} std Historical standard deviation
 * @returns {number} Sigma score (signed)
 */
export function toSigma(value, mean, std) {
  return (value - mean) / std;
}

/**
 * Convert a sigma score to a cumulative percentile (0–100).
 * Uses the Abramowitz & Stegun rational approximation of the normal CDF.
 *
 * @param {number} sigma
 * @returns {number} Percentile, e.g. 97.7
 */
export function sigmaToPercentile(sigma) {
  const sign = sigma < 0 ? -1 : 1;
  const x = Math.abs(sigma) / Math.SQRT2;

  // Horner's method for the complementary error function approximation
  const t = 1 / (1 + 0.3275911 * x);
  const poly =
    t *
    (0.254829592 +
      t *
        (-0.284496736 +
          t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erfc = poly * Math.exp(-(x * x));

  const cdf = 0.5 * (1 + sign * (1 - erfc));
  return Math.min(99.999, Math.max(0.001, cdf * 100));
}

/**
 * Convert a sigma score to an approximate "once every N days" frequency.
 * For extreme values (>3σ) this gives a more visceral sense of rarity.
 *
 * @param {number} sigma
 * @returns {string} Frequency description
 */
export function sigmaToFrequency(sigma) {
  const pct = sigmaToPercentile(sigma);
  const tailProb = sigma >= 0 ? (100 - pct) / 100 : pct / 100;

  const days = Math.round(1 / Math.max(tailProb, 1e-6));

  const levels = [
    { maxDays: 2, label: "is very common" },
    { maxDays: 7, label: "occurs frequently" },
    { maxDays: 30, label: "occurs several times a year" },
    { maxDays: 90, label: "occurs a few times a year" },
    { maxDays: 365, label: "occurs about once a year" },
  ];

  for (const level of levels)
    if (days <= level.maxDays) return `This level of weather ${level.label}`;

  const years = Math.round(days / 365);

  if (years <= 2)
    return "This level of weather occurs about once every 2 years";
  if (years < 10)
    return `This level of weather occurs about once every ${years} years`;
  if (years < 50)
    return `This level of weather is exceptionally rare (about once every ${years} years)`;
  return "This level of weather is extraordinarily rare";
}

/**
 * Convert a sigma score to a severity index, levelled from 0 (normal) to 7 (extreme).
 *
 * @param {number} sigma
 * @returns {number} Severity index (0-7)
 */
export function sigmaToSeverity(sigma) {
  const abs = Math.abs(sigma);
  if (abs < 0.5) return 0;
  if (abs < 1.0) return 1;
  if (abs < 2.0) return 2;
  if (abs < 3.0) return 3;
  if (abs < 4.0) return 4;
  return 5;
}

/**
 * Convert a sigma score to a human-readable label.
 *
 * @param {number} sigma
 * @returns
 */
export function sigmaToLabel(sigma) {
  const isPos = sigma > 0;
  const abs = Math.abs(sigma);
  const pick = (pos, neg) => (isPos ? pos : neg);

  const thresholds = [
    { limit: 0.5, label: "Normal" },
    { limit: 1.0, label: pick("Warm", "Cool") },
    { limit: 2.0, label: pick("Hot", "Cold") },
    { limit: 3.0, label: pick("Very hot", "Very cold") },
    { limit: 4.0, label: pick("Extreme heat", "Extreme cold") },
  ];

  const match = thresholds.find((t) => abs < t.limit);
  return match ? match.label : pick("INSANE HEAT", "INSANE COLD");
}
