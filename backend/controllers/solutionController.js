const Solution = require("../models/Solution")
const Paper = require("../models/Paper")

// Get solutions for a paper
exports.getSolutions = async (req, res) => {
  try {
    const paperId = req.params.paperId

    // Check if paper exists
    const paper = await Paper.findById(paperId)
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" })
    }

    // Get solutions
    const solutions = await Solution.find({ paper: paperId })
      .populate("author", "name email avatar")
      .sort({ createdAt: -1 })

    res.json(solutions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Add a solution
exports.addSolution = async (req, res) => {
  try {
    const { content } = req.body
    const paperId = req.params.paperId

    // Check if paper exists
    const paper = await Paper.findById(paperId)
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" })
    }

    // Create solution
    const solution = new Solution({
      paper: paperId,
      content,
      author: req.user.id,
      upvotes: [],
      downvotes: [],
    })

    await solution.save()

    // Populate author information
    await solution.populate("author", "name email avatar")

    res.status(201).json(solution)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Upvote a solution
exports.upvoteSolution = async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id)

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" })
    }

    // Check if user already upvoted
    if (solution.upvotes.includes(req.user.id)) {
      // Remove upvote (toggle)
      solution.upvotes = solution.upvotes.filter((userId) => userId.toString() !== req.user.id.toString())
    } else {
      // Add upvote and remove from downvotes if exists
      solution.upvotes.push(req.user.id)
      solution.downvotes = solution.downvotes.filter((userId) => userId.toString() !== req.user.id.toString())
    }

    await solution.save()

    res.json({
      upvotes: solution.upvotes,
      downvotes: solution.downvotes,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Downvote a solution
exports.downvoteSolution = async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id)

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" })
    }

    // Check if user already downvoted
    if (solution.downvotes.includes(req.user.id)) {
      // Remove downvote (toggle)
      solution.downvotes = solution.downvotes.filter((userId) => userId.toString() !== req.user.id.toString())
    } else {
      // Add downvote and remove from upvotes if exists
      solution.downvotes.push(req.user.id)
      solution.upvotes = solution.upvotes.filter((userId) => userId.toString() !== req.user.id.toString())
    }

    await solution.save()

    res.json({
      upvotes: solution.upvotes,
      downvotes: solution.downvotes,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get solutions by current user
exports.getUserSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find({ author: req.user.id })
      .populate("paper", "title subject semester year")
      .sort({ createdAt: -1 })

    res.json(solutions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}
