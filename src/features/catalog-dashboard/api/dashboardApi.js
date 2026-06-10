import { fallbackDashboardPayload } from "../data/catalogDashboardData.js";

const DASHBOARD_ENDPOINT = "/api/v1/gap-analysis/dashboard";

export async function fetchDashboardData({ signal } = {}) {
  try {
    const response = await fetch(createDashboardUrl(), {
      headers: {
        Accept: "application/json",
      },
      signal,
    });

    if (!response.ok) {
      console.warn(`Dashboard request failed with ${response.status}, falling back to static data.`);
      return normalizeDashboardPayload(fallbackDashboardPayload);
    }

    const payload = await response.json();
    return normalizeDashboardPayload(payload);
  } catch (error) {
    if (error?.name === "AbortError") {
      throw error;
    }

    console.warn("Dashboard fetch failed, falling back to static data.", error);
    return normalizeDashboardPayload(fallbackDashboardPayload);
  }
}

function createDashboardUrl() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!baseUrl) {
    return DASHBOARD_ENDPOINT;
  }

  return `${baseUrl.replace(/\/$/, "")}${DASHBOARD_ENDPOINT}`;
}

export function normalizeDashboardPayload(payload) {
  const result = payload?.result ?? payload;
  const dashboard = result?.dashboard ?? result ?? {};
  const rawGaps = dashboard.heatmap
    ? flattenHeatmap(dashboard.heatmap)
    : dashboard.gaps ?? dashboard.gapHeatmap ?? dashboard.gap_heatmap ?? [];
  const rawSuggestions = dashboard.pending_review ?? dashboard.suggestions ?? dashboard.descriptionSuggestions ?? dashboard.description_suggestions ?? [];

  return {
    gaps: Array.isArray(rawGaps) ? rawGaps.map(normalizeGap) : [],
    suggestions: Array.isArray(rawSuggestions) ? rawSuggestions.map(normalizeSuggestion) : [],
    graphData: dashboard.graph_data ?? dashboard.graphData ?? {},
    summary: dashboard.summary ?? result.summary ?? {},
  };
}

function flattenHeatmap(heatmap) {
  if (!heatmap || typeof heatmap !== "object") {
    return [];
  }

  return Object.values(heatmap).flat();
}

function normalizeGap(gap) {
  return {
    sku: String(gap.sku ?? gap.SKU ?? ""),
    name: String(gap.name ?? gap.productName ?? gap.product_name ?? gap.product ?? ""),
    attr: String(gap.attr ?? gap.attribute ?? gap.missingAttribute ?? gap.missing_attribute ?? ""),
    cat: String(gap.cat ?? gap.category ?? ""),
    freq: Number(gap.freq ?? gap.queryFrequency ?? gap.query_frequency ?? gap.frequency ?? gap.query_frequency ?? 0),
    priority: normalizePriority(gap.priority),
    conf: normalizeConfidence(gap.conf ?? gap.confidence ?? gap.confidence_score ?? gap.generation_confidence),
    lastSeen: String(
      gap.lastSeen ?? gap.last_seen ?? gap.lastSeenAt ?? gap.last_seen_at ?? gap.last_detected_at ?? gap.lastDetectedAt ?? gap.latest_search_query ?? ""
    ),
  };
}

function normalizeSuggestion(suggestion) {
  const oldDescription =
    suggestion.oldDesc ??
    suggestion.oldDescription ??
    suggestion.old_description ??
    suggestion.old_description_html ??
    suggestion.currentDescription ??
    suggestion.current_description ??
    "";

  const revisedDescription =
    suggestion.newDesc ??
    suggestion.newDescription ??
    suggestion.new_description ??
    suggestion.revisedDescription ??
    suggestion.revised_description ??
    suggestion.revised_description_html ??
    suggestion.suggestedDescription ??
    suggestion.suggested_description ??
    "";

  return {
    sku: String(suggestion.sku ?? suggestion.SKU ?? ""),
    name: String(suggestion.name ?? suggestion.productName ?? suggestion.product_name ?? suggestion.product ?? ""),
    attr: String(suggestion.attr ?? suggestion.attribute ?? suggestion.missingAttribute ?? suggestion.missing_attribute ?? ""),
    suggestedVal: String(
      suggestion.suggestedVal ?? suggestion.suggestedValue ?? suggestion.suggested_value ?? suggestion.suggested_attribute_value ?? ""
    ),
    oldDesc: String(oldDescription),
    newDesc: String(revisedDescription),
    old_description: String(oldDescription),
    revised_description: String(revisedDescription),
    conf: normalizeConfidence(
      suggestion.conf ?? suggestion.confidence ?? suggestion.confidence_score ?? suggestion.generation_confidence
    ),
    status: normalizeStatus(suggestion.status ?? suggestion.review_status),
    priority: normalizePriority(suggestion.priority),
    submittedAt: String(
      suggestion.submittedAt ?? suggestion.submitted_at ?? suggestion.createdAt ?? suggestion.created_at ?? suggestion.generated_at ?? ""
    ),
    model: String(
      suggestion.model ?? suggestion.modelVersion ?? suggestion.model_version ?? suggestion.llm_model ?? ""
    ),
    promptVersion: String(suggestion.prompt_version ?? ""),
  };
}

function normalizeConfidence(value) {
  const confidence = Number(value ?? 0);
  return confidence > 1 ? confidence / 100 : confidence;
}

function normalizePriority(value) {
  const priority = String(value ?? "Low").toLowerCase();
  if (priority === "critical") return "Critical";
  if (priority === "high") return "High";
  if (priority === "medium") return "Medium";
  return "Low";
}

function normalizeStatus(value) {
  const status = String(value ?? "Pending review").toLowerCase();
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending review";
}
