import { useEffect, useState } from "react";
import { getInventory, getInsights, getFilterOptions } from "./api";
import InventoryTable from "./components/InventoryTable";
import CsvUpload from "./components/CsvUpload";
import InventoryChart from "./components/InventoryChart";
import Filters from "./components/Filters";
import Pagination from "./components/Pagination";

const defaultOptions = {
  categories: [],
  warehouses: [],
  stock_statuses: [],
};

export default function App() {
  const [inventoryData, setInventoryData] = useState({
    items: [],
    total: 0,
    page: 1,
    page_size: 10,
    total_pages: 1,
  });

  const [chartData, setChartData] = useState([]);
  const [options, setOptions] = useState(defaultOptions);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);

  const fetchInventory = async (pageOverride = page) => {
    const response = await getInventory({
      search,
      category,
      warehouse,
      stock_status: stockStatus,
      sort_by: sortBy,
      sort_order: sortOrder,
      page: pageOverride,
      page_size: 5,
    });

    setInventoryData(response.data);
  };

  const fetchChartData = async () => {
    const response = await getInsights();
    setChartData(response.data);
  };

  const fetchOptions = async () => {
    const response = await getFilterOptions();
    setOptions(response.data);
  };

  useEffect(() => {
    fetchInventory(1);
    fetchChartData();
    fetchOptions();
  }, []);

  const handleApplyFilters = () => {
    setPage(1);
    fetchInventory(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setWarehouse("");
    setStockStatus("");
    setSortBy("name");
    setSortOrder("asc");
    setPage(1);

    setTimeout(() => {
      fetchInventory(1);
    }, 0);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    fetchInventory(nextPage);
  };

  const handleUploadSuccess = async () => {
    await fetchInventory(page);
    await fetchChartData();
    await fetchOptions();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.heading}>Inventory Dashboard</h1>
          <p style={styles.subheading}>
            Internal inventory management module with filtering, CSV import, and data insights.
          </p>
        </header>

        <CsvUpload onUploadSuccess={handleUploadSuccess} />

        <InventoryChart data={chartData} />

        <Filters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          warehouse={warehouse}
          setWarehouse={setWarehouse}
          stockStatus={stockStatus}
          setStockStatus={setStockStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          options={options}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        <InventoryTable data={inventoryData.items} />

        <Pagination
          page={inventoryData.page}
          totalPages={inventoryData.total_pages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "24px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "20px",
  },
  heading: {
    marginBottom: "8px",
  },
  subheading: {
    marginTop: 0,
    color: "#666",
  },
};