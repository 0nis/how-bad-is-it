/**
 * Format a Date as YYYY-MM-DD for Open-Meteo query params
 *
 * @param {Date | string} date The date to format
 * @returns {string} The formatted date
 */
export function toDateStr(date) {
  if (date instanceof Date) date = date.toISOString();
  return date.slice(0, 10);
}

/**
 * Get the hour from an ISO 8601 string
 *
 * @param {string} iso ISO 8601
 * @returns {number} The hour (0-23)
 */
export function getHourFromISO(iso) {
  return iso[11] === "T"
    ? Number(iso.slice(11, 13))
    : Number(iso.split("T")[1].slice(0, 2));
}

/**
 * Get the year from an ISO 8601 string
 *
 * @param {string} iso ISO 8601
 * @returns {number} The year (YYYY)
 */
export function getYearFromISO(iso) {
  return Number(iso.slice(0, 4));
}

/**
 * Get the month from an ISO 8601 string
 *
 * @param {string} iso ISO 8601
 * @returns {number} The month (1-12)
 */
export function getMonthFromISO(iso) {
  return Number(iso.slice(5, 7));
}

/**
 * Shifts a YYYY-MM-DD date string by a given number of days.
 * Safe from timezone shifting and correctly accounts for month/year boundaries.
 *
 * @param {string | Date} dateStr YYYY-MM-DD
 * @param {number} days The number of days to shift (can be positive or negative).
 * @returns {string} YYYY-MM-DD
 */
export function shiftDays(dateStr, days) {
  if (dateStr instanceof Date) dateStr = toDateStr(dateStr);
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));

  date.setUTCDate(date.getUTCDate() + days);

  const resY = date.getUTCFullYear();
  const resM = String(date.getUTCMonth() + 1).padStart(2, "0");
  const resD = String(date.getUTCDate()).padStart(2, "0");

  return `${resY}-${resM}-${resD}`;
}

/**
 * Shifts a date by a specific number of years.
 *
 * @param {string | Date} dateStr YYYY-MM-DD
 * @param {number} years Number of years to shift
 * @returns {string} YYYY-MM-DD
 */
export function shiftYears(dateStr, years) {
  if (dateStr instanceof Date) dateStr = toDateStr(dateStr);
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${y - years}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/**
 * Returns the day of the year for a given date.
 *
 * @param {string | Date} dateStr YYYY-MM-DD
 * @returns {number} Day of the year
 */
export function dayOfYear(dateStr) {
  if (dateStr instanceof Date) dateStr = toDateStr(dateStr);
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));

  const start = Date.UTC(y, 0, 0);
  return Math.floor((date - start) / 86400000);
}

/**
 * Clamps a date between a minimum and maximum date
 *
 * @param {string | Date} dateStr YYYY-MM-DD
 * @param {string | Date} min YYYY-MM-DD, inclusive
 * @param {string | Date} max YYYY-MM-DD, inclusive
 * @returns {string} YYYY-MM-DD
 */
export function clampDate(dateStr, min, max) {
  if (min instanceof Date) min = toDateStr(min);
  if (max instanceof Date) max = toDateStr(max);
  if (dateStr instanceof Date) dateStr = toDateStr(dateStr);

  if (dateStr < min) return min;
  if (dateStr > max) return max;

  return dateStr;
}

/**
 * Formats an ISO 8601 string to a human-readable datetime while preserving the original timezone.
 *
 * @param {string} iso ISO 8601 string
 * @returns {string} Formatted date as 'July 14th, 13:00'
 */
export function formatISO(iso) {
  const date = new Date(iso);

  const parts = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value;

  const day = Number(get("day"));

  const ordinal =
    day % 10 === 1 && day % 100 !== 11
      ? "st"
      : day % 10 === 2 && day % 100 !== 12
        ? "nd"
        : day % 10 === 3 && day % 100 !== 13
          ? "rd"
          : "th";

  return `${get("month")} ${day}${ordinal}, ${get("hour")}:${get("minute")}`;
}
