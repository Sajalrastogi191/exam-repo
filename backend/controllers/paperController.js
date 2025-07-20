const Paper = require("../models/Paper")
const Solution = require("../models/Solution")
const fs = require("fs")
const path = require("path")


// Get all papers with filtering
exports.getPapers = async (req, res) => {
  try {
    const { subject, semester, year, search, subjectCode, collegeName} = req.query

    // Build filter object
    const filter = {}
    if (subject) filter.subject = subject
    if (semester) filter.semester = semester
    if (year) filter.year = year
    if (subjectCode) filter.subjectCode = subjectCode
    if (collegeName) filter.collegeName = collegeName


    // Add text search if provided
    if (search) {
      filter.$text = { $search: search }
    }

    const papers = await Paper.find(filter).populate("author", "name email").sort({ createdAt: -1 })

    // Count solutions for each paper
    const papersWithCounts = await Promise.all(
      papers.map(async (paper) => {
        const solutionCount = await Solution.countDocuments({ paper: paper._id })
        return {
          ...paper.toObject(),
          solutionCount,
        }
      }),
    )

    res.json(papersWithCounts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get paper by ID
exports.getPaperById = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id).populate("author", "name email")

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" })
    }

    // Get solution count
    const solutionCount = await Solution.countDocuments({ paper: paper._id })

    // Get related papers (same subject)
    const relatedPapers = await Paper.find({
      subject: paper.subject,
      _id: { $ne: paper._id },
    })
      .select("title subject semester year collegeName")
      .limit(3)

    res.json({
      paper,
      solutionCount,
      relatedPapers,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Upload a new paper
exports.uploadPaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" })
    }

    const { title, subject, semester, year, description, subjectCode, collegeName } = req.body

    // Create new paper
    const paper = new Paper({
      title,
      subject,
      semester,
      year,
      description,
      subjectCode,
      collegeName,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      author: req.user.id,
    })

    await paper.save()

    res.status(201).json(paper)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Download paper
exports.downloadPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id)

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" })
    }

    const filePath = path.join(__dirname, "..", paper.fileUrl)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" })
    }
    res.download(filePath, paper.fileName)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get papers by current user
exports.getUserPapers = async (req, res) => {
  try {
    const papers = await Paper.find({ author: req.user.id }).sort({ createdAt: -1 })
    res.json(papers)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get unique subjects, semesters, and years for filters
exports.getFilterOptions = async (req, res) => {
  try {
    const subjects = await Paper.distinct("subject")
    const semesters = await Paper.distinct("semester")
    const years = await Paper.distinct("year")
    const subjectCodes = await Paper.distinct("subjectCode")
    const collegeNames = await Paper.distinct("collegeName")
    res.json({
      subjects,
      semesters,
      years,
      subjectCodes,
      collegeNames,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Delete a paper
exports.deletePaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id)

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" })
    }

    // Check if user is author
    if (paper.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this paper" })
    }

    
    // Delete paper from MongoDB
    await Paper.findByIdAndDelete(req.params.id)
    
    // Delete file from server
    const filePath = path.join(__dirname, "..", paper.fileUrl.replace(/^\/+/, ""))
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    
    res.json({ message: "Paper deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to delete paper" })
  }
}
