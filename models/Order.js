// models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    // 🔓 OPTIONAL to allow custom bouquet items
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    name: String,
    price: Number,
    qty: { type: Number, min: 1, default: 1 },
    size: String,
    color: String,
    imageUrl: String,

    // 🌸 Custom Bouquet Payload (NON-BREAKING)
    customBouquet: {
      snapshotUrl: String,
      templateId: mongoose.Schema.Types.ObjectId,

      // slotIndex -> flowerId
      slotFlowerIds: {
        type: Map,
        of: String,
        default: undefined,
      },

      // flowerId -> count
      flowerCounts: {
        type: Map,
        of: Number,
        default: undefined,
      },

      wrapId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },

      ribbonId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },

    items: {
      type: [orderItemSchema],
      default: [],
    },

    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

    // 🏠 Address
    address: { type: String, default: "" },
    fullAddress: { type: mongoose.Schema.Types.Mixed, default: null },

    phone: { type: String, default: "" },
    paymentMethod: { type: String, default: "COD" },

    status: { type: String, default: "pending", index: true },

    // 🧩 Audit Trail (SAFE)
    statusChangedBy: { type: String, default: "System" },
    statusHistory: {
      type: [
        {
          status: String,
          changedBy: String,
          changedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
