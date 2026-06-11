function DashboardHeader({ metrics }) {
  return (
    <header className="header">
      <div className="header-top">
        <h1>
          Sentiment Analysis
          <span> &amp; Intelligence Dashboard</span>
        </h1>
        <span className="live-badge">
          <span className="live-dot" />
          Live pipeline
        </span>
      </div>
      <div className="metrics">
        {metrics.map((metric) => (
          <div className={`metric ${metric.className}`} key={metric.label}>
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-detail">{metric.detail}</div>
          </div>
        ))}
      </div>
    </header>
  );
}

export default DashboardHeader;
