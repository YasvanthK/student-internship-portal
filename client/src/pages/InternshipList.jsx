
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function InternshipList() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInternships() {
      try {
        const response = await fetch("/api/internships");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load internships");
        }

        setInternships(data);
      } catch (err) {
        setError(err.message || "Unable to connect to the server");
      } finally {
        setLoading(false);
      }
    }

    loadInternships();
  }, []);

  return (
    <section>
      <div className="hero">
        <span className="eyebrow">YOUR CAREER STARTS HERE</span>
        <h1>Discover Your Next Internship</h1>
        <p>
          Explore opportunities, learn new skills, and take your first step
          towards your career.
        </p>
      </div>

      <div className="section-heading">
        <div>
          <h2>Available Internships</h2>
          <p>Choose an internship to see its details.</p>
        </div>
      </div>

      {loading && <p>Loading internships...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && internships.length === 0 && (
        <p>No internships are currently available.</p>
      )}

      <div className="internship-grid">
        {internships.map((internship) => (
          <article className="internship-card" key={internship.id}>
            <div className="card-icon">
              {internship.title.slice(0, 2).toUpperCase()}
            </div>

            <h3>{internship.title}</h3>
            <p>{internship.description}</p>
            <p className="duration">
              <strong>Duration:</strong> {internship.duration}
            </p>

            <Link
              className="primary button-link"
              to={`/internships/${internship.id}`}
            >
              View Details
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
