const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "Anonymous",
    },
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
