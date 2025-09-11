import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true }, // must match budget category
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
