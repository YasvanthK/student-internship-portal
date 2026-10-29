
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function InternshipDetails() {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/internships/${encodeURIComponent(id)}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Internship not found");
        }

        setInternship(data);
      } catch (err) {
        setError(err.message || "Unable to load internship details");
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [id]);

  if (loading) {
    return <p>Loading internship details...</p>;
  }

  if (error) {
    return (
      <section className="form-card">
        <p className="error">{error}</p>
        <Link className="secondary button-link" to="/">
          Back to Internships
        </Link>
      </section>
    );
  }

  if (!internship) {
    return <p>Internship not found.</p>;
  }

  return (
    <section className="details-card">
      <Link className="back-link" to="/">
        ← Back to Internships
      </Link>

      <span className="eyebrow">INTERNSHIP DETAILS</span>
      <h1>{internship.title}</h1>
      <p>{internship.description}</p>

      <div className="detail-item">
        <strong>Duration:</strong> {internship.duration}
      </div>

      <h3>Skills you can explore</h3>
      <ul className="skills-list">
        {internship.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      <Link
        className="primary button-link"
        to="/apply"
        state={{ internship: internship.title }}
      >
        Apply for This Internship
      </Link>
    </section>
  );
}
