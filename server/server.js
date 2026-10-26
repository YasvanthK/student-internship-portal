require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const internships = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "TechNova",
    location: "Remote",
    duration: "3 Months",
    stipend: "₹10,000/month",
    description: "Develop responsive websites using React, HTML, CSS and JavaScript.",
    skills: ["HTML", "CSS", "JavaScript", "React"]
  },
  {
    id: "2",
    title: "Backend Developer Intern",
    company: "CodeSphere",
    location: "Chennai",
    duration: "6 Months",
    stipend: "₹15,000/month",
    description: "Develop REST APIs using Node.js, Express and MongoDB.",
    skills: ["Node.js", "Express", "MongoDB"]
  },
  {
    id: "3",
    title: "Machine Learning Intern",
    company: "DataWorks",
    location: "Hybrid",
    duration: "4 Months",
    stipend: "₹12,000/month",
    description: "Build machine learning models and analyze datasets.",
    skills: ["Python", "Pandas", "Machine Learning"]
  },
  {
    id: "4",
    title: "Full Stack Developer Intern",
    company: "WebCraft",
    location: "Remote",
    duration: "3 Months",
    stipend: "₹12,000/month",
    description: "Develop full-stack applications using React and Node.js.",
    skills: ["React", "Node.js", "Express", "MongoDB"]
  }
];

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, trim: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  rollNumber: { type: String, required: true, trim: true },
  internship: { type: String, required: true, trim: true }
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);

app.get("/", (req, res) => {
  res.json({ message: "Student Internship Portal backend is running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    server: "running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.get("/api/internships", (req, res) => {
  res.json(internships);
});

app.get("/api/internships/:id", (req, res) => {
  const internship = internships.find(item => item.id === req.params.id);

  if (!internship) {
    return res.status(404).json({ message: "Internship not found" });
  }

  res.json(internship);
});

app.post("/api/applications", async (req, res) => {
  try {
    const { name, email, rollNumber, internship } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof rollNumber !== "string" ||
      typeof internship !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !rollNumber.trim() ||
      !internship.trim()
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (name.trim().length < 3) {
      return res.status(400).json({ message: "Name must contain at least 3 characters" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    if (!/^[a-zA-Z0-9/-]{3,30}$/.test(rollNumber.trim())) {
      return res.status(400).json({ message: "Enter a valid roll number" });
    }

    const selected = internships.find(item => item.title === internship);

    if (!selected) {
      return res.status(400).json({ message: "Select a valid internship" });
    }

    const application = await Application.create({
      name: name.trim(),
      email: email.trim(),
      rollNumber: rollNumber.trim(),
      internship: selected.title
    });

    res.status(201).json({
      message: "Application submitted successfully!",
      application
    });
  } catch (error) {
    console.error("Application error:", error.message);
    res.status(500).json({ message: "Failed to save application" });
  }
});

app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error("Retrieval error:", error.message);
    res.status(500).json({ message: "Failed to retrieve applications" });
  }
});

async function start() {
  const port = process.env.PORT || 5000;

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing. Configure server/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    app.listen(port, "0.0.0.0", () => {
      console.log(`Backend running on port ${port}`);
    });
  } catch (error) {
    console.error("Backend startup error:", error.message);
    process.exitCode = 1;
  }
}

start();
