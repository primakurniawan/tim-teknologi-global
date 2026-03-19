from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_inventory():
    response = client.get("/inventory")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data


def test_import_csv():
    csv_content = """sku,warehouse,transaction_type,quantity,timestamp
SKU-001,Jakarta,restock,5,2026-03-18T12:00:00
SKU-002,Jakarta,sale,2,2026-03-18T12:00:00
"""
    response = client.post(
        "/inventory/import",
        files={"file": ("test.csv", csv_content, "text/csv")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_rows"] == 2