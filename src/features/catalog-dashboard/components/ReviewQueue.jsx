import ConfidenceBar from "../../../components/ui/ConfidenceBar";
import SectionTitle from "../../../components/ui/SectionTitle";
import { PriorityBadge } from "../../../components/ui/Badge";
import { suggestionKey } from "../utils/catalogDashboardUtils";

function ReviewQueue({ suggestions, onApprove, onReject, onViewDiff }) {
  return (
    <section className="tab-content active">
      <SectionTitle count={suggestions.length}>Review queue</SectionTitle>
      {suggestions.length === 0 ? (
        <div className="no-data">Review queue is clear!</div>
      ) : (
        <div className="panel">
          <div className="panel-header pending">
            <span>Pending approval</span>
            <div className="ph-right">
              <span className="ph-count">{suggestions.length} items</span>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Attribute</th>
                  <th>Suggested value</th>
                  <th>Priority</th>
                  <th>Confidence</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((suggestion, index) => (
                  <ReviewRow
                    index={index}
                    key={suggestionKey(suggestion)}
                    onApprove={onApprove}
                    onReject={onReject}
                    onViewDiff={onViewDiff}
                    suggestion={suggestion}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

function ReviewRow({ suggestion, index, onApprove, onReject, onViewDiff }) {
  const key = suggestionKey(suggestion);

  return (
    <tr>
      <td>
        <strong>#{index + 1}</strong>
      </td>
      <td>
        <span className="sku-chip">{suggestion.sku}</span>
      </td>
      <td>{suggestion.name}</td>
      <td>
        <code className="attr-code">{suggestion.attr}</code>
      </td>
      <td className="suggested-cell">{suggestion.suggestedVal}</td>
      <td>
        <PriorityBadge priority={suggestion.priority} />
      </td>
      <td>
        <ConfidenceBar value={suggestion.conf} />
      </td>
      <td className="muted-cell">{suggestion.submittedAt}</td>
      <td>
        <div className="queue-actions">
          <button className="btn-sm approve" type="button" onClick={() => onApprove(key)}>
            Approve
          </button>
          <button className="btn-sm reject" type="button" onClick={() => onReject(key)}>
            Reject
          </button>
          <button className="btn-sm view" type="button" onClick={onViewDiff}>
            View diff
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ReviewQueue;
