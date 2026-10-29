
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ApplicationForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    studentName: "",
    email: "",
    rollNumber: "",
    internship: location.state?.internship || ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (
      !form.studentName.trim() ||
      !form.email.trim() ||
      !form.rollNumber.trim() ||
      !form.internship
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentName: form.studentName.trim(),
          email: form.email.trim(),
          rollNumber: form.rollNumber.trim(),
          internship: form.internship
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Application submission failed");
      }

      setMessage(data.message || "Application submitted successfully!");

      setForm({
        studentName: "",
        email: "",
        rollNumber: "",
        internship: ""
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to submit the application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-card">
      <Link className="back-link" to="/">
        ← Back to Internships
      </Link>

      <h1>Student Internship Application</h1>
      <p>Fill in your details to apply for an internship.</p>

      {message && (
        <div className="success" role="status">
          {message}
        </div>
      )}

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="studentName">Student Name</label>
        <input
          id="studentName"
          name="studentName"
          value={form.studentName}
          onChange={handleChange}
          placeholder="Enter your full name"
          autoComplete="name"
          required
        />

        <label htmlFor="email">Email ID</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="student@example.com"
          autoComplete="email"
          required
        />

        <label htmlFor="rollNumber">Roll Number</label>
        <input
          id="rollNumber"
          name="rollNumber"
          value={form.rollNumber}
          onChange={handleChange}
          placeholder="Enter your roll number"
          required
        />

        <label htmlFor="internship">Selected Internship</label>
        <select
          id="internship"
          name="internship"
          value={form.internship}
          onChange={handleChange}
          required
        >
          <option value="">Select an internship</option>
          <option value="Web Development">Web Development</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="Data Analytics">Data Analytics</option>
          <option value="Full Stack Development">
            Full Stack Development
          </option>
        </select>

        <button className="primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      {message && (
        <button
          className="secondary"
          type="button"
          onClick={() => navigate("/")}
        >
          Browse More Internships
        </button>
      )}
    </section>
  );
}
