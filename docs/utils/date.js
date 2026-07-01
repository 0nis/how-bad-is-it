/**
 * Format a Date as YYYY-MM-DD for Open-Meteo query params
 *
 * @param {Date} date The date to format
 * @returns {string} The formatted date
 */
export function toDateStr(date) {
  return date.toISOString().slice(0, 10);
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
 * Clones a date and adds/subtracts a specific number of days.
 *
 * @param {Date} date The base date to shift
 * @param {number} days Number of days to add (positive) or subtract (negative)
 * @returns {Date} The shifted date
 */
export function shiftDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

/**
 * Shifts a date by a specific number of years.
 *
 * @param {string} dateStr YYYY-MM-DD
 * @param {number} years Number of years to shift
 * @returns {string} YYYY-MM-DD
 */
export function shiftYears(dateStr, years) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${y - years}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/**
 * Returns the day of the year for a given date.
 *
 * @param {string} dateStr YYYY-MM-DD
 * @returns {number} Day of the year
 */
export function dayOfYear(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));

  const start = Date.UTC(y, 0, 0);
  return Math.floor((date - start) / 86400000);
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
