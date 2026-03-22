function getStatusStyle(status) {
  if (status === "Out of Stock") {
    return {
      backgroundColor: "#ffe5e5",
      color: "#b00020",
      fontWeight: "bold",
      padding: "4px 8px",
      borderRadius: "999px",
      display: "inline-block",
    };
  }

  if (status === "Low Stock") {
    return {
      backgroundColor: "#fff4e5",
      color: "#a15c00",
      fontWeight: "bold",
      padding: "4px 8px",
      borderRadius: "999px",
      display: "inline-block",
    };
  }

  return {
    backgroundColor: "#e8f5e9",
    color: "#1b5e20",
    fontWeight: "bold",
    padding: "4px 8px",
    borderRadius: "999px",
    display: "inline-block",
  };
}

export default function InventoryTable({ data }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Inventory List</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>SKU</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Warehouse</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Reorder Threshold</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="8" style={styles.empty}>
                  No inventory items found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={`${item.item_id}-${item.warehouse}`}>
                  <td style={styles.td}>{item.sku}</td>
                  <td style={styles.td}>{item.name}</td>
                  <td style={styles.td}>{item.category}</td>
                  <td style={styles.td}>{item.warehouse}</td>
                  <td style={styles.td}>{item.quantity_on_hand}</td>
                  <td style={styles.td}>{item.reorder_threshold}</td>
                  <td style={styles.td}>
                    <span style={getStatusStyle(item.stock_status)}>
                      {item.stock_status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(item.last_updated).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "16px",
    background: "white",
  },
  title: {
    marginTop: 0,
    marginBottom: "16px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "1px solid #ddd",
    background: "#f8f8f8",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },
  empty: {
    padding: "20px",
    textAlign: "center",
    color: "#666",
  },
};