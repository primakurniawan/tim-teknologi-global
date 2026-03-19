from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware

from app.seed import inventory_items
from app.services import filter_inventory, paginate, import_csv_rows, get_category_summary

app = FastAPI(title="Inventory Assessment API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/inventory")
def get_inventory(
    search: str | None = None,
    category: str | None = None,
    warehouse: str | None = None,
    stock_status: str | None = None,
    sort_by: str = Query(default="name"),
    sort_order: str = Query(default="asc"),
    page: int = Query(default=1),
    page_size: int = Query(default=10),
):
    filtered = filter_inventory(
        items=inventory_items,
        search=search,
        category=category,
        warehouse=warehouse,
        stock_status=stock_status,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return paginate(filtered, page=page, page_size=page_size)


@app.post("/inventory/import")
async def import_inventory_csv(file: UploadFile = File(...)):
    content = await file.read()
    total_rows, accepted_rows, rejected_rows, validation_errors = import_csv_rows(content)

    return {
        "total_rows": total_rows,
        "accepted_rows": accepted_rows,
        "rejected_rows": rejected_rows,
        "validation_errors": [error.model_dump() for error in validation_errors],
    }


@app.get("/inventory/insights")
def get_inventory_insights():
    return get_category_summary(inventory_items)

@app.get("/inventory/filter-options")
def get_filter_options():
    categories = sorted(list(set(item.category for item in inventory_items)))
    warehouses = sorted(list(set(item.warehouse for item in inventory_items)))

    return {
        "categories": categories,
        "warehouses": warehouses,
        "stock_statuses": ["In Stock", "Low Stock", "Out of Stock"],
    }