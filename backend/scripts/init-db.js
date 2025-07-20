const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const User = require("../models/User")
const Paper = require("../models/Paper")
const Solution = require("../models/Solution")

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected")

    try {
      // Create admin user
      const adminExists = await User.findOne({ email: "admin@example.com" })

      if (!adminExists) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash("admin123", salt)

        const admin = new User({
          name: "Admin User",
          email: "admin@example.com",
          password: hashedPassword,
          role: "admin",
          bio: "System administrator",
        })

        await admin.save()
        console.log("Admin user created")
      }

      // Create test user
      const testUserExists = await User.findOne({ email: "user@example.com" })

      if (!testUserExists) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash("user123", salt)

        const testUser = new User({
          name: "Test User",
          email: "user@example.com",
          password: hashedPassword,
          role: "user",
          bio: "Regular user for testing",
        })

        await testUser.save()
        console.log("Test user created")
      }

      // Create sample subjects
      const subjects = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology"]
      const semesters = ["Spring", "Summer", "Fall", "Winter"]
      const years = ["2021", "2022", "2023"]

      console.log("Database initialized successfully")
      process.exit(0)
    } catch (error) {
      console.error("Error initializing database:", error)
      process.exit(1)
    }
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err)
    process.exit(1)
  })
