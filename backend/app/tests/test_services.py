from app.models import InventoryItem
from app.services import get_stock_status, import_csv_rows
from datetime import datetime


# ---------------------------------------------------------------------------
# Stock status logic
# ---------------------------------------------------------------------------

def test_stock_status_out_of_stock():
    item = InventoryItem(
        item_id=1, sku="A", name="Test", category="Cat", warehouse="WH",
        quantity_on_hand=0, reorder_threshold=5, last_updated=datetime.now(),
    )
    assert get_stock_status(item) == "Out of Stock"


def test_stock_status_low_stock():
    item = InventoryItem(
        item_id=1, sku="A", name="Test", category="Cat", warehouse="WH",
        quantity_on_hand=3, reorder_threshold=5, last_updated=datetime.now(),
    )
    assert get_stock_status(item) == "Low Stock"


def test_stock_status_at_threshold_is_low_stock():
    """quantity_on_hand == reorder_threshold is still Low Stock."""
    item = InventoryItem(
        item_id=1, sku="A", name="Test", category="Cat", warehouse="WH",
        quantity_on_hand=5, reorder_threshold=5, last_updated=datetime.now(),
    )
    assert get_stock_status(item) == "Low Stock"


def test_stock_status_in_stock():
    item = InventoryItem(
        item_id=1, sku="A", name="Test", category="Cat", warehouse="WH",
        quantity_on_hand=10, reorder_threshold=5, last_updated=datetime.now(),
    )
    assert get_stock_status(item) == "In Stock"


# ---------------------------------------------------------------------------
# Import validation logic
# ---------------------------------------------------------------------------

VALID_CSV = b"""sku,warehouse,transaction_type,quantity,timestamp
SKU-001,Jakarta,restock,5,2026-03-18T12:00:00
"""

INVALID_TRANSACTION_TYPE_CSV = b"""sku,warehouse,transaction_type,quantity,timestamp
SKU-001,Jakarta,dispose,10,2026-03-18T12:00:00
"""

MISSING_SKU_CSV = b"""sku,warehouse,transaction_type,quantity,timestamp
,Jakarta,restock,5,2026-03-18T12:00:00
"""

NEGATIVE_QUANTITY_CSV = b"""sku,warehouse,transaction_type,quantity,timestamp
SKU-001,Jakarta,restock,-3,2026-03-18T12:00:00
"""

NON_NUMERIC_QUANTITY_CSV = b"""sku,warehouse,transaction_type,quantity,timestamp
SKU-001,Jakarta,restock,abc,2026-03-18T12:00:00
"""

MISSING_WAREHOUSE_CSV = b"""sku,warehouse,transaction_type,quantity,timestamp
SKU-001,,restock,5,2026-03-18T12:00:00
"""

INVALID_TIMESTAMP_CSV = b"""sku,warehouse,transaction_type,quantity,timestamp
SKU-001,Jakarta,restock,5,not-a-date
"""

UNKNOWN_SKU_WAREHOUSE_CSV = b"""sku,warehouse,transaction_type,quantity,timestamp
SKU-999,Atlantis,restock,5,2026-03-18T12:00:00
"""

MIXED_CSV = b"""sku,warehouse,transaction_type,quantity,timestamp
SKU-001,Jakarta,restock,5,2026-03-18T12:00:00
SKU-001,Jakarta,dispose,5,2026-03-18T12:00:00
,Jakarta,restock,5,2026-03-18T12:00:00
SKU-001,Jakarta,sale,2,2026-03-18T12:00:00
"""


def test_import_valid_rows():
    total, accepted, rejected, errors = import_csv_rows(VALID_CSV)
    assert total == 1
    assert accepted == 1
    assert rejected == 0
    assert errors == []


def test_import_invalid_transaction_type():
    total, accepted, rejected, errors = import_csv_rows(INVALID_TRANSACTION_TYPE_CSV)
    assert total == 1
    assert rejected == 1
    assert len(errors) == 1
    assert "transaction_type" in errors[0].message.lower()


def test_import_missing_sku():
    total, accepted, rejected, errors = import_csv_rows(MISSING_SKU_CSV)
    assert total == 1
    assert rejected == 1
    assert len(errors) == 1
    assert "sku" in errors[0].message.lower()


def test_import_negative_quantity():
    total, accepted, rejected, errors = import_csv_rows(NEGATIVE_QUANTITY_CSV)
    assert total == 1
    assert rejected == 1
    assert len(errors) == 1
    assert "quantity" in errors[0].message.lower()


def test_import_non_numeric_quantity():
    total, accepted, rejected, errors = import_csv_rows(NON_NUMERIC_QUANTITY_CSV)
    assert total == 1
    assert rejected == 1
    assert len(errors) == 1


def test_import_missing_warehouse():
    total, accepted, rejected, errors = import_csv_rows(MISSING_WAREHOUSE_CSV)
    assert total == 1
    assert rejected == 1
    assert "warehouse" in errors[0].message.lower()


def test_import_invalid_timestamp():
    total, accepted, rejected, errors = import_csv_rows(INVALID_TIMESTAMP_CSV)
    assert total == 1
    assert rejected == 1


def test_import_unknown_sku_warehouse_combo():
    total, accepted, rejected, errors = import_csv_rows(UNKNOWN_SKU_WAREHOUSE_CSV)
    assert total == 1
    assert rejected == 1
    assert "not found" in errors[0].message.lower()


def test_import_mixed_rows_partial_success():
    """Valid rows should be accepted even when some rows fail."""
    total, accepted, rejected, errors = import_csv_rows(MIXED_CSV)
    assert total == 4
    assert accepted == 2
    assert rejected == 2
    assert len(errors) == 2


def test_import_error_includes_row_number():
    total, accepted, rejected, errors = import_csv_rows(INVALID_TRANSACTION_TYPE_CSV)
    assert errors[0].row_number == 2  # header is row 1, first data row is row 2
