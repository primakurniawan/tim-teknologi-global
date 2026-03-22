import { T } from "../theme";

const SORTABLE = {
  name:         "Name",
  quantity:     "Qty",
  last_updated: "Last Updated",
};

function statusStyle(status) {
  if (status === "Out of Stock") return {
    bg: T.outStockBg, color: T.outStockText, border: T.outStockBorder,
  };
  if (status === "Low Stock") return {
    bg: T.lowStockBg, color: T.lowStockText, border: T.lowStockBorder,
  };
  return {
    bg: T.inStockBg, color: T.inStockText, border: T.inStockBorder,
  };
}

function SortIcon({ active, order }) {
  if (!active) return (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" style={{ opacity: 0.3 }}>
      <path d="M8 9l4-4 4 4M16 15l-4 4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  return order === "asc" ? (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" style={{ color: T.accent }}>
      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) : (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" style={{ color: T.accent }}>
      <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Th({ col, label, sortBy, sortOrder, onSort }) {
  const isSort = col in SORTABLE;
  const isActive = sortBy === col;
  return (
    <th
      onClick={isSort ? () => onSort(col) : undefined}
      style={{
        ...s.th,
        cursor: isSort ? "pointer" : "default",
        color: isActive ? T.accent : T.textSecondary,
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {label}
        {isSort && <SortIcon active={isActive} order={sortOrder} />}
      </span>
    </th>
  );
}

export default function InventoryTable({ data, sortBy, sortOrder, onSort, loading }) {
  return (
    <div style={{ overflowX: "auto", position: "relative" }}>
      {loading && (
        <div style={s.loadingBar}>
          <div style={s.loadingInner} />
        </div>
      )}
      <table style={s.table}>
        <thead>
          <tr>
            <Th col="sku"               label="SKU"              sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <Th col="name"              label="Name"             sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <Th col="category"          label="Category"         sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <Th col="warehouse"         label="Warehouse"        sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <Th col="quantity"          label="Qty on Hand"      sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <Th col="reorder_threshold" label="Reorder At"       sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <Th col="stock_status"      label="Status"           sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <Th col="last_updated"      label="Last Updated"     sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="8" style={s.empty}>
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" style={{ marginBottom: 8, opacity: 0.3 }}>
                  <path d="M3 7h18M3 12h18M3 17h18" stroke={T.textTertiary} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div style={{ fontSize: 14, color: T.textTertiary }}>No items match your filters.</div>
              </td>
            </tr>
          ) : (
            data.map((item, i) => {
              const st = statusStyle(item.stock_status);
              return (
                <tr key={`${item.item_id}-${item.warehouse}`} style={{ background: i % 2 === 1 ? "#FAFBFC" : "white" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.bgHover}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? "#FAFBFC" : "white"}
                >
                  <td style={{ ...s.td, fontFamily: T.fontMono, fontSize: 12, color: T.textSecondary }}>
                    {item.sku}
                  </td>
                  <td style={{ ...s.td, fontWeight: 500, color: T.textPrimary }}>{item.name}</td>
                  <td style={s.td}>
                    <span style={s.categoryChip}>{item.category}</span>
                  </td>
                  <td style={{ ...s.td, color: T.textSecondary }}>{item.warehouse}</td>
                  <td style={{ ...s.td, fontFamily: T.fontMono, fontWeight: 500, textAlign: "right" }}>
                    <span style={{
                      color: item.quantity_on_hand === 0
                        ? T.outStockText
                        : item.quantity_on_hand <= item.reorder_threshold
                          ? T.lowStockText
                          : T.textPrimary,
                    }}>
                      {item.quantity_on_hand.toLocaleString()}
                    </span>
                  </td>
                  <td style={{ ...s.td, fontFamily: T.fontMono, textAlign: "right", color: T.textTertiary }}>
                    {item.reorder_threshold}
                  </td>
                  <td style={s.td}>
                    <span style={{
                      ...s.badge,
                      background: st.bg,
                      color: st.color,
                      border: `1px solid ${st.border}`,
                    }}>
                      {item.stock_status}
                    </span>
                  </td>
                  <td style={{ ...s.td, fontSize: 12, color: T.textTertiary, fontFamily: T.fontMono, whiteSpace: "nowrap" }}>
                    {new Date(item.last_updated).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

const s = {
  loadingBar: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 2,
    background: T.bgAccentLight,
    zIndex: 10,
    overflow: "hidden",
  },
  loadingInner: {
    height: "100%",
    width: "40%",
    background: T.accent,
    animation: "none",
    // We animate via a keyframe defined in index.html
    borderRadius: 2,
    animation: "slideLoad 1.2s ease-in-out infinite",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },
  th: {
    padding: "10px 16px",
    borderBottom: `2px solid ${T.border}`,
    background: "#F8FAFC",
    fontWeight: 500,
    fontSize: 12,
    textAlign: "left",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  td: {
    padding: "11px 16px",
    borderBottom: `1px solid ${T.border}`,
    fontSize: 13,
    color: T.textSecondary,
    transition: "background 0.1s",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "3px 9px",
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
  },
  categoryChip: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 4,
    background: "#F1F5F9",
    color: T.textSecondary,
    fontSize: 12,
    fontWeight: 500,
  },
  empty: {
    padding: "48px 20px",
    textAlign: "center",
    display: "table-cell",
  },
};
