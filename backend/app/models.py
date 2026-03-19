from pydantic import BaseModel
from datetime import datetime


class InventoryItem(BaseModel):
    item_id: int
    sku: str
    name: str
    category: str
    warehouse: str
    quantity_on_hand: int
    reorder_threshold: int
    last_updated: datetime