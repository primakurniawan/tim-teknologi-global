export default function Filters({
  search,
  setSearch,
  category,
  setCategory,
  warehouse,
  setWarehouse,
  stockStatus,
  setStockStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  options,
  onApply,
  onReset,
}) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.grid}>
        <input
          style={styles.input}
          type="text"
          placeholder="Search by name or SKU"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {options.categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select style={styles.input} value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
          <option value="">All Warehouses</option>
          {options.warehouses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          style={styles.input}
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value)}
        >
          <option value="">All Stock Statuses</option>
          {options.stock_statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select style={styles.input} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="quantity">Sort by Quantity</option>
          <option value="last_updated">Sort by Last Updated</option>
        </select>

        <select style={styles.input} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div style={styles.actions}>
        <button style={styles.button} onClick={onApply}>
          Apply
        </button>
        <button style={styles.secondaryButton} onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginBottom: "20px",
    padding: "16px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    background: "#fafafa",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginBottom: "12px",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  button: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
  },
};