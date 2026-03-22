# Inventory Module — Technical Assessment

A full-stack inventory management module built with **FastAPI** (Python) and **React**. Users can view inventory items, identify low-stock items, import transactions in bulk via CSV, and explore inventory insights through a chart.

---

## Tech Stack

| Layer     | Technology                      |
| --------- | ------------------------------- |
| Backend   | Python 3.11+, FastAPI, Pydantic |
| Frontend  | React 18, Vite, Recharts        |
| API Style | REST                            |
| Testing   | pytest, FastAPI TestClient      |

---

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install fastapi uvicorn pydantic python-multipart
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.  
Interactive API docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend/frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## How to Run Tests

```bash
cd backend
source venv/bin/activate
pip install pytest httpx
pytest app/tests/ -v
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  React Frontend (Vite)               │
│  ┌──────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Filters  │ │ Table  │ │  Chart   │ │CsvUpload │ │
│  └──────────┘ └────────┘ └──────────┘ └──────────┘ │
└─────────────────────────┬───────────────────────────┘
                          │ REST (axios)
┌─────────────────────────▼───────────────────────────┐
│               FastAPI Backend                        │
│  GET  /inventory              — list + filter        │
│  POST /inventory/import       — bulk CSV upload      │
│  GET  /inventory/insights     — chart summary data   │
│  GET  /inventory/filter-options — dynamic dropdowns  │
└─────────────────────────┬───────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────┐
│          In-Memory Data Store (seed.py)              │
│  200 inventory items across 5 warehouses             │
└─────────────────────────────────────────────────────┘
```

**Key modules:**

- `app/main.py` — FastAPI app, route definitions, CORS config
- `app/services.py` — all business logic (filtering, sorting, pagination, CSV import, chart summary)
- `app/models.py` — Pydantic model for `InventoryItem`
- `app/schemas.py` — request/response schemas
- `app/seed.py` — 200 in-memory inventory items used as the data source

---

## Assumptions

- **Stock status logic:** An item is _Out of Stock_ if `quantity_on_hand == 0`. It is _Low Stock_ if `quantity_on_hand <= reorder_threshold` (including equal). Otherwise it is _In Stock_. The threshold field captures reorder intent, so being at or below it represents a risk state.
- **Partial CSV import:** Valid rows are applied immediately, even when other rows in the same file fail. This is intentional — for bulk operations in a warehouse context, rejecting an entire file because one row has a typo would be disruptive. The response always returns per-row error details.
- **Sale quantity:** A sale row with a quantity that would bring stock below zero is rejected with a validation error. Negative quantities are also rejected.
- **Adjustment transactions:** The `adjustment` transaction type sets `quantity_on_hand` to the supplied value absolutely (i.e., it is a stock-count correction, not a delta).
- **Timestamp format:** ISO 8601 (`YYYY-MM-DDTHH:MM:SS`) is required in CSV rows. Other formats are rejected.
- **Data persistence:** Inventory state is held in memory and resets on server restart (see Tradeoffs).

---

## Visualization — Chart Type Justification

A **bar chart** (Recharts `BarChart`) was chosen to display total inventory quantity by category. Bar charts are the clearest choice for comparing a single numeric measure across a discrete set of named categories — the height of each bar immediately communicates relative magnitude, making category imbalances visible at a glance. An alternative like a pie chart would work for proportional share but becomes hard to read with 8–10 categories and doesn't encode absolute quantities well. A line chart would imply a time series, which is not what this data represents.

---

## Tradeoffs & Limitations

| Area                  | Decision                         | Tradeoff                                                                                                      |
| --------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Data layer**        | In-memory list in `seed.py`      | Simple to set up; data resets on server restart. A real deployment would use a database (PostgreSQL, SQLite). |
| **State management**  | React `useState` + prop drilling | Sufficient for this scope; a larger app would benefit from Context or a state library.                        |
| **CSV import**        | Partial success (row-by-row)     | Easier to recover from bad data; could be a problem if atomicity is required across the whole file.           |
| **No authentication** | None implemented                 | Appropriate for an internal prototype; a production system needs auth.                                        |
| **Frontend tests**    | Not included                     | The component structure is straightforward; Vitest + React Testing Library would cover it.                    |

---

## Improvements With More Time

1. **Persistent database** — replace `seed.py` with SQLite (via SQLModel) or PostgreSQL to survive restarts and support multi-user access.
2. **Database migrations** — Alembic for schema evolution.
3. **Authentication** — JWT-based auth for the API.
4. **Frontend tests** — Vitest + React Testing Library for component behavior and CSV upload flow.
5. **Docker setup** — `docker-compose.yml` for one-command startup.
6. **Additional charts** — low-stock items per warehouse (grouped bar or heatmap) to surface warehouse-level risk alongside the category summary.
7. **Optimistic UI updates** — reflect CSV import results instantly without a full refetch.
8. **Pagination improvements** — URL-synced page state so browser back/forward works correctly.
9. **Input debounce** — debounce the search field to reduce API calls while typing.
10. **Error boundaries** — React error boundaries to gracefully handle API failures.

---

## API Reference

| Method | Path                        | Description                                    |
| ------ | --------------------------- | ---------------------------------------------- |
| `GET`  | `/inventory`                | List items with filtering, sorting, pagination |
| `POST` | `/inventory/import`         | Upload a CSV file of inventory transactions    |
| `GET`  | `/inventory/insights`       | Quantity totals grouped by category            |
| `GET`  | `/inventory/filter-options` | Available categories, warehouses, statuses     |

### Query parameters for `GET /inventory`

| Param          | Type   | Default | Description                                   |
| -------------- | ------ | ------- | --------------------------------------------- |
| `search`       | string | —       | Filter by item name or SKU (case-insensitive) |
| `category`     | string | —       | Filter by exact category name                 |
| `warehouse`    | string | —       | Filter by exact warehouse name                |
| `stock_status` | string | —       | `In Stock` / `Low Stock` / `Out of Stock`     |
| `sort_by`      | string | `name`  | `name` / `quantity` / `last_updated`          |
| `sort_order`   | string | `asc`   | `asc` / `desc`                                |
| `page`         | int    | `1`     | Page number                                   |
| `page_size`    | int    | `10`    | Items per page                                |

---

## Sample Data

The `sample-data/` folder contains CSV files you can use to test the bulk import:

- `inventory-transactions-valid.csv` — all rows valid
- `inventory-transactions-mixed.csv` — mix of valid and invalid rows to demonstrate partial-success handling
