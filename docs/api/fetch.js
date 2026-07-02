export async function fetchWithRetry(url, retries = 5) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url);

    if (res.status !== 429) return res;

    const delay =
      Number(res.headers.get("Retry-After")) * 1000 || 1000 * Math.pow(2, i);

    await new Promise((r) => setTimeout(r, delay));
  }

  throw new Error(
    "Failed to get data from Open-Meteo API due to rate limits, please try again later.",
  );
}
