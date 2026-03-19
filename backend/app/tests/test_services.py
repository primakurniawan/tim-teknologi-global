from app.models import InventoryItem
from app.services import get_stock_status
from datetime import datetime


def test_stock_status_out_of_stock():
    item = InventoryItem(
        item_id=1,
        sku="A",
        name="Test",
        category="Cat",
        warehouse="WH",
        quantity_on_hand=0,
        reorder_threshold=5,
        last_updated=datetime.now(),
    )
    assert get_stock_status(item) == "Out of Stock"


def test_stock_status_low_stock():
    item = InventoryItem(
        item_id=1,
        sku="A",
        name="Test",
        category="Cat",
        warehouse="WH",
        quantity_on_hand=3,
        reorder_threshold=5,
        last_updated=datetime.now(),
    )
    assert get_stock_status(item) == "Low Stock"


def test_stock_status_in_stock():
    item = InventoryItem(
        item_id=1,
        sku="A",
        name="Test",
        category="Cat",
        warehouse="WH",
        quantity_on_hand=10,
        reorder_threshold=5,
        last_updated=datetime.now(),
    )
    assert get_stock_status(item) == "In Stock"