/**
 * Formats temperature to 1 decimal point, defaulting to °C
 *
 * @param {number} valueC value in °C
 * @param {"metric" | "imperial"} unitSystem metric or imperial
 * @returns {string} Formatted temperature
 */
export function formatTemp(valueC, unitSystem = "metric") {
  if (unitSystem === "imperial") return `${cToF(Number(valueC)).toFixed(1)}°F`;
  return `${Number(valueC).toFixed(1)}°C`;
}

/**
 * Formats precipitation to 1 decimal point, defaulting to mm
 *
 * @param {number} valueMM value in mm
 * @param {"metric" | "imperial"} unitSystem metric or imperial
 * @returns {string} Formatted precipitation
 */
export function formatPrecipitation(value, unitSystem = "metric") {
  if (unitSystem === "imperial")
    return `${mmToIn(Number(value)).toFixed(1)} in.`;
  return `${Number(value).toFixed(1)} mm`;
}

/**
 * Formats wind speed to 1 decimal point, defaulting to km/h
 *
 * @param {number} value value in km/h
 * @param {"metric" | "imperial"} unitSystem metric or imperial
 * @returns {string} Formatted wind speed
 */
export function formatWind(value, unitSystem = "metric") {
  if (unitSystem === "imperial")
    return `${kmhToMph(Number(value)).toFixed(1)} mph`;
  return `${Number(value).toFixed(1)} km/h`;
}

/**
 * @param {number} c °C
 * @returns {number} °F
 */
export function cToF(c) {
  return (c * 9) / 5 + 32;
}

/**
 * @param {number} mm mm (millimeters)
 * @returns {number} in (inches)
 */
export function mmToIn(mm) {
  return mm * 0.0393701;
}

/**
 * @param {number} kmh km/h (kilometers per hour)
 * @returns {number} mph (miles per hour)
 */
export function kmhToMph(kmh) {
  return kmh * 0.621371;
}
