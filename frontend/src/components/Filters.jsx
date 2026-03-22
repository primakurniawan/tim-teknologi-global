import { T } from "../theme";

export default function Filters({
  search, setSearch,
  category, setCategory,
  warehouse, setWarehouse,
  stockStatus, setStockStatus,
  options, onReset, hasActiveFilters,
}) {
  return (
    <div style={s.row}>
      {/* Search */}
      <div style={s.searchWrap}>
        <svg style={s.searchIcon} width="16" height="16" fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke={T.textTertiary} strokeWidth="2"/>
          <path d="m20 20-3-3" stroke={T.textTertiary} strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          style={s.searchInput}
          type="text"
          placeholder="Search name or SKU…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button style={s.clearBtn} onClick={() => setSearch("")} title="Clear">✕</button>
        )}
      </div>

      {/* Dropdowns */}
      <Select value={category} onChange={setCategory} label="Category">
        <option value="">All Categories</option>
        {options.categories.map(c => <option key={c} value={c}>{c}</option>)}
      </Select>

      <Select value={warehouse} onChange={setWarehouse} label="Warehouse">
        <option value="">All Warehouses</option>
        {options.warehouses.map(w => <option key={w} value={w}>{w}</option>)}
      </Select>

      <Select value={stockStatus} onChange={setStockStatus} label="Stock Status">
        <option value="">All Statuses</option>
        {options.stock_statuses.map(s => <option key={s} value={s}>{s}</option>)}
      </Select>

      {/* Reset */}
      {hasActiveFilters && (
        <button style={s.resetBtn} onClick={onReset}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Reset
        </button>
      )}
    </div>
  );
}

function Select({ value, onChange, children }) {
  const active = !!value;
  return (
    <div style={s.selectWrap}>
      <select
        style={{ ...s.select, ...(active ? s.selectActive : {}) }}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {children}
      </select>
      <svg style={s.chevron} width="12" height="12" fill="none" viewBox="0 0 24 24">
        <path d="m6 9 6 6 6-6" stroke={active ? T.accent : T.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

const s = {
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  searchWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: "1 1 220px",
    minWidth: 180,
    maxWidth: 300,
  },
  searchIcon: {
    position: "absolute",
    left: 10,
    pointerEvents: "none",
    flexShrink: 0,
  },
  searchInput: {
    width: "100%",
    padding: "8px 32px 8px 34px",
    borderRadius: T.radius,
    border: `1px solid ${T.border}`,
    fontSize: 13,
    fontFamily: T.fontBody,
    color: T.textPrimary,
    background: T.bgCard,
    outline: "none",
    transition: "border-color 0.15s",
  },
  clearBtn: {
    position: "absolute",
    right: 8,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: T.textTertiary,
    fontSize: 12,
    padding: "2px 4px",
    lineHeight: 1,
  },
  selectWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  select: {
    appearance: "none",
    padding: "8px 30px 8px 12px",
    borderRadius: T.radius,
    border: `1px solid ${T.border}`,
    fontSize: 13,
    fontFamily: T.fontBody,
    color: T.textSecondary,
    background: T.bgCard,
    cursor: "pointer",
    outline: "none",
    minWidth: 140,
  },
  selectActive: {
    border: `1px solid ${T.borderFocus}`,
    background: T.bgAccentLight,
    color: T.accentText,
    fontWeight: 500,
  },
  chevron: {
    position: "absolute",
    right: 8,
    pointerEvents: "none",
  },
  resetBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "8px 12px",
    borderRadius: T.radius,
    border: `1px solid ${T.border}`,
    background: T.bgCard,
    fontSize: 13,
    fontFamily: T.fontBody,
    color: T.textSecondary,
    cursor: "pointer",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
};
