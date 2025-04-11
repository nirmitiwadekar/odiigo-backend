const Cart = require("../models/Cart");

exports.getCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ user_id: userId }).populate(
      "services.service_id"
    );
    res.json(cart || { services: [], total_price: 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

exports.addToCart = async (req, res) => {
  const { user_id, service_id, service_price_id, price } = req.body;

  try {
    let cart = await Cart.findOne({ user_id });

    const newItem = { service_id, service_price_id, price };

    if (!cart) {
      cart = new Cart({ user_id, services: [newItem], total_price: price });
    } else {
      cart.services.push(newItem);
      cart.total_price += price;
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

exports.removeFromCart = async (req, res) => {
  const { user_id, service_id } = req.body;

  try {
    const cart = await Cart.findOne({ user_id });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.services = cart.services.filter(
      (item) => item.service_id.toString() !== service_id
    );
    cart.total_price = cart.services.reduce((sum, item) => sum + item.price, 0);

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    await Cart.findOneAndDelete({ user_id: userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
