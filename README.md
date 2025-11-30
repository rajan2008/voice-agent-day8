# Day 9 - E-commerce Voice Shopping Assistant

A voice-driven shopping assistant built with LiveKit Agents, following ACP (Agentic Commerce Protocol) principles.

## Features

### Primary Goal ✅
✅ **Voice Shopping**: Browse and buy products using voice commands
✅ **Visual Product Grid**: See all products with emoji icons, prices, and "Buy" buttons
✅ **Product Catalog**: 10 products (mugs, hoodies, t-shirts, caps)
✅ **Smart Filtering**: Filter by category, search by name
✅ **Shopping Cart**: Add items, view cart, checkout
✅ **Order Management**: Orders saved to JSON file
✅ **ACP-Inspired**: Structured data models for products and orders
✅ **Triple Input**: Use voice OR click "Buy" buttons OR type messages

### Advanced Goals ✅
✅ **HTTP REST API**: ACP-style endpoints (GET /acp/catalog, POST /acp/orders)
✅ **Cart Management**: Remove items, clear cart, update quantities
✅ **Order History**: View all past orders with statistics
✅ **Order History UI**: Beautiful tab interface with stats dashboard
✅ **Order Queries**: "Show my last 3 orders", "How much did I spend?"
✅ **Statistics**: Total orders, revenue, average order value

## What You Need to Configure

### 1. API Keys (Required)

Edit `backend/.env.local`:

```env
# LiveKit Server
LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret

# Deepgram (Speech-to-Text)
DEEPGRAM_API_KEY=your_deepgram_key_here

# Google Gemini (LLM)
GOOGLE_API_KEY=your_google_gemini_key_here

# Murf AI (Text-to-Speech)
MURF_API_KEY=your_murf_api_key_here
```

### 2. Product Prices (Optional)

You can modify product prices in `backend/src/catalog.py`:

```python
{
    "id": "mug-001",
    "name": "Ceramic Coffee Mug - White",
    "price": 299,  # ← Change this
    "currency": "INR",
    ...
}
```

### 3. Add More Products (Optional)

Add new products to the `PRODUCTS` list in `backend/src/catalog.py`:

```python
{
    "id": "your-product-id",
    "name": "Product Name",
    "description": "Product description",
    "price": 999,
    "currency": "INR",
    "category": "category_name",
    "attributes": {
        "color": "blue",
        "sizes": ["S", "M", "L"]
    },
    "in_stock": True
}
```

## How to Run

### 1. Start LiveKit Server
```bash
cd livekit
livekit-server --dev
```

### 2. Start Backend Agent
```bash
cd backend
python src/agent.py dev
```

### 3. Start HTTP API (Optional - for Order History)
```bash
cd backend/src
python api.py
```

### 4. Start Frontend
```bash
cd frontend
npm run dev
```

### 5. Open Browser
Navigate to `http://localhost:3000`

You'll see:
- **Left side**: Tabbed interface
  - **Products Tab**: Grid with all items, filters, and "Buy" buttons
  - **Orders Tab**: Order history with statistics (requires API)
- **Right side**: Voice chat interface with Siri-style waves

## How to Shop

### Method 1: Click "Buy" Buttons
- Browse products on the left
- Filter by category (All, Mugs, Hoodies, T-Shirts, Caps)
- Search for products
- Click "Buy" button on any product
- Agent will add it to your cart automatically

### Method 2: Voice Commands

### Browse Products
- "Show me all mugs"
- "Do you have hoodies under 1500 rupees?"
- "Show me black t-shirts"
- "What caps do you have?"

### Product Details
- "Tell me about the black hoodie"
- "What sizes are available for the navy hoodie?"

### Shopping Cart
- "Add the black hoodie to my cart in size M"
- "Add 2 white mugs to cart"
- "What's in my cart?"
- "Show me my cart"

### Cart Management
- "Remove the first item from my cart"
- "Clear my cart"
- "Empty my cart"

### Checkout
- "Checkout"
- "Complete my order"
- "I want to buy these items"

### Order History
- "What did I just buy?"
- "Show my last order"
- "Show me all my orders"
- "Show my last 3 orders"
- "How much have I spent?"
- "What's my total spending?"

## ACP-Inspired Structure

### Product Model
```json
{
  "id": "product-id",
  "name": "Product Name",
  "price": 999,
  "currency": "INR",
  "category": "category",
  "attributes": {...}
}
```

### Order Model
```json
{
  "id": "ORD-12345678",
  "status": "CONFIRMED",
  "line_items": [
    {
      "product_id": "mug-001",
      "product_name": "Ceramic Mug",
      "quantity": 2,
      "unit_amount": 299,
      "line_total": 598,
      "currency": "INR"
    }
  ],
  "total_amount": 598,
  "currency": "INR",
  "buyer": {"name": "John Doe"},
  "created_at": "2024-01-01T12:00:00Z"
}
```

## Order Persistence

Orders are automatically saved to `backend/src/orders.json`

You can view this file to see all orders placed.

## Project Structure

```
voice-agent-day9/
├── backend/
│   └── src/
│       ├── agent.py          # Main agent with shopping tools
│       ├── catalog.py        # Product catalog
│       ├── orders.py         # Order management
│       └── orders.json       # Persisted orders
├── frontend/                 # React UI (from Day 8)
└── livekit/                  # LiveKit server
```

## Troubleshooting

### "No products found"
- Check that `catalog.py` has products defined
- Verify filter parameters (category, price, color)

### "Cart is empty"
- Make sure to add items before checkout
- Use `add_to_cart` function

### Orders not saving
- Check file permissions for `orders.json`
- Verify `orders.py` has write access

## Advanced Features Included

### 1. HTTP REST API ✅
- `GET /acp/catalog` - Browse products with filters
- `POST /acp/orders` - Create orders via HTTP
- `GET /acp/orders` - View all orders
- `GET /acp/orders/{id}` - Get specific order
- `GET /acp/stats` - Order statistics

See `START_API.md` for setup instructions.

### 2. Enhanced Cart Management ✅
- Add items with size selection
- Remove specific items by number
- Clear entire cart
- View cart with totals

### 3. Order History & Analytics ✅
- View all past orders
- Filter and search orders
- Calculate total spending
- Average order value
- Beautiful UI dashboard

### 4. ACP-Compliant Data Models ✅
- Structured line_items
- Buyer information
- Order status tracking
- Currency fields
- Timestamps

## Future Enhancements

1. **Payment integration** (Stripe, Razorpay)
2. **User authentication** (login/signup)
3. **Product images** (replace emojis with real images)
4. **Inventory management** (stock tracking)
5. **Order status updates** (processing, shipped, delivered)

## Recording Your Demo

1. Start the agent and connect
2. Browse products by voice
3. Add items to cart
4. Complete checkout
5. Show the `orders.json` file
6. Record and post on LinkedIn with:
   - #MurfAIVoiceAgentsChallenge
   - #10DaysofAIVoiceAgents
   - Tag @Murf AI

---

Built with ❤️ using LiveKit Agents and Murf Falcon TTS
