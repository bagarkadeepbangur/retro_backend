const mongoose = require("mongoose");


const cardSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});

const columnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cards: [cardSchema],
  color:{
    type: String
  }
});

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    columns: [columnSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // optional if login is added later
    },
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);
module.exports = Board;
