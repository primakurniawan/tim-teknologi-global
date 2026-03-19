from datetime import datetime
from app.models import InventoryItem

inventory_items = [
    InventoryItem(
        item_id=1,
        sku="SKU-001",
        name="Brake Pad",
        category="Brakes",
        warehouse="Jakarta",
        quantity_on_hand=20,
        reorder_threshold=10,
        last_updated=datetime.fromisoformat("2026-03-18T10:00:00"),
    ),
    InventoryItem(
        item_id=2,
        sku="SKU-002",
        name="Oil Filter",
        category="Engine",
        warehouse="Jakarta",
        quantity_on_hand=5,
        reorder_threshold=8,
        last_updated=datetime.fromisoformat("2026-03-18T11:00:00"),
    ),
    InventoryItem(
        item_id=3,
        sku="SKU-003",
        name="Air Filter",
        category="Engine",
        warehouse="Bandung",
        quantity_on_hand=0,
        reorder_threshold=5,
        last_updated=datetime.fromisoformat("2026-03-18T09:00:00"),
    ),
    InventoryItem(
        item_id=4,
        sku="SKU-004",
        name="Spark Plug",
        category="Ignition",
        warehouse="Surabaya",
        quantity_on_hand=15,
        reorder_threshold=7,
        last_updated=datetime.fromisoformat("2026-03-17T15:00:00"),
    ),
]