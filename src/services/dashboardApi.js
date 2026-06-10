const DEMO_API_URL = import.meta.env.VITE_DEMO_API_URL || "https://demo-api.example.com/gap-analysis";

async function callDemoApi(payload, { timeout = 8000, signal } = {}) {
  const controller = new AbortController();
  const mergedSignal = signal ?? controller.signal;
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(DEMO_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: mergedSignal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Demo API returned ${res.status}: ${text}`);
    }

    const json = await res.json();
    return json;
  } finally {
    clearTimeout(timer);
  }
}

export function getGapHeatmapData(payload, opts = {}) {
  return callDemoApi({ type: "gap_heatmap", payload }, opts);
}

export function getDistributionSuggestionData(payload, opts = {}) {
  return callDemoApi({ type: "distribution_suggestion", payload }, opts);
}

export const DEMO_API_URL_CONST = DEMO_API_URL;
