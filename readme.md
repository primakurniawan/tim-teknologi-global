# Inventory Module Technical Assessment

This project is a small end-to-end inventory module built with Python and React. It allows users to view inventory items, identify low-stock items, import transactions in bulk via CSV, and view inventory insights through a chart.

## Tech Stack

- Backend: FastAPI (Python)
- Frontend: React + Vite
- API Style: REST
- Testing: pytest
- Charting: Recharts

## Features

### Inventory List

- View inventory items
- Search by item name or SKU
- Filter by category
- Filter by warehouse
- Filter by stock status
- Sort by name, quantity, or last updated
- Pagination support

### Stock Status

Each inventory item includes a derived stock status:

- In Stock
- Low Stock
- Out of Stock

### Bulk Import

Users can upload inventory transactions through CSV.

Supported transaction types:

- restock
- sale
- adjustment

The system:

- validates incoming rows
- applies valid rows
- rejects invalid rows
- returns an import summary with validation errors

### Visualization

A bar chart shows total inventory quantity by category.

## Project Structure

```text
backend/
  app/
    main.py
    models.py
    schemas.py
    seed.py
    services.py
    tests/
frontend/
  src/
    components/
    App.jsx
    api.js
sample-data/
```
