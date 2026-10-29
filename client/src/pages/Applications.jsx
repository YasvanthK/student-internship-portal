
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/applications");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load applications.");
      }

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response from the server.");
      }

      setApplications(data);
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredApplications = applications.filter((application) => {
    const searchText = search.toLowerCase();

    return [
      application.studentName,
      application.email,
      application.rollNumber,
      application.internship
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );
  });

  function formatDate(date) {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  return (
    <section className="applications-page">
      <div className="applications-heading">
        <div>
          <p className="eyebrow">STUDENT INTERNSHIP PORTAL</p>
          <h1>Submitted Applications</h1>
          <p className="page-description">
            View the internship applications saved in the database.
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={fetchApplications}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="application-stats">
        <div className="stat-card">
          <span>Total Applications</span>
          <strong>{applications.length}</strong>
        </div>

        <div className="stat-card">
          <span>Search Results</span>
          <strong>{filteredApplications.length}</strong>
        </div>
      </div>

      <div className="applications-toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email, roll number, or internship..."
          aria-label="Search applications"
        />
      </div>

      {loading && (
        <div className="empty-state">
          <p>Loading applications...</p>
        </div>
      )}

      {!loading && error && (
        <div className="error-message">
          <p>{error}</p>
          <button
            type="button"
            className="refresh-button"
            onClick={fetchApplications}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filteredApplications.length === 0 && (
        <div className="empty-state">
          <h2>
            {applications.length === 0
              ? "No applications yet"
              : "No matching applications"}
          </h2>

          <p>
            {applications.length === 0
              ? "When a student submits an application, it will appear here."
              : "Try searching with a different name or roll number."}
          </p>

          {applications.length === 0 && (
            <Link to="/" className="primary-button">
              Browse Internships
            </Link>
          )}
        </div>
      )}

      {!loading && !error && filteredApplications.length > 0 && (
        <div className="table-container">
          <table className="applications-table">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Roll Number</th>
                <th>Internship</th>
                <th>Applied Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map((application, index) => (
                <tr key={application._id || `${application.rollNumber}-${index}`}>
                  <td>{index + 1}</td>
                  <td className="student-name">
                    {application.studentName}
                  </td>
                  <td>{application.email}</td>
                  <td>{application.rollNumber}</td>
                  <td>
                    <span className="internship-badge">
                      {application.internship}
                    </span>
                  </td>
                  <td>{formatDate(application.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
