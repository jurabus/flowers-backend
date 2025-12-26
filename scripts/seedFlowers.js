import mongoose from "mongoose";
import Flower from "../models/Flower.js";

await Flower.deleteMany();

await Flower.insertMany([
  {
    name: "Red Rose",
    description: "Classic premium red rose",
    price: 20,
    imageUrl: "https://cdn.yourdomain.com/flowers/red_rose.png"
  },
  {
    name: "White Lily",
    description: "Elegant white lily",
    price: 18,
    imageUrl: "https://cdn.yourdomain.com/flowers/white_lily.png"
  },
  {
    name: "Yellow Tulip",
    description: "Bright yellow tulip",
    price: 15,
    imageUrl: "https://cdn.yourdomain.com/flowers/yellow_tulip.png"
  }
]);

console.log("Flowers seeded");
process.exit();
