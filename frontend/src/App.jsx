import { useEffect, useState } from "react";
import { getInventory, getInsights, getFilterOptions } from "./api";
import InventoryTable from "./components/InventoryTable";
import CsvUpload from "./components/CsvUpload";
import InventoryChart from "./components/InventoryChart";
import Filters from "./components/Filters";
import Pagination from "./components/Pagination";
import { T } from "./theme";

const DEFAULT_STATE = {
  search: "",
  category: "",
  warehouse: "",
  stockStatus: "",
  sortBy: "name",
  sortOrder: "asc",
};

export default function App() {
  const [inventoryData, setInventoryData] = useState({
    items: [],
    total: 0,
    page: 1,
    page_size: 20,
    total_pages: 1,
  });
  const [chartData, setChartData] = useState([]);
  const [options, setOptions] = useState({
    categories: [],
    warehouses: [],
    stock_statuses: [],
  });
  const [loading, setLoading] = useState(false);

  // Filter state
  const [search, setSearch] = useState(DEFAULT_STATE.search);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState(DEFAULT_STATE.category);
  const [warehouse, setWarehouse] = useState(DEFAULT_STATE.warehouse);
  const [stockStatus, setStockStatus] = useState(DEFAULT_STATE.stockStatus);
  const [sortBy, setSortBy] = useState(DEFAULT_STATE.sortBy);
  const [sortOrder, setSortOrder] = useState(DEFAULT_STATE.sortOrder);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Debounce search — also resets page
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Main fetch effect — fires whenever any active filter or page changes
  useEffect(() => {
    let active = true;
    setLoading(true);
    getInventory({
      search: debouncedSearch,
      category,
      warehouse,
      stock_status: stockStatus,
      sort_by: sortBy,
      sort_order: sortOrder,
      page,
      page_size: pageSize,
    })
      .then((r) => {
        if (active) setInventoryData(r.data);
      })
      .catch(console.error)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [
    debouncedSearch,
    category,
    warehouse,
    stockStatus,
    sortBy,
    sortOrder,
    page,
    pageSize,
  ]);

  // Load chart + filter options once
  useEffect(() => {
    getInsights()
      .then((r) => setChartData(r.data))
      .catch(console.error);
    getFilterOptions()
      .then((r) => setOptions(r.data))
      .catch(console.error);
  }, []);

  // Dropdown filters reset to page 1
  const handleSetCategory = (v) => {
    setCategory(v);
    setPage(1);
  };
  const handleSetWarehouse = (v) => {
    setWarehouse(v);
    setPage(1);
  };
  const handleSetStockStatus = (v) => {
    setStockStatus(v);
    setPage(1);
  };

  // Column sort — reset to page 1
  const handleSort = (col) => {
    if (sortBy === col) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortOrder("asc");
    }
    setPage(1);
  };

  // Reset all filters (keep pageSize)
  const handleReset = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategory("");
    setWarehouse("");
    setStockStatus("");
    setSortBy(DEFAULT_STATE.sortBy);
    setSortOrder(DEFAULT_STATE.sortOrder);
    setPage(1);
  };

  const handleUploadSuccess = () => {
    getInsights()
      .then((r) => setChartData(r.data))
      .catch(console.error);
    getFilterOptions()
      .then((r) => setOptions(r.data))
      .catch(console.error);
    setPage(1);
  };

  const handlePageSizeChange = (v) => {
    setPageSize(v);
    setPage(1);
  };

  const hasActiveFilters = search || category || warehouse || stockStatus;

  return (
    <div
      style={{
        background: T.bgPage,
        minHeight: "100vh",
        fontFamily: T.fontBody,
      }}
    >
      {/* ── Page Header ─────────────────────────────────────────── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <h1 style={s.headerTitle}>Inventory Dashboard</h1>
          <div style={s.headerStats}>
            <div style={s.statPill}>
              <span style={s.statNum}>{inventoryData.total}</span>
              <span style={s.statLabel}>items</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main style={s.main}>
        {/* Top row: CSV + Chart */}
        <div style={s.topRow}>
          <div style={{ flex: "0 0 340px", minWidth: 0 }}>
            <CsvUpload onUploadSuccess={handleUploadSuccess} />
          </div>
          <div style={{ flex: 1, minWidth: 320 }}>
            <InventoryChart data={chartData} />
          </div>
        </div>

        {/* Table card */}
        <div style={s.tableCard}>
          {/* Card header */}
          <div style={s.tableCardHead}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={s.tableTitle}>Inventory List</h2>
              {hasActiveFilters && <span style={s.filterBadge}>Filtered</span>}
            </div>
            <span style={s.tableCount}>
              {inventoryData.total}{" "}
              {inventoryData.total === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Filter bar */}
          <div style={s.filterBar}>
            <Filters
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={handleSetCategory}
              warehouse={warehouse}
              setWarehouse={handleSetWarehouse}
              stockStatus={stockStatus}
              setStockStatus={handleSetStockStatus}
              options={options}
              onReset={handleReset}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Table */}
          <InventoryTable
            data={inventoryData.items}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            loading={loading}
          />

          {/* Table footer: pagination + page size */}
          <div style={s.tableFooter}>
            <Pagination
              page={inventoryData.page}
              totalPages={inventoryData.total_pages}
              total={inventoryData.total}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

const s = {
  header: {
    background: T.bgHeader,
    borderBottom: `1px solid #1F2937`,
    padding: "0 24px",
  },
  headerInner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "20px 0",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: T.textOnDark,
    letterSpacing: "-0.02em",
  },

  headerStats: {
    paddingTop: 4,
  },
  statPill: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 0,
  },
  statNum: {
    fontSize: 28,
    fontWeight: 600,
    color: "#A5B4FC",
    lineHeight: 1,
    fontFamily: T.fontMono,
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  main: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  topRow: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  tableCard: {
    background: T.bgCard,
    borderRadius: T.radiusLg,
    boxShadow: T.shadow,
    overflow: "hidden",
  },
  tableCardHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px 12px",
    borderBottom: `1px solid ${T.border}`,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: T.textPrimary,
  },
  filterBadge: {
    fontSize: 11,
    fontWeight: 500,
    background: T.bgAccentLight,
    color: T.accentText,
    padding: "2px 8px",
    borderRadius: 99,
    border: `1px solid #C7D2FE`,
  },
  tableCount: {
    fontSize: 13,
    color: T.textTertiary,
    fontFamily: T.fontMono,
  },
  filterBar: {
    borderBottom: `1px solid ${T.border}`,
    background: T.bgMuted,
    padding: "12px 20px",
  },
  tableFooter: {
    borderTop: `1px solid ${T.border}`,
    background: T.bgMuted,
    padding: "12px 20px",
  },
};
