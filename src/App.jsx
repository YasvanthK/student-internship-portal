
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useSearchParams
} from "react-router-dom";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const internships = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "TechNova",
    duration: "3 Months",
    location: "Remote",
    stipend: "₹10,000/month",
    description: "Develop responsive websites using React, HTML, CSS and JavaScript.",
    skills: ["HTML", "CSS", "JavaScript", "React"]
  },
  {
    id: "2",
    title: "Backend Developer Intern",
    company: "CodeSphere",
    duration: "6 Months",
    location: "Chennai",
    stipend: "₹15,000/month",
    description: "Develop REST APIs and database applications using Node.js and MongoDB.",
    skills: ["Node.js", "Express", "MongoDB"]
  },
  {
    id: "3",
    title: "Machine Learning Intern",
    company: "DataWorks",
    duration: "4 Months",
    location: "Hybrid",
    stipend: "₹12,000/month",
    description: "Work with datasets and build machine learning models.",
    skills: ["Python", "Pandas", "Machine Learning"]
  },
  {
    id: "4",
    title: "Full Stack Developer Intern",
    company: "WebCraft",
    duration: "3 Months",
    location: "Remote",
    stipend: "₹12,000/month",
    description: "Build full-stack applications using React and Node.js.",
    skills: ["React", "Node.js", "Express", "MongoDB"]
  }
];

function Header() {
  return (
    <header className="header">
      <Link className="logo" to="/">InternHub</Link>
      <nav>
        <Link to="/">Internships</Link>
        <Link to="/apply">Apply Now</Link>
      </nav>
    </header>
  );
}

function InternshipList() {
  const [items, setItems] = useState(internships);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/internships`)
      .then(response => {
        if (!response.ok) throw new Error("Request failed");
        return response.json();
      })
      .then(data => setItems(data))
      .catch(() => setError("Showing sample internships. Backend is unavailable."));
  }, []);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">BUILD YOUR FUTURE</p>
        <h1>Find Your Perfect Internship</h1>
        <p>Discover opportunities, learn new skills and start your career.</p>
        <a href="#internships" className="primary-btn">Explore Internships</a>
      </section>

      <main className="container" id="internships">
        <h2>Available Internships</h2>
        <p className="subtitle">Choose an opportunity that matches your interests.</p>
        {error && <p className="notice">{error}</p>}

        <div className="grid">
          {items.map(item => (
            <article className="card" key={item.id}>
              <span className="tag">{item.location}</span>
              <h3>{item.title}</h3>
              <p className="company">{item.company}</p>
              <p>{item.description}</p>
              <div className="card-info">
                <span>{item.duration}</span>
                <strong>{item.stipend}</strong>
              </div>
              <Link className="secondary-btn" to={`/internship/${item.id}`}>
                View Details
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}

function InternshipDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/internships/${id}`)
      .then(response => {
        if (!response.ok) throw new Error("Internship not found");
        return response.json();
      })
      .then(setItem)
      .catch(() => {
        const fallback = internships.find(internship => internship.id === id);
        if (fallback) setItem(fallback);
        else setError("Internship not found.");
      });
  }, [id]);

  if (error) return <main className="container"><p>{error}</p><Link to="/">Go Home</Link></main>;
  if (!item) return <main className="container">Loading internship...</main>;

  return (
    <main className="container details">
      <Link to="/">← Back to Internships</Link>
      <article className="card details-card">
        <span className="tag">{item.location}</span>
        <h1>{item.title}</h1>
        <h3 className="company">{item.company}</h3>
        <p>{item.description}</p>
        <p><strong>Duration:</strong> {item.duration}</p>
        <p><strong>Stipend:</strong> {item.stipend}</p>
        <h3>Required Skills</h3>
        <div className="skills">
          {item.skills.map(skill => <span className="tag" key={skill}>{skill}</span>)}
        </div>
        <Link className="primary-btn" to={`/apply?internship=${encodeURIComponent(item.title)}`}>
          Apply for This Internship
        </Link>
      </article>
    </main>
  );
}

function ApplicationForm() {
  const [params] = useSearchParams();
  const [items, setItems] = useState(internships);
  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    internship: params.get("internship") || ""
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/internships`)
      .then(response => {
        if (!response.ok) throw new Error("Unable to load internships");
        return response.json();
      })
      .then(setItems)
      .catch(() => {});
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (form.name.trim().length < 3) {
      setMessage("Name must contain at least 3 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setMessage("Enter a valid email address.");
      return;
    }

    if (!/^[a-zA-Z0-9/-]{3,30}$/.test(form.rollNumber.trim())) {
      setMessage("Enter a valid roll number.");
      return;
    }

    if (!items.some(item => item.title === form.internship)) {
      setMessage("Please select an internship.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          rollNumber: form.rollNumber.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Submission failed");

      setSuccess(true);
      setMessage(data.message || "Application submitted successfully!");
      setForm({ name: "", email: "", rollNumber: "", internship: "" });
    } catch (error) {
      setMessage(error.message || "Unable to connect to the backend.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container form-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <p className="eyebrow">TAKE THE NEXT STEP</p>
        <h1>Internship Application</h1>
        <p className="subtitle">Enter your student details below.</p>

        {message && (
          <p className={success ? "success-message" : "error-message"} role="status">
            {message}
          </p>
        )}

        <label htmlFor="name">Student Name</label>
        <input id="name" name="name" value={form.name}
          onChange={handleChange} minLength={3} maxLength={80}
          placeholder="Enter your name" required />

        <label htmlFor="email">Email ID</label>
        <input id="email" name="email" type="email" value={form.email}
          onChange={handleChange} placeholder="student@example.com" required />

        <label htmlFor="rollNumber">Roll Number</label>
        <input id="rollNumber" name="rollNumber" value={form.rollNumber}
          onChange={handleChange} minLength={3} maxLength={30}
          pattern="[a-zA-Z0-9/-]{3,30}" placeholder="Enter roll number" required />

        <label htmlFor="internship">Selected Internship</label>
        <select id="internship" name="internship" value={form.internship}
          onChange={handleChange} required>
          <option value="">Choose an internship</option>
          {items.map(item => (
            <option key={item.id} value={item.title}>
              {item.title} - {item.company}
            </option>
          ))}
        </select>

        <button className="primary-btn submit-btn" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </main>
  );
}

function NotFound() {
  return <main className="container"><h1>Page Not Found</h1><Link to="/">Go Home</Link></main>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<InternshipList />} />
        <Route path="/internship/:id" element={<InternshipDetails />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="footer">© 2026 InternHub | Student Internship Portal</footer>
    </BrowserRouter>
  );
}
