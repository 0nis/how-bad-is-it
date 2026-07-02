import { ARCHIVE_BASE } from "../constants.js";
import { fetchWithRetry } from "./fetch.js";
import { CONDITIONS, DAILY_CONDITIONS } from "../types.js";

/**
 * Fetch hourly historical weather conditions over a date range for a coordinate.
 * Uses ERA5 archive via Open-Meteo's archive API.
 *
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 * @param {number} startDate Show hourly results starting from this date
 * @param {number} endDate Show hourly results until this date
 * @returns {Promise<typeof CONDITIONS[]>}
 */
export async function fetchHourlyHistoricalWeather(
  lat,
  lon,
  startDate,
  endDate,
) {
  const url = new URL(`${ARCHIVE_BASE}/archive`);

  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));

  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);

  url.searchParams.set(
    "hourly",
    [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "precipitation",
      "cloud_cover",
    ].join(","),
  );

  url.searchParams.set("timezone", "auto");

  const res = await fetchWithRetry(url);
  if (!res.ok) throw new Error(`Hourly archive fetch failed: ${res.status}`);

  const data = await res.json();

  const hours = [];
  const h = data.hourly;

  for (let i = 0; i < h.time.length; i++) {
    hours.push({
      datetime: h.time[i],
      temperature: h.temperature_2m[i],
      apparentTemperature: h.apparent_temperature[i],
      humidity: h.relative_humidity_2m[i],
      windSpeed: h.wind_speed_10m[i],
      precipitation: h.precipitation[i],
      cloudCover: h.cloud_cover[i],
    });
  }

  return hours;
}

/**
 * Fetch daily historical weather conditions over a date range for a coordinate.
 * Uses ERA5 archive via Open-Meteo's archive API.
 *
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 * @param {number} startDate Show daily results starting from this date
 * @param {number} endDate Show daily results until this date
 * @returns {Promise<typeof DAILY_CONDITIONS[]>}
 */
export async function fetchDailyHistoricalWeather(
  lat,
  lon,
  startDate,
  endDate,
) {
  const url = new URL(`${ARCHIVE_BASE}/archive`);

  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));

  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);

  url.searchParams.set(
    "daily",
    [
      "temperature_2m_max",
      "temperature_2m_min",
      "apparent_temperature_max",
      "apparent_temperature_min",
    ].join(","),
  );

  url.searchParams.set("timezone", "auto");

  const res = await fetchWithRetry(url);
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(
      `${res.status}: ${res.statusText}${data.reason ? `: ${data.reason}` : ""}`,
    );
  }

  const days = [];
  const d = data.daily;

  for (let i = 0; i < d.time.length; i++) {
    days.push({
      datetime: d.time[i],
      temperature: {
        min: d.temperature_2m_min[i],
        max: d.temperature_2m_max[i],
      },
      apparentTemperature: {
        min: d.apparent_temperature_min[i],
        max: d.apparent_temperature_max[i],
      },
    });
  }

  return days;
}
