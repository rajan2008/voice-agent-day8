# Product Catalog - ACP-inspired structure
# You can modify prices, add more products here

PRODUCTS = [
    {
        "id": "mug-001",
        "name": "Ceramic Coffee Mug - White",
        "description": "Classic white ceramic mug, 350ml capacity",
        "price": 299,
        "currency": "INR",
        "category": "mug",
        "attributes": {
            "color": "white",
            "material": "ceramic",
            "capacity": "350ml"
        },
        "in_stock": True
    },
    {
        "id": "mug-002",
        "name": "Ceramic Coffee Mug - Black",
        "description": "Elegant black ceramic mug, 350ml capacity",
        "price": 299,
        "currency": "INR",
        "category": "mug",
        "attributes": {
            "color": "black",
            "material": "ceramic",
            "capacity": "350ml"
        },
        "in_stock": True
    },
    {
        "id": "mug-003",
        "name": "Travel Mug - Stainless Steel",
        "description": "Insulated travel mug, keeps drinks hot for 6 hours",
        "price": 599,
        "currency": "INR",
        "category": "mug",
        "attributes": {
            "color": "silver",
            "material": "stainless steel",
            "capacity": "500ml",
            "insulated": True
        },
        "in_stock": True
    },
    {
        "id": "hoodie-001",
        "name": "Cotton Hoodie - Black",
        "description": "Comfortable cotton hoodie with front pocket",
        "price": 1299,
        "currency": "INR",
        "category": "hoodie",
        "attributes": {
            "color": "black",
            "material": "cotton",
            "sizes": ["S", "M", "L", "XL"]
        },
        "in_stock": True
    },
    {
        "id": "hoodie-002",
        "name": "Cotton Hoodie - Navy Blue",
        "description": "Premium navy blue hoodie with zipper",
        "price": 1499,
        "currency": "INR",
        "category": "hoodie",
        "attributes": {
            "color": "navy blue",
            "material": "cotton",
            "sizes": ["S", "M", "L", "XL"],
            "zipper": True
        },
        "in_stock": True
    },
    {
        "id": "hoodie-003",
        "name": "Fleece Hoodie - Grey",
        "description": "Warm fleece hoodie perfect for winter",
        "price": 1799,
        "currency": "INR",
        "category": "hoodie",
        "attributes": {
            "color": "grey",
            "material": "fleece",
            "sizes": ["M", "L", "XL", "XXL"]
        },
        "in_stock": True
    },
    {
        "id": "tshirt-001",
        "name": "Cotton T-Shirt - White",
        "description": "Basic white cotton t-shirt",
        "price": 399,
        "currency": "INR",
        "category": "tshirt",
        "attributes": {
            "color": "white",
            "material": "cotton",
            "sizes": ["S", "M", "L", "XL"]
        },
        "in_stock": True
    },
    {
        "id": "tshirt-002",
        "name": "Cotton T-Shirt - Black",
        "description": "Classic black cotton t-shirt",
        "price": 399,
        "currency": "INR",
        "category": "tshirt",
        "attributes": {
            "color": "black",
            "material": "cotton",
            "sizes": ["S", "M", "L", "XL"]
        },
        "in_stock": True
    },
    {
        "id": "tshirt-003",
        "name": "Graphic T-Shirt - Blue",
        "description": "Cool graphic print t-shirt",
        "price": 599,
        "currency": "INR",
        "category": "tshirt",
        "attributes": {
            "color": "blue",
            "material": "cotton blend",
            "sizes": ["M", "L", "XL"],
            "graphic": True
        },
        "in_stock": True
    },
    {
        "id": "cap-001",
        "name": "Baseball Cap - Black",
        "description": "Adjustable baseball cap",
        "price": 349,
        "currency": "INR",
        "category": "cap",
        "attributes": {
            "color": "black",
            "material": "cotton",
            "adjustable": True
        },
        "in_stock": True
    }
]


def list_products(filters: dict | None = None) -> list[dict]:
    """
    List products with optional filtering
    
    Filters can include:
    - category: str (e.g., "mug", "hoodie", "tshirt")
    - max_price: int (maximum price in INR)
    - color: str (e.g., "black", "white")
    - min_price: int (minimum price in INR)
    """
    if not filters:
        return PRODUCTS
    
    filtered = PRODUCTS.copy()
    
    if "category" in filters:
        filtered = [p for p in filtered if p["category"].lower() == filters["category"].lower()]
    
    if "max_price" in filters:
        filtered = [p for p in filtered if p["price"] <= filters["max_price"]]
    
    if "min_price" in filters:
        filtered = [p for p in filtered if p["price"] >= filters["min_price"]]
    
    if "color" in filters:
        filtered = [
            p for p in filtered 
            if "color" in p["attributes"] and 
            filters["color"].lower() in p["attributes"]["color"].lower()
        ]
    
    return filtered


def get_product_by_id(product_id: str) -> dict | None:
    """Get a single product by ID"""
    for product in PRODUCTS:
        if product["id"] == product_id:
            return product
    return None


def get_product_by_name(name: str) -> dict | None:
    """Find product by partial name match"""
    name_lower = name.lower()
    for product in PRODUCTS:
        if name_lower in product["name"].lower():
            return product
    return None
