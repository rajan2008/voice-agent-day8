# Order Management - ACP-inspired structure
import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Dict

# Orders file path
ORDERS_FILE = Path(__file__).parent / "orders.json"

# In-memory orders (also persisted to file)
ORDERS = []


def load_orders():
    """Load orders from JSON file"""
    global ORDERS
    if ORDERS_FILE.exists():
        try:
            with open(ORDERS_FILE, 'r') as f:
                ORDERS = json.load(f)
        except Exception as e:
            print(f"Error loading orders: {e}")
            ORDERS = []
    else:
        ORDERS = []


def save_orders():
    """Save orders to JSON file"""
    try:
        with open(ORDERS_FILE, 'w') as f:
            json.dump(ORDERS, f, indent=2)
    except Exception as e:
        print(f"Error saving orders: {e}")


def create_order(line_items: List[Dict], buyer_info: Dict | None = None) -> Dict:
    """
    Create a new order (ACP-inspired structure)
    
    line_items: [
        {
            "product_id": "mug-001",
            "quantity": 2,
            "size": "M" (optional)
        }
    ]
    
    buyer_info: {
        "name": "John Doe",
        "email": "john@example.com" (optional)
    }
    """
    from catalog import get_product_by_id
    
    # Generate order ID
    order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"
    
    # Calculate line items with prices
    processed_items = []
    total_amount = 0
    
    for item in line_items:
        product = get_product_by_id(item["product_id"])
        if not product:
            continue
        
        quantity = item.get("quantity", 1)
        unit_amount = product["price"]
        line_total = unit_amount * quantity
        
        processed_item = {
            "product_id": product["id"],
            "product_name": product["name"],
            "quantity": quantity,
            "unit_amount": unit_amount,
            "currency": product["currency"],
            "line_total": line_total
        }
        
        # Add size if specified
        if "size" in item:
            processed_item["size"] = item["size"]
        
        processed_items.append(processed_item)
        total_amount += line_total
    
    # Create order object (ACP-inspired)
    order = {
        "id": order_id,
        "status": "CONFIRMED",
        "line_items": processed_items,
        "total_amount": total_amount,
        "currency": "INR",
        "created_at": datetime.utcnow().isoformat() + "Z",
        "buyer": buyer_info or {"name": "Guest"}
    }
    
    # Add to orders list
    ORDERS.append(order)
    
    # Save to file
    save_orders()
    
    return order


def get_last_order() -> Dict | None:
    """Get the most recent order"""
    if not ORDERS:
        return None
    return ORDERS[-1]


def get_all_orders() -> List[Dict]:
    """Get all orders"""
    return ORDERS


def get_order_by_id(order_id: str) -> Dict | None:
    """Get a specific order by ID"""
    for order in ORDERS:
        if order["id"] == order_id:
            return order
    return None


# Load orders on module import
load_orders()
