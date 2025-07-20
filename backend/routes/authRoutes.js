const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const { protect } = require("../middleware/authMiddleware")

// Public routes
router.post("/register", authController.register)
router.post("/login", authController.login)

// Protected routes
router.get("/me", protect, authController.getCurrentUser)
router.put("/profile", protect, authController.updateProfile)
router.put("/password", protect, authController.updatePassword)

module.exports = router
