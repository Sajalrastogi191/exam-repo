const express = require("express")
const router = express.Router()
const paperController = require("../controllers/paperController")
const { protect } = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware")

// Public routes
router.get("/", paperController.getPapers)
router.get("/filter-options", paperController.getFilterOptions)
router.get("/:id", paperController.getPaperById)
router.get("/:id/download", paperController.downloadPaper)

// Protected routes
router.post("/", protect, upload.single("file"), paperController.uploadPaper)
router.get("/user/papers", protect, paperController.getUserPapers)
router.delete("/:id", protect, paperController.deletePaper)

module.exports = router
