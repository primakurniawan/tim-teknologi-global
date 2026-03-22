import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { T } from "../theme";

const BAR_COLOR = "#6366F1";
const BAR_HOVER = "#4F46E5";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={s.tooltip}>
      <div style={s.tooltipLabel}>{label}</div>
      <div style={s.tooltipValue}>{payload[0].value.toLocaleString()} units</div>
    </div>
  );
}

export default function InventoryChart({ data }) {
  return (
    <div style={s.card}>
      <div style={s.head}>
        <div>
          <h2 style={s.title}>Quantity by Category</h2>
          <p style={s.sub}>Total units on hand across all warehouses</p>
        </div>
        <div style={s.totalBadge}>
          <span style={s.totalNum}>{data.reduce((a, b) => a + b.value, 0).toLocaleString()}</span>
          <span style={s.totalLabel}>total</span>
        </div>
      </div>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={data} barCategoryGap="30%" margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
            <CartesianGrid vertical={false} stroke={T.border} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: T.textTertiary, fontFamily: T.fontBody }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: T.textTertiary, fontFamily: T.fontMono }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: T.bgAccentLight }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={BAR_COLOR} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const s = {
  card: {
    background: T.bgCard,
    borderRadius: T.radiusLg,
    boxShadow: T.shadow,
    padding: "20px",
    height: "100%",
  },
  head: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    color: T.textPrimary,
    marginBottom: 2,
  },
  sub: {
    fontSize: 12,
    color: T.textTertiary,
  },
  totalBadge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  totalNum: {
    fontSize: 22,
    fontWeight: 600,
    color: BAR_COLOR,
    fontFamily: T.fontMono,
    lineHeight: 1,
  },
  totalLabel: {
    fontSize: 11,
    color: T.textTertiary,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  tooltip: {
    background: T.bgHeader,
    border: "none",
    borderRadius: T.radiusSm,
    padding: "8px 12px",
    boxShadow: T.shadowMd,
  },
  tooltipLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  tooltipValue: {
    fontSize: 14,
    fontWeight: 600,
    color: "#FFFFFF",
    fontFamily: T.fontMono,
  },
};
