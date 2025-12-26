import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  slotIndex: Number,
  flowerId: String,
  flowerName: String,
  unitPrice: Number
});

const CustomBouquetSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  templateId: mongoose.Schema.Types.ObjectId,

  items: [ItemSchema],

  wrap: {
    wrapId: String,
    name: String,
    price: Number
  },

  ribbon: {
    ribbonId: String,
    name: String,
    price: Number
  },

  pricing: {
    flowersTotal: Number,
    wrapPrice: Number,
    ribbonPrice: Number,
    grandTotal: Number
  },

  snapshotUrl: String,

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("CustomBouquet", CustomBouquetSchema);
