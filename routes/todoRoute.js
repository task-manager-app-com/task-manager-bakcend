const express = require("express");
const router = express.Router();
const {
  addTask,
  getAllTasks,
  completingTask,
  getAllCompletedTasks,
} = require("../controllers/todoController");

router.post("/addTask", addTask);
router.get("/getTasks", getAllTasks);
router.patch("/completeTask/:id/complete", completingTask);
router.get("/completedTasks", getAllCompletedTasks);

module.exports = router;