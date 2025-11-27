const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const memoryService = require("../services/memoryService");

// -------- PRODUCT SEARCH --------
exports.handle = async (message, userId) => {
  let q = message.toLowerCase().trim();

// extract keyword from long sentences
const words = q.split(" ");
const possibleKeys = ["hoodie", "tshirt", "t-shirt", "shirt"];
const match = words.find(w => possibleKeys.includes(w.replace(/s$/, "")));

if (match) {
  q = match.replace(/s$/, "");  // hoodies → hoodie, tshirts → tshirt
} else {
  // fallback: normalize plural
  if (q.endsWith("s")) q = q.slice(0, -1);
}
  
  // search products
  const products = await Product.find({
    $or: [
      { title: new RegExp(q, "i") },
      { tags: new RegExp(q, "i") }
    ]
  }).limit(5);

  if (!products || products.length === 0) {
    return { text: "I couldn't find any products matching that. Try 'hoodie' or 't-shirt'." };
  }

  const p = products[0];

  // record memory
  await memoryService.recordUserMessage(userId, message, "product_search", { last_sku: p.sku });
  await memoryService.setState(userId, "awaiting_size", { field: "size", sku: p.sku });

  return {
    text: `Found: ${p.title} — ₹${p.price}. Available sizes: ${p.sizes.join(", ")}. Which size do you want?`
  };
};

// -------- SIZE SELECTION --------
exports.handleSizeSelection = async (sizeText, userId) => {
  const size = sizeText.trim().toUpperCase();
  const VALID_SIZES = ["S", "M", "L", "XL"];

  // ❗ If user message is NOT a size → treat as new product search
  if (!VALID_SIZES.includes(size)) {
    return exports.handle(sizeText, userId);
  }

  const mem = await memoryService.getMemory(userId);
  const sku = mem.recent_entities?.last_sku;

  if (!sku) return { text: "I couldn't find which product you mean. Please search again." };

  // match non-size sku (HOODIE-BLK)
  const prefix = sku.split("-").slice(0, 2).join("-");
  const product = await Product.findOne({ sku: new RegExp(prefix, "i") });

  if (!product) {
    return { text: "Product not found. Please search again." };
  }

  if (!product.sizes.includes(size)) {
    return { text: `Sorry, size ${size} is not available. Available: ${product.sizes.join(", ")}` };
  }

  // add to cart
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = new Cart({ userId, items: [] });

  cart.items.push({
    sku: `${prefix}-${size}`,
    title: product.title,
    size,
    qty: 1,
    price: product.price
  });

  await cart.save();

  // update memory
  await memoryService.recordUserMessage(userId, sizeText, "size_selection", { size });
  await memoryService.setState(userId, "checkout_confirmation", { field: "confirm_checkout" });

  return { text: `Added size ${size} to cart. Proceed to checkout? (yes/no)` };
};

// -------- CHECKOUT CONFIRMATION --------
exports.handleCheckout = async (userId, answer) => {
  const ans = answer.trim().toLowerCase();

  if (ans === "no") {
    await memoryService.clearState(userId);
    return { text: "Okay — I kept the item in your cart. Anything else?" };
  }

  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) return { text: "Your cart is empty." };

  const order = new Order({
    userId,
    items: cart.items,
    status: "created",
    createdAt: new Date()
  });

  await order.save();

  // empty cart
  cart.items = [];
  await cart.save();

  // go to payment step
  await memoryService.setState(userId, "awaiting_payment", { field: "payment", orderId: order._id.toString() });

  return { text: `Order ${order._id} created. Send "pay" to simulate payment.` };
};

// -------- PAYMENT PROCESSING --------
exports.processPayment = async (userId, paymentText) => {
  const mem = await memoryService.getMemory(userId);
  const orderId = mem.awaiting?.orderId;

  if (!orderId) return { text: "No pending order found." };

  const msg = paymentText.toLowerCase();

  if (msg.includes("pay") || msg.includes("done") || msg.includes("success")) {
    const order = await Order.findById(orderId);
    if (!order) return { text: "Order not found." };

    order.status = "paid";
    await order.save();
    await memoryService.clearState(userId);

    return { text: `Payment received. Order ${order._id} is now paid. Thank you!` };
  }

  return { text: "To pay, send 'pay' or 'done'." };
};
