
const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email"]
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      trim: true
    },
    internship: {
      type: String,
      required: [true, "Selected internship is required"],
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
