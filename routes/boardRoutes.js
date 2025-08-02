const express = require("express");
const {
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
  } = require("../controllers/boardController");

const router = express.Router();
router.route("/").post(createBoard).get(getBoards);
router.post("/card", addCardToColumn);
router.put("/card", updateCardContent);
router.delete("/card", deleteCardFromColumn);
router.route("/board/:id").get(getBoardById).delete(deleteBoard);
router.put("/:id/reorder", reorderBoardCards);
router.put("/column", updateColumn);
router.post("/column", addColumn);
router.delete("/column", deleteColumn);
router.post("/ai/insights", aiInsights);
router.post("/addCardToTask", addCardToTask);


module.exports = router;
