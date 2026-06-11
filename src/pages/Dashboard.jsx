import { useEffect, useMemo, useState } from "react";
import ChartsGrid from "../features/catalog-dashboard/components/ChartsGrid";
import DashboardHeader from "../features/catalog-dashboard/components/DashboardHeader";
import DashboardToolbar from "../features/catalog-dashboard/components/DashboardToolbar";
import GapHeatmap from "../features/catalog-dashboard/components/GapHeatmap";
import ReviewQueue from "../features/catalog-dashboard/components/ReviewQueue";
import SuggestionPanels from "../features/catalog-dashboard/components/SuggestionPanels";
import { fetchDashboardData } from "../features/catalog-dashboard/api/dashboardApi";
import {
  categories,
  chartColors,
  priorities,
  statuses,
  fallbackDashboardPayload,
} from "../features/catalog-dashboard/data/catalogDashboardData";
import { getGapHeatmapData, getDistributionSuggestionData } from "../services/dashboardApi";
import { normalizeDashboardPayload } from "../features/catalog-dashboard/api/dashboardApi";
import "../features/catalog-dashboard/styles/catalogDashboard.css";
import { suggestionKey } from "../features/catalog-dashboard/utils/catalogDashboardUtils";
import Toast from "../components/ui/Toast";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("gaps");
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    priority: "",
    status: "",
  });
  const [approvedKeys, setApprovedKeys] = useState(new Set());
  const [rejectedKeys, setRejectedKeys] = useState(new Set());
  const [dashboardData, setDashboardData] = useState({ gaps: [], suggestions: [], graphData: {}, summary: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [toast, setToast] = useState("");

  // Demo payloads (can be replaced by real payloads later)
  const DEMO_PAYLOAD_HEATMAP = {
    correlation_id: "",
    raw_text_query: "catalog gap analysis",
    user_info: {
      identity: { user_id: "acme_admin", email: "admin@acme.com", name: "Acme Admin", tenant_id: "ACME" },
      auth: { api_key: "ACME-ENTERPRISE-KEY"},
      license: { tenant_id: "ACME", plan: "NORMAL", subscription_level: "TRIAL", rate_limit: 10000 },
      rbac: { roles: ["CUSTOMER_ADMIN"], permissions: ["ALL"] },
      abac: {},
    },
    action: { actionPerformed: "Need Data", payload: {"description": "Generate dashboard data"} },
    files: [],
    execution_params: { sku_ids: [], sku_id: "", sku: "", query: "", run_id: "string", additionalProp1: {} },
    channel_type: "WEB",
    source_system: "ADMIN_CONSOLE",
    locale: "en-IN",
    status: "SUCCESS",
  };

  const DEMO_PAYLOAD_DISTRIBUTION = {
    correlation_id: "",
    raw_text_query: "description generation",
    user_info: {
      identity: { user_id: "acme_admin", email: "admin@acme.com", name: "Acme Admin", tenant_id: "ACME" },
      auth: { api_key: "ACME-ENTERPRISE-KEY", use_idp: false, idp_type: "", idp_server: {}, id_token: "", access_token: "", internal_token: "" },
      license: { tenant_id: "ACME", plan: "NORMAL", subscription_level: "TRIAL", rate_limit: 10000 },
      rbac: { roles: ["CUSTOMER_ADMIN"], permissions: ["ALL"] },
      abac: { },
    },
    action: { actionPerformed: "Need Data", payload: {"description": "Generate description suggestions"} },
    files: [],
    execution_params: { sku_ids: [], sku_id: "", sku: "", query: "", run_id: "string", additionalProp1: {} },
    channel_type: "WEB",
    source_system: "ADMIN_CONSOLE",
    locale: "en-IN",
    status: "SUCCESS",
  };

  const FALLBACK_DESCRIPTION_SUGGESTIONS = [
    {
      id: 2,
      gap_id: 23,
      sku: "SKU_304",
      product_catalog_id: 693,
      product_name: "GamingBeast 17 Laptop",
      category: "Laptops",
      brand: "ROG",
      missing_attribute: "weight_grams",
      attribute_category: "Other",
      priority: "MEDIUM",
      query_frequency: 1,
      suggested_attribute_value: "2950",
      old_description: "A high-end 17-inch gaming laptop packed with desktop-class performance graphics.",
      revised_description: "A high-end 17-inch gaming laptop, weighing 2950 grams, packed with desktop-class performance graphics.",
      generation_confidence: "0.9446",
      llm_model: "gemini-2.5-flash",
      prompt_version: "v1",
      model_version: "v1.0",
      review_status: "PENDING_REVIEW",
      reviewed_by: null,
      review_comment: null,
      reviewed_at: null,
      generated_at: "2026-06-09T14:19:55",
    },
    {
      id: 1,
      gap_id: 22,
      sku: "SKU_005",
      product_catalog_id: 694,
      product_name: "TravelPad Compact Keyboard",
      category: "Accessories",
      brand: "Logitech",
      missing_attribute: "battery_life",
      attribute_category: "Power",
      priority: "HIGH",
      query_frequency: 1,
      suggested_attribute_value: "Up to 24 months",
      old_description: "A portable, ultra-slim wireless keyboard built for multi-device travel setups.",
      revised_description: "A portable, ultra-slim wireless keyboard offering up to 24 months of battery life, built for seamless multi-device travel setups.",
      generation_confidence: "0.9840",
      llm_model: "gemini-2.5-flash",
      prompt_version: "v1",
      model_version: "v1.0",
      review_status: "PENDING_REVIEW",
      reviewed_by: null,
      review_comment: null,
      reviewed_at: null,
      generated_at: "2026-06-08T16:55:14",
    },
  ];

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setLoadError("");

        // Priority 1: Demo API
        try {
          const demoResp = await getGapHeatmapData(DEMO_PAYLOAD_HEATMAP, { signal: controller.signal });
          if (demoResp && demoResp.success) {
            setDashboardData(normalizeDashboardPayload(demoResp));
            return;
          }
        } catch (e) {
          if (e?.name === "AbortError") throw e;
          console.warn("Demo heatmap API failed, falling back to existing API", e);
        }

        // Priority 2: Existing API
        try {
          const existing = await fetchDashboardData({ signal: controller.signal });
          if (existing) {
            setDashboardData(existing);
            return;
          }
        } catch (e) {
          if (e?.name === "AbortError") throw e;
          console.warn("Existing API failed, falling back to static data", e);
        }

        // Priority 3: Static fallback
        setDashboardData(normalizeDashboardPayload(fallbackDashboardPayload));
      } catch (error) {
        if (error?.name !== "AbortError") {
          setLoadError(error?.message || "Unable to load dashboard data.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => controller.abort();
  }, []);

  // Tab change handler that triggers demo API for Distribution Suggestion
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (tab !== "suggestions") return;

    const controller = new AbortController();
    try {
      setIsLoading(true);
      setLoadError("");

      // Priority 1: Demo API for distribution suggestion
      try {
        const demoResp = await getDistributionSuggestionData(DEMO_PAYLOAD_DISTRIBUTION, { signal: controller.signal });
        if (demoResp && demoResp.success) {
          const normalizedDemo = normalizeDashboardPayload(demoResp);
          if (normalizedDemo.suggestions.length > 0 && hasSuggestionDescriptions(normalizedDemo.suggestions)) {
            setDashboardData(normalizedDemo);
            return;
          }
        }
      } catch (e) {
        if (e?.name === "AbortError") throw e;
        console.warn("Demo distribution API failed, trying existing API", e);
      }

      // Priority 2: Existing API
      try {
        const existing = await fetchDashboardData({ signal: controller.signal });
        if (existing && existing.suggestions.length > 0 && hasSuggestionDescriptions(existing.suggestions)) {
          setDashboardData(existing);
          return;
        }
      } catch (e) {
        if (e?.name === "AbortError") throw e;
        console.warn("Existing API failed, falling back to static data", e);
      }

      // Priority 3: Static fallback for description suggestions
      const fallbackDashboard = normalizeDashboardPayload(fallbackDashboardPayload);
      const fallbackSuggestions = normalizeDashboardPayload({ success: true, result: { suggestions: FALLBACK_DESCRIPTION_SUGGESTIONS } });
      setDashboardData({
        ...fallbackDashboard,
        suggestions: fallbackSuggestions.suggestions,
      });
    } catch (error) {
      if (error?.name !== "AbortError") setLoadError(error?.message || "Unable to load distribution data.");
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  };

  const filteredGaps = useMemo(() => {
    const query = filters.search.toLowerCase();

    return dashboardData.gaps.filter(
      (gap) =>
        (!query || gap.sku.toLowerCase().includes(query) || gap.name.toLowerCase().includes(query) || gap.attr.toLowerCase().includes(query)) &&
        (!filters.category || gap.cat === filters.category) &&
        (!filters.priority || gap.priority === filters.priority),
    );
  }, [dashboardData.gaps, filters.category, filters.priority, filters.search]);

  const filteredSuggestions = useMemo(() => {
    const query = filters.search.toLowerCase();

    return dashboardData.suggestions
      .map((suggestion) => {
        let currentStatus = suggestion.status;
        const key = suggestionKey(suggestion);
        if (approvedKeys.has(key)) currentStatus = "Approved";
        if (rejectedKeys.has(key)) currentStatus = "Rejected";
        return { ...suggestion, status: currentStatus };
      })
      .filter(
        (suggestion) =>
          (!query || suggestion.sku.toLowerCase().includes(query) || suggestion.name.toLowerCase().includes(query)) &&
          (!filters.status || suggestion.status === filters.status),
      );
  }, [approvedKeys, dashboardData.suggestions, filters.search, filters.status, rejectedKeys]);

  function hasSuggestionDescriptions(suggestions) {
    return suggestions.some((suggestion) => {
      const oldText =
        suggestion.oldDesc ||
        suggestion.old_description ||
        suggestion.currentDescription ||
        suggestion.current_description ||
        "";
      const newText =
        suggestion.newDesc ||
        suggestion.newDescription ||
        suggestion.revisedDescription ||
        suggestion.revised_description ||
        suggestion.suggestedDescription ||
        suggestion.suggested_description ||
        "";
      return Boolean(oldText.trim() || newText.trim());
    });
  }

  const metrics = useMemo(() => createMetrics(dashboardData, filteredGaps, filteredSuggestions), [dashboardData, filteredGaps, filteredSuggestions]);
  const chartData = useMemo(() => createChartData(dashboardData, filteredGaps, filteredSuggestions), [dashboardData, filteredGaps, filteredSuggestions]);
  const categoryOptions = useMemo(() => {
    const apiCategories = [...new Set(dashboardData.gaps.map((gap) => gap.cat).filter(Boolean))].sort();
    return apiCategories.length ? apiCategories : categories;
  }, [dashboardData.gaps]);
  const maxFrequency = Math.max(...filteredGaps.map((gap) => gap.freq), 1);
  const pendingSuggestions = filteredSuggestions.filter((suggestion) => suggestion.status === "Pending review");

  const setFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };

  const approveSuggestion = (key) => {
    setApprovedKeys((current) => new Set(current).add(key));
    setRejectedKeys((current) => {
      const next = new Set(current);
      next.delete(key);
      return next;
    });
    showToast("Approved - attribute and description updated in catalog");
  };

  const rejectSuggestion = (key) => {
    setRejectedKeys((current) => new Set(current).add(key));
    setApprovedKeys((current) => {
      const next = new Set(current);
      next.delete(key);
      return next;
    });
    showToast("Rejected - feedback logged for model improvement");
  };

  return (
    <>
      <DashboardHeader metrics={metrics} />
      <main className="container">
        <DashboardToolbar
          activeTab={activeTab}
          categoryOptions={categoryOptions}
          filters={filters}
          priorityOptions={priorities}
          statusOptions={statuses}
          onFilterChange={setFilter}
          onTabChange={handleTabChange}
        />
        {isLoading && <DashboardNotice>Loading dashboard data...</DashboardNotice>}
        {loadError && <DashboardNotice tone="error">Unable to load dashboard data: {loadError}</DashboardNotice>}
        {(activeTab === "gaps" || activeTab === "suggestions") && <ChartsGrid chartData={chartData} />}
        {activeTab === "gaps" && <GapHeatmap gaps={filteredGaps} maxFreq={maxFrequency} onGenerate={showToast} />}
        {activeTab === "suggestions" && (
          <SuggestionPanels suggestions={filteredSuggestions} onApprove={approveSuggestion} onEdit={showToast} onReject={rejectSuggestion} />
        )}
        {activeTab === "review" && (
          <ReviewQueue suggestions={pendingSuggestions} onApprove={approveSuggestion} onReject={rejectSuggestion} onViewDiff={() => setActiveTab("suggestions")} />
        )}
      </main>
      <Toast message={toast} />
    </>
  );
}

function DashboardNotice({ children, tone = "info" }) {
  return <div className={`dashboard-notice ${tone}`}>{children}</div>;
}

function createMetrics(dashboardData, gaps, suggestions) {
  const summary = dashboardData.summary ?? {};
  const critical = gaps.filter((gap) => gap.priority === "Critical").length;
  const pending = suggestions.filter((suggestion) => suggestion.status === "Pending review").length;
  const approved = suggestions.filter((suggestion) => suggestion.status === "Approved").length;
  const skus = new Set(gaps.map((gap) => gap.sku)).size;

  return [
    { label: "Total gaps", value: gaps.length, detail: `Across ${skus} SKUs`, className: "m-total" },
    { label: "Critical gaps", value: critical, detail: `${gaps.length ? Math.round((critical / gaps.length) * 100) : 0}% of total`, className: "m-critical" },
    { label: "Affected SKUs", value: skus, detail: "Needing enrichment", className: "m-skus" },
    { label: "Pending review", value: pending, detail: "Suggestions awaiting", className: "m-pending" },
    { label: "Approved", value: approved, detail: "Live in catalog", className: "m-approved" },
    { label: "Suggestions total", value: summary.total_suggestions ?? suggestions.length, detail: "Generated by LLM", className: "m-gaps" },
  ];
}

function createChartData(dashboardData, gaps, suggestions) {
  const graph = dashboardData.graphData ?? {};
  const attrSource = graph.gap_frequency_by_attribute ?? graph.suggestions_by_attribute ?? [];
  const categorySource = graph.gap_by_category ?? graph.suggestions_by_category ?? [];
  const statusSource = graph.suggestion_status ?? [];
  const prioritySource = graph.priority_distribution ?? [];

  const frequencyLabels = attrSource.length
    ? attrSource.map((item) => String(item.missing_attribute ?? item.attribute ?? item.attr ?? item.name ?? "").replace(/_/g, " "))
    : [...new Set(gaps.map((gap) => gap.attr))];
  const frequencyValues = attrSource.length
    ? attrSource.map((item) => Number(item.count ?? item.query_frequency ?? item.total_frequency ?? 0))
    : frequencyLabels.map((attr) => gaps.filter((gap) => gap.attr === attr).reduce((sum, gap) => sum + gap.freq, 0));

  const categoryLabels = categorySource.length ? categorySource.map((item) => String(item.category ?? item.cat ?? "")) : [...new Set(gaps.map((gap) => gap.cat))];
  const categoryValues = categorySource.length ? categorySource.map((item) => Number(item.count ?? item.total_frequency ?? 0)) : categoryLabels.map((cat) => gaps.filter((gap) => gap.cat === cat).length);

  const statusLabels = statusSource.length ? statusSource.map((item) => String(item.review_status ?? item.status ?? "")) : statuses;
  const statusValues = statusSource.length ? statusSource.map((item) => Number(item.count ?? 0)) : statuses.map((status) => suggestions.filter((suggestion) => suggestion.status === status).length);

  const priorityLabels = prioritySource.length ? prioritySource.map((item) => String(item.priority ?? "")) : priorities;
  const priorityValues = prioritySource.length
    ? prioritySource.map((item) => Number(item.count ?? item.total_frequency ?? 0))
    : priorities.map((priority) => suggestions.filter((suggestion) => suggestion.priority === priority).length);

  return {
    frequency: {
      labels: frequencyLabels,
      datasets: [{ label: "Query frequency", data: frequencyValues, backgroundColor: chartColors, borderRadius: 6 }],
    },
    priority: {
      labels: priorityLabels,
      datasets: [{ data: priorityValues, backgroundColor: ["#ff6b6b", "#ff922b", "#4dabf7", "#94a3b8"], borderColor: "#fff", borderWidth: 3 }],
    },
    category: {
      labels: categoryLabels,
      datasets: [{ label: "Item count", data: categoryValues, backgroundColor: "#667eea", borderRadius: 6 }],
    },
    status: {
      labels: statusLabels,
      datasets: [{ data: statusValues, backgroundColor: ["#ffd43b", "#51cf66", "#ff6b6b"], borderColor: "#fff", borderWidth: 3 }],
    },
  };
}

export default Dashboard;
