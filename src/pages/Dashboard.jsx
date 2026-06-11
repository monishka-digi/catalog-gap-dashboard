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
  fallbackGapDashboardPayload,
  fallbackSuggestionDashboardPayload,
} from "../features/catalog-dashboard/data/catalogDashboardData";
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


  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setLoadError("");

        try {
          const existing = await fetchDashboardData({ signal: controller.signal, fallbackPayload: fallbackGapDashboardPayload });
          if (existing) {
            setDashboardData(existing);
            return;
          }
        } catch (e) {
          if (e?.name === "AbortError") throw e;
          console.warn("Dashboard API failed, falling back to static gap data", e);
        }

        setDashboardData(normalizeDashboardPayload(fallbackGapDashboardPayload));
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

  // Tab change handler that loads suggestion distribution data when switching to the Suggestions tab
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (tab !== "suggestions") return;

    const controller = new AbortController();
    try {
      setIsLoading(true);
      setLoadError("");

      try {
        const existing = await fetchDashboardData({ signal: controller.signal, fallbackPayload: fallbackSuggestionDashboardPayload });
        if (existing && existing.suggestions.length > 0) {
          setDashboardData(existing);
          return;
        }
      } catch (e) {
        if (e?.name === "AbortError") throw e;
        console.warn("Dashboard API failed for suggestion distribution, falling back to static suggestion data", e);
      }

      setDashboardData(normalizeDashboardPayload(fallbackSuggestionDashboardPayload));
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
