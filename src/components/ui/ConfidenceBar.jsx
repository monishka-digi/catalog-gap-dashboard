import { confidenceColor, confidencePercent } from "../../features/catalog-dashboard/utils/catalogDashboardUtils";

function ConfidenceBar({ value }) {
  const color = confidenceColor(value);
  const percent = confidencePercent(value);

  return (
    <div className="conf-bar">
      <div className="conf-track">
        <div className="conf-fill" style={{ width: `${percent}%`, background: color }} />
      </div>
      <span className="conf-label" style={{ color }}>
        {percent}%
      </span>
    </div>
  );
}

export default ConfidenceBar;
