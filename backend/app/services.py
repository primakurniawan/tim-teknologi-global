import csv
import io
from datetime import datetime
from typing import List, Optional, Tuple

from app.models import InventoryItem
from app.schemas import ImportRowError
from app.seed import inventory_items


def get_stock_status(item: InventoryItem) -> str:
    if item.quantity_on_hand == 0:
        return "Out of Stock"
    if item.quantity_on_hand <= item.reorder_threshold:
        return "Low Stock"
    return "In Stock"


def filter_inventory(
    items: List[InventoryItem],
    search: Optional[str] = None,
    category: Optional[str] = None,
    warehouse: Optional[str] = None,
    stock_status: Optional[str] = None,
    sort_by: str = "name",
    sort_order: str = "asc",
) -> List[dict]:
    result = []

    for item in items:
        item_dict = item.model_dump()
        item_dict["stock_status"] = get_stock_status(item)
        result.append(item_dict)

    if search:
        search_lower = search.lower()
        result = [
            item for item in result
            if search_lower in item["name"].lower()
            or search_lower in item["sku"].lower()
        ]

    if category:
        result = [item for item in result if item["category"] == category]

    if warehouse:
        result = [item for item in result if item["warehouse"] == warehouse]

    if stock_status:
        result = [item for item in result if item["stock_status"] == stock_status]

    sort_key_map = {
        "name": lambda x: x["name"].lower(),
        "quantity": lambda x: x["quantity_on_hand"],
        "last_updated": lambda x: x["last_updated"],
    }

    reverse = sort_order == "desc"
    result.sort(key=sort_key_map.get(sort_by, sort_key_map["name"]), reverse=reverse)

    return result


def paginate(items: List[dict], page: int = 1, page_size: int = 10) -> dict:
    start = (page - 1) * page_size
    end = start + page_size

    return {
        "items": items[start:end],
        "total": len(items),
        "page": page,
        "page_size": page_size,
        "total_pages": (len(items) + page_size - 1) // page_size,
    }


def process_transaction(item: InventoryItem, transaction_type: str, quantity: int):
    if transaction_type == "restock":
        item.quantity_on_hand += quantity
    elif transaction_type == "sale":
        if quantity > item.quantity_on_hand:
            raise ValueError("Sale quantity exceeds available stock")
        item.quantity_on_hand -= quantity
    elif transaction_type == "adjustment":
        item.quantity_on_hand = quantity
    else:
        raise ValueError("Invalid transaction type")

    item.last_updated = datetime.now()


def import_csv_rows(file_content: bytes) -> Tuple[int, int, int, List[ImportRowError]]:
    decoded = file_content.decode("utf-8")
    reader = csv.DictReader(io.StringIO(decoded))

    errors: List[ImportRowError] = []
    accepted_rows = 0
    total_rows = 0

    for row_number, row in enumerate(reader, start=2):
        total_rows += 1

        try:
            sku = row.get("sku", "").strip()
            warehouse = row.get("warehouse", "").strip()
            transaction_type = row.get("transaction_type", "").strip()
            quantity_raw = row.get("quantity", "").strip()
            timestamp_raw = row.get("timestamp", "").strip()

            if not sku:
                raise ValueError("sku is required")
            if not warehouse:
                raise ValueError("warehouse is required")
            if transaction_type not in ["restock", "sale", "adjustment"]:
                raise ValueError("transaction_type must be restock, sale, or adjustment")

            quantity = int(quantity_raw)
            if quantity < 0:
                raise ValueError("quantity must be >= 0")

            datetime.fromisoformat(timestamp_raw)

            matched_item = next(
                (
                    item for item in inventory_items
                    if item.sku == sku and item.warehouse == warehouse
                ),
                None,
            )

            if not matched_item:
                raise ValueError("inventory item not found for given sku and warehouse")

            process_transaction(matched_item, transaction_type, quantity)
            accepted_rows += 1

        except Exception as exc:
            errors.append(
                ImportRowError(
                    row_number=row_number,
                    message=str(exc),
                )
            )

    rejected_rows = total_rows - accepted_rows
    return total_rows, accepted_rows, rejected_rows, errors


def get_category_summary(items: List[InventoryItem]) -> List[dict]:
    summary = {}

    for item in items:
        category = item.category
        summary[category] = summary.get(category, 0) + item.quantity_on_hand

    return [{"label": key, "value": value} for key, value in summary.items()]