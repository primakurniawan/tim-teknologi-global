import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function InventoryChart({ data }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Inventory Quantity by Category</h2>
      <p style={styles.subtitle}>
        This chart helps users quickly compare stock volume across product categories.
      </p>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
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
    marginBottom: "20px",
  },
  title: {
    marginTop: 0,
    marginBottom: "8px",
  },
  subtitle: {
    marginTop: 0,
    color: "#666",
    fontSize: "14px",
  },
};