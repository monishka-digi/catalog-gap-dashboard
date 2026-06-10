import { tabs } from "../data/catalogDashboardData";

function DashboardToolbar({ activeTab, categoryOptions, filters, priorityOptions, statusOptions, onFilterChange, onTabChange }) {
  return (
    <div className="toolbar">
      <input type="text" placeholder="Search SKU or product name..." value={filters.search} onChange={(event) => onFilterChange("search", event.target.value)} />
      <FilterSelect label="All categories" value={filters.category} options={categoryOptions} onChange={(value) => onFilterChange("category", value)} />
      <FilterSelect label="All priorities" value={filters.priority} options={priorityOptions} onChange={(value) => onFilterChange("priority", value)} />
      <FilterSelect label="All statuses" value={filters.status} options={statusOptions} onChange={(value) => onFilterChange("status", value)} />
      <div className="tab-bar">
        {tabs.map((tab) => (
          <button className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} key={tab.id} type="button" onClick={() => onTabChange(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{label}</option>
      {options.map((item) => (
        <option key={item}>{item}</option>
      ))}
    </select>
  );
}

export default DashboardToolbar;
