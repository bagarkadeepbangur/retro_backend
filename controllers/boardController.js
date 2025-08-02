const Board = require("../models/board");
const OpenAI = require('openai');
require('dotenv').config();
const axios = require('axios');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
// @desc    Create new board
// @route   POST /api/boards
const createBoard = async (req, res) => {
  try {
    console.log("Create board called",req.body)
    const { title, columns,user } = req.body;
    // console.log(user._id)
    const board = new Board({
      title,
      columns,
      userName:user.name,
      email:user.email,
      userId:user._id,
      organization:user.organization
    });
    // console.log("Board-->",board)
    const createdBoard = await board.save();
    console.log(createBoard)
    res.status(201).json(createdBoard);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all boards
// @route   GET /api/boards
const getBoards = async (req, res) => {
  try {
    // const user = req.params;
    const user = Object.assign({}, req.query);
    // console.log("User-->",cleanQuery)
    const boards = await Board.find({organization:user.organization});
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a board by ID
// @route   GET /api/boards/:id
const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a board
// @route   DELETE /api/boards/:id
const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    await board.remove();
    res.json({ message: "Board removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add card to a column
const addCardToColumn = async (req, res) => {
    const { boardId, columnName, content } = req.body;
  
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });
  
    const column = board.columns.find((col) => col.name === columnName);
    if (!column) return res.status(404).json({ message: "Column not found" });
  
    column.cards.push({ content });
    await board.save();
  
    res.status(201).json({ message: "Card added", board });
  };
  
  // Edit card content
  const updateCardContent = async (req, res) => {
    const { boardId, columnName, cardIndex, newContent } = req.body;
  
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });
  
    const column = board.columns.find((col) => col.name === columnName);
    if (!column) return res.status(404).json({ message: "Column not found" });
  
    if (column.cards[cardIndex]) {
      column.cards[cardIndex].content = newContent;
      await board.save();
      return res.status(200).json({ message: "Card updated", board });
    }
  
    res.status(404).json({ message: "Card not found" });
  };
  
  // Delete card
  const deleteCardFromColumn = async (req, res) => {
    try {
        console.log("Delete triggered")
        const { boardId, columnName, cardIndex } = req.body;
  
        const board = await Board.findById(boardId);
        if (!board) return res.status(404).json({ message: "Board not found" });
      
        const column = board.columns.find((col) => col.name === columnName);
        if (!column) return res.status(404).json({ message: "Column not found" });
      
        column.cards.splice(cardIndex, 1);
        await board.save();
      
        res.status(200).json({ message: "Card deleted", board });
    } catch (error) {
        console.log(error)
    }

  };

  const reorderBoardCards = async (req, res) => {
    try {
      const { id } = req.params;
      const { columns } = req.body;
  
      const board = await Board.findById(id);
      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }
  
      board.columns = columns;
      await board.save();
  
      res.status(200).json({ message: "Board updated with reordered cards", board });
    } catch (error) {
      console.error("Error reordering cards:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  // Add a column
const addColumn = async (req, res) => {
    console.log("Req.body-->",req.body)
    const { boardId, name,color } = req.body;
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });
  
    board.columns.push({ name, cards: [],color });
    await board.save();
    res.status(200).json(board);
  };
  
  // Update column name
  const updateColumn = async (req, res) => {
    console.log(req.body)
    const { boardId, columnIndex, newName } = req.body;
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });
    // console.log("---->",board.columns)
    const col = board.columns.find(col => col._id.toString() === columnIndex);
    if (!col) return res.status(400).json({ message: "Column not found" });
    console.log(col._id)
    // board.columns[col._id].name = newName;
    col.name = newName;
    await board.save();
    res.status(200).json(board);
  };
  
  // Delete column
  const deleteColumn = async (req, res) => {
    // console.log("req body in delete",req.body)
    const { boardId, columnIndex } = req.body;
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });
    // console.log("--->",board,columnIndex)
    board.columns = board.columns.filter(
        (col) => col._id.toString() !== columnIndex
    );
    await board.save();
    res.status(200).json(board);
  };
  const aiInsights = async (req, res) => {
    // console.log("Req.body-->",req.body)
    try {
        const { boardId } = req.body;

        // Fetch all cards for the given board
        const cards = await Board.find({ boardId });
    
        const allText = cards.map(card => `- ${card.text}`).join('\n');
        const prompt = `
        You are a smart agile coach. Here's feedback collected during a sprint retrospective:
        
        ${allText}
        
        1. Summarize the main themes discussed.
        2. Suggest 3 concrete action items based on the feedback.
        3. Highlight any emotional tone or concerns you detect.
        `;
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
          });
      
          const aiResponse = chatCompletion.choices[0].message.content;
          res.status(200).json({ insights: aiResponse });
    } catch (error) {
        console.error('AI Error:', error.message);
        res.status(500).json({ error: 'Failed to generate insights' });
    }
    
  };

  const addCardToTask = async (req, res) => {
    // console.log("req body in add to task",req.body)
    const { boardId, columnIndex,cardIndex,user } = req.body.data;
    console.log(boardId)
    const board = await Board.findById(boardId);
    // console.log("Board here--->",board,columnIndex)
    let columnsData = board.columns.filter(
      (col) => col._id.toString() === columnIndex
    );
    console.log("Column Data--->",columnsData)
    if (!board) return res.status(404).json({ message: "Board not found" });
    try {
      const dataToSend = {
        userId:JSON.parse(user)._id,
        title:columnsData[0].cards[cardIndex].content,
        date:Date.now(),
        priority:"high",
        stage:"todo",
        assets:[],
        links:"",
        description:columnsData[cardIndex].content,
        team:JSON.parse(user)._id
      }
      const response = await axios.post(process.env.TASKMANAGEMENT_API+"/createByRetro", dataToSend);
  
      // Send success response
      res.status(200).json({
        success: true,
        message: "Sucess",
      });
    } catch (error) {
      // Handle Axios error
      console.log(error)
      const status = error.response?.status || 500;
      const message = error.response?.data || error.message;
  
      res.status(status).json({
        success: false,
        message: message,
      });
    }
    // await board.save();
    // res.status(200).json(board);
  };

module.exports = {
  createBoard,
  getBoards,
  getBoardById,
  deleteBoard,
  addCardToColumn,
  updateCardContent,
  deleteCardFromColumn,
  reorderBoardCards,
  addColumn,
  updateColumn,
  deleteColumn,
  aiInsights,
  addCardToTask
};
