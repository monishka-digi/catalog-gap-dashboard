function SectionTitle({ count, children }) {
  return (
    <div className="section-title">
      {children} <span className="st-count">{count}</span>
    </div>
  );
}

export default SectionTitle;
