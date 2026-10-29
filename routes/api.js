
const express = require("express");
const router = express.Router();
const Application = require("../models/todo");

const internships = [
  {
    id: "web-development",
    title: "Web Development",
    description: "Learn to build responsive websites using HTML, CSS, JavaScript and React.",
    duration: "8 weeks",
    skills: ["HTML", "CSS", "JavaScript", "React"]
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Explore data preparation, model training and machine learning fundamentals.",
    duration: "10 weeks",
    skills: ["Python", "Data Analysis", "Machine Learning"]
  },
  {
    id: "data-analytics",
    title: "Data Analytics",
    description: "Analyze datasets and communicate insights through reports and visualizations.",
    duration: "6 weeks",
    skills: ["Excel", "SQL", "Python", "Data Visualization"]
  },
  {
    id: "full-stack-development",
    title: "Full Stack Development",
    description: "Build complete web applications with React, Express, Node.js and MongoDB.",
    duration: "12 weeks",
    skills: ["React", "Node.js", "Express", "MongoDB"]
  }
];

router.get("/internships", (req, res) => {
  res.json(internships);
});

router.get("/internships/:id", (req, res) => {
  const internship = internships.find((item) => item.id === req.params.id);

  if (!internship) {
    return res.status(404).json({ message: "Internship not found" });
  }

  res.json(internship);
});

router.post("/applications", async (req, res) => {
  try {
    const { studentName, email, rollNumber, internship } = req.body;

    if (
      typeof studentName !== "string" ||
      typeof email !== "string" ||
      typeof rollNumber !== "string" ||
      typeof internship !== "string" ||
      !studentName.trim() ||
      !email.trim() ||
      !rollNumber.trim() ||
      !internship.trim()
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validInternship = internships.some(
      (item) => item.title === internship.trim()
    );

    if (!validInternship) {
      return res.status(400).json({ message: "Select a valid internship" });
    }

    const application = await Application.create({
      studentName: studentName.trim(),
      email: email.trim(),
      rollNumber: rollNumber.trim(),
      internship: internship.trim()
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    console.error("Application submission error:", error.message);
    res.status(500).json({ message: "Failed to submit application" });
  }
});

router.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error("Application retrieval error:", error.message);
    res.status(500).json({ message: "Failed to retrieve applications" });
  }
});

module.exports = router;
