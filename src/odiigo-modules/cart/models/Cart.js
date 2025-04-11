
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },
    services: [
      {
        service_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        service_price_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ServicePricing",
        },
        price: { type: Number, required: true },
      },
    ],
    total_price: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
