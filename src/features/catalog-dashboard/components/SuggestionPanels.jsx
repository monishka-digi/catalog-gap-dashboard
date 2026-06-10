import ConfidenceBar from "../../../components/ui/ConfidenceBar";
import SectionTitle from "../../../components/ui/SectionTitle";
import { PriorityBadge, StatusBadge } from "../../../components/ui/Badge";
import { suggestionKey } from "../utils/catalogDashboardUtils";

function SuggestionPanels({ suggestions, onApprove, onReject, onEdit }) {
  return (
    <section className="tab-content active suggestion-tab">
      <SectionTitle count={suggestions.length}>Description suggestions</SectionTitle>
      {suggestions.length === 0 ? (
        <div className="no-data">No suggestions match your filters.</div>
      ) : (
        suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestionKey(suggestion)}
            onApprove={onApprove}
            onEdit={onEdit}
            onReject={onReject}
            suggestion={suggestion}
          />
        ))
      )}
    </section>
  );
}

function SuggestionCard({ suggestion, onApprove, onReject, onEdit }) {
  const key = suggestionKey(suggestion);

  return (
    <div className="desc-panel">
      <div className="desc-meta-row">
        <div className="desc-main-meta">
          <span className="sku-chip">{suggestion.sku}</span>
          <strong className="product-name">{suggestion.name}</strong>
          <code className="attr-code">{suggestion.attr}</code>
          <PriorityBadge priority={suggestion.priority} />
          <StatusBadge status={suggestion.status} />
        </div>
        <div className="desc-side-meta">
          <span>Model {suggestion.model}</span>
          <span className="dot-sep">.</span>
          <span>{suggestion.submittedAt}</span>
          <ConfidenceBar value={suggestion.conf} />
        </div>
      </div>
      <div className="suggested-value">
        <strong>Suggested value:</strong> <span>{suggestion.suggestedVal}</span>
      </div>
      <div className="desc-row">
        <DescriptionBox title="x Current description" tone="old">
          {suggestion.oldDesc || suggestion.old_description || suggestion.currentDescription || suggestion.current_description || "No current description available."}
        </DescriptionBox>
        <DescriptionBox title="✓ Suggested description" tone="new">
          <span
            dangerouslySetInnerHTML={{
              __html:
                suggestion.newDesc || suggestion.revisedDescription || suggestion.revised_description || suggestion.suggestedDescription || suggestion.suggested_description || "No suggested description available.",
            }}
          />
        </DescriptionBox>
      </div>
      {suggestion.status === "Pending review" ? (
        <div className="review-actions">
          <button className="btn btn-approve" type="button" onClick={() => onApprove(key)}>
            ✓ Approve &amp; publish
          </button>
          <button className="btn btn-edit" type="button" onClick={() => onEdit("Edit mode - in real system opens inline editor")}>
            Edit suggestion
          </button>
          <button className="btn btn-reject" type="button" onClick={() => onReject(key)}>
            x Reject
          </button>
        </div>
      ) : (
        <div className="status-note">
          Status: <strong>{suggestion.status}</strong> - no action needed.
        </div>
      )}
    </div>
  );
}

function DescriptionBox({ title, tone, children }) {
  return (
    <div className={`desc-box ${tone}`}>
      <h4>{title}</h4>
      <div className="desc-text">{children}</div>
    </div>
  );
}

export default SuggestionPanels;
