import Badge from "../../../components/ui/Badge";
import ConfidenceBar from "../../../components/ui/ConfidenceBar";
import SectionTitle from "../../../components/ui/SectionTitle";
import { priorities } from "../data/catalogDashboardData";
import { groupByPriority } from "../utils/catalogDashboardUtils";

function GapHeatmap({ gaps, maxFreq, onGenerate }) {
  const byPriority = groupByPriority(gaps, priorities);

  return (
    <section className="tab-content active">
      <SectionTitle count={gaps.length}>Gap heatmap</SectionTitle>
      {gaps.length === 0 ? (
        <div className="no-data">No gaps match your filters.</div>
      ) : (
        priorities.map((priority) => {
          const rows = byPriority[priority];
          if (!rows.length) return null;

          return (
            <div className="panel" key={priority}>
              <div className={`panel-header ${priority.toLowerCase()}`}>
                <span>{priority} priority gaps</span>
                <div className="ph-right">
                  <span className="ph-count">{rows.length} gaps</span>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>SKU</th>
                      <th>Product</th>
                      <th>Missing attribute</th>
                      <th>Category</th>
                      <th>Query frequency</th>
                      <th>Confidence</th>
                      <th>Last seen</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((gap, index) => (
                      <GapRow gap={gap} index={index} key={`${gap.sku}-${gap.attr}`} maxFreq={maxFreq} onGenerate={onGenerate} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}

function GapRow({ gap, index, maxFreq, onGenerate }) {
  const pct = Math.round((gap.freq / maxFreq) * 100);

  return (
    <tr>
      <td>
        <strong>#{index + 1}</strong>
      </td>
      <td>
        <span className="sku-chip">{gap.sku}</span>
      </td>
      <td>{gap.name}</td>
      <td>
        <code className="attr-code">{gap.attr}</code>
      </td>
      <td>
        <Badge className="cat-badge">{gap.cat}</Badge>
      </td>
      <td>
        <div className="freq-bar-wrap">
          <div className="freq-bar" style={{ width: `${Math.max(pct, 4)}px` }} />
          <strong className="freq-value">{gap.freq.toLocaleString()}</strong>
        </div>
      </td>
      <td>
        <ConfidenceBar value={gap.conf} />
      </td>
      <td className="muted-cell">{gap.lastSeen}</td>
      <td>
        <button className="btn-sm view" type="button" onClick={() => onGenerate(`Generating suggestion for ${gap.attr} on ${gap.sku}...`)}>
          Generate suggestion
        </button>
      </td>
    </tr>
  );
}

export default GapHeatmap;
