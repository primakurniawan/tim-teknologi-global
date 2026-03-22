import { T } from "../theme";

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "...", total];
  if (current >= total - 2) return [1, "...", total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

const PAGE_SIZES = [20, 50, 100];

export default function Pagination({ page, totalPages, total, pageSize, onPageChange, onPageSizeChange }) {
  const pages = getPageNumbers(page, totalPages);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div style={s.wrap}>
      {/* Left: item range */}
      <span style={s.rangeText}>
        {total === 0 ? "No items" : `${from}–${to} of ${total.toLocaleString()}`}
      </span>

      {/* Center: page buttons */}
      <div style={s.pages}>
        {/* First */}
        <NavBtn
          label="«"
          title="First page"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
        />
        {/* Prev */}
        <NavBtn
          label="‹"
          title="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} style={s.ellipsis}>…</span>
          ) : (
            <button
              key={p}
              style={{ ...s.pageBtn, ...(p === page ? s.pageBtnActive : {}) }}
              onClick={() => onPageChange(p)}
              disabled={p === page}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <NavBtn
          label="›"
          title="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        />
        {/* Last */}
        <NavBtn
          label="»"
          title="Last page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
        />
      </div>

      {/* Right: page size */}
      <div style={s.sizeWrap}>
        <span style={s.sizeLabel}>Show</span>
        <div style={{ position: "relative" }}>
          <select
            style={s.sizeSelect}
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
          >
            {PAGE_SIZES.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <svg style={s.sizeChevron} width="10" height="10" fill="none" viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6" stroke={T.textTertiary} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={s.sizeLabel}>per page</span>
      </div>
    </div>
  );
}

function NavBtn({ label, title, disabled, onClick }) {
  return (
    <button
      title={title}
      style={{ ...s.navBtn, ...(disabled ? s.navBtnDisabled : {}) }}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

const s = {
  wrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  rangeText: {
    fontSize: 12,
    color: T.textTertiary,
    fontFamily: T.fontMono,
    minWidth: 120,
  },
  pages: {
    display: "flex",
    alignItems: "center",
    gap: 3,
  },
  navBtn: {
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: T.radiusSm,
    border: `1px solid ${T.border}`,
    background: T.bgCard,
    cursor: "pointer",
    fontSize: 15,
    color: T.textSecondary,
    lineHeight: 1,
    transition: "all 0.1s",
    fontFamily: T.fontBody,
  },
  navBtnDisabled: {
    opacity: 0.3,
    cursor: "not-allowed",
    background: T.bgMuted,
  },
  pageBtn: {
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: T.radiusSm,
    border: `1px solid ${T.border}`,
    background: T.bgCard,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
    color: T.textSecondary,
    transition: "all 0.1s",
    fontFamily: T.fontMono,
  },
  pageBtnActive: {
    background: T.accent,
    borderColor: T.accent,
    color: "#FFFFFF",
    cursor: "default",
    boxShadow: `0 1px 3px rgba(79,70,229,0.4)`,
  },
  ellipsis: {
    width: 24,
    textAlign: "center",
    fontSize: 13,
    color: T.textTertiary,
    fontFamily: T.fontMono,
    userSelect: "none",
  },
  sizeWrap: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    minWidth: 120,
    justifyContent: "flex-end",
  },
  sizeLabel: {
    fontSize: 12,
    color: T.textTertiary,
  },
  sizeSelect: {
    appearance: "none",
    padding: "5px 26px 5px 10px",
    borderRadius: T.radiusSm,
    border: `1px solid ${T.border}`,
    background: T.bgCard,
    fontSize: 12,
    fontFamily: T.fontMono,
    color: T.textPrimary,
    fontWeight: 500,
    cursor: "pointer",
    outline: "none",
  },
  sizeChevron: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
};
