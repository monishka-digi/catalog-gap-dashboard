function Badge({ children, className = "" }) {
  return <span className={`badge ${className}`.trim()}>{children}</span>;
}

export function PriorityBadge({ priority }) {
  return <Badge className={`b-${priority.toLowerCase()}`}>{priority}</Badge>;
}

export function StatusBadge({ status }) {
  const badgeClass = status === "Approved" ? "b-approved" : status === "Rejected" ? "b-rejected" : "b-pending";
  return <Badge className={badgeClass}>{status}</Badge>;
}

export default Badge;
