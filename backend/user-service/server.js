import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import auth from "./routes/auth.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentResumeRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import tutorRoutes from "./routes/tutorResumeRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());
app.use("/auth", auth);
app.use("/api/auth", authRoutes);
app.use("/api/tutor-resumes", tutorRoutes);
app.use("/api/student-resumes", studentRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("User Service is running...");
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
