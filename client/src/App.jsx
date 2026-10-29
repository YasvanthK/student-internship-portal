
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import InternshipList from "./pages/InternshipList";
import InternshipDetails from "./pages/InternshipDetails";
import ApplicationForm from "./pages/ApplicationForm";
import Applications from "./pages/Applications";
import "./App.css";

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        InternConnect
      </Link>

      <div className="nav-links">
        <Link to="/">Internships</Link>
        <Link to="/apply">Apply</Link>
        <Link to="/applications">View Applications</Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="app">
      <Navigation />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<InternshipList />} />
          <Route path="/internships/:id" element={<InternshipDetails />} />
          <Route path="/apply" element={<ApplicationForm />} />
          <Route path="/applications" element={<Applications />} />
          <Route
            path="*"
            element={
              <div className="empty-state">
                <h2>Page not found</h2>
                <Link to="/">Return to internships</Link>
              </div>
            }
          />
        </Routes>
      </main>

      <footer className="footer">
        <p>© 2026 InternConnect | Student Internship Portal</p>
      </footer>
    </div>
  );
}
