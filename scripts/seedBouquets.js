import mongoose from "mongoose";
import BouquetTemplate from "../models/BouquetTemplate.js";

await BouquetTemplate.deleteMany();

await BouquetTemplate.insertMany([
  {
    name: "Square Medium",
    shape: "square",
    size: "medium",
    slotCount: 16,
    slots: Array.from({ length: 16 }).map((_, i) => ({
      index: i,
      x: (i % 4) / 3,
      y: Math.floor(i / 4) / 3
    }))
  },
  {
    name: "Circle Medium",
    shape: "circle",
    size: "medium",
    slotCount: 19,
    slots: Array.from({ length: 19 }).map((_, i) => ({
      index: i,
      x: Math.cos((i / 19) * 2 * Math.PI) * 0.35 + 0.5,
      y: Math.sin((i / 19) * 2 * Math.PI) * 0.35 + 0.5
    }))
  },
  {
    name: "Heart Large",
    shape: "heart",
    size: "large",
    slotCount: 21,
    slots: Array.from({ length: 21 }).map((_, i) => ({
      index: i,
      x: 0.5 + Math.sin(i) * 0.3,
      y: 0.4 + Math.cos(i) * 0.3
    }))
  }
]);

console.log("Bouquet templates seeded");
process.exit();
