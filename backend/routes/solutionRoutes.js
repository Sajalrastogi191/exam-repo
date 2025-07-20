const express = require("express")
const router = express.Router()
const solutionController = require("../controllers/solutionController")
const { protect } = require("../middleware/authMiddleware")

// Public routes
router.get("/paper/:paperId", solutionController.getSolutions)

// Protected routes
router.post("/paper/:paperId", protect, solutionController.addSolution)
router.put("/:id/upvote", protect, solutionController.upvoteSolution)
router.put("/:id/downvote", protect, solutionController.downvoteSolution)
router.get("/user/solutions", protect, solutionController.getUserSolutions)

module.exports = router
