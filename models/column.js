const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    cards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
      },
    ],
    color:{
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Column = mongoose.model("Column", columnSchema);
module.exports = Column;
