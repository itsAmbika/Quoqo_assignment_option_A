import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const STATUS_OPTIONS = ["pending", "in_progress", "completed", "cancelled"];

const NewTask = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const redirectTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required");
      setSuccess("");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await axios.post(`${API_BASE_URL}/tasks`, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
      });

      setSuccess("Task created successfully. Redirecting to dashboard...");
      setFormData({
        title: "",
        description: "",
        status: "pending",
      });

      redirectTimerRef.current = setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create task");
      setSuccess("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-panel">
      <div className="page-toolbar">
        <div>
          <h2>Create Task</h2>
          <p>Add a new workflow request to the tracker.</p>
        </div>
        <Link className="secondary-action" to="/">
          View Tasks
        </Link>
      </div>

      {error && <p className="form-message form-message--error">{error}</p>}
      {success && (
        <p className="form-message form-message--success">{success}</p>
      )}

      <form className="task-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add task details"
            rows="4"
          />
        </label>

        <label>
          Status
          <select name="status" value={formData.status} onChange={handleChange}>
            {STATUS_OPTIONS.map((status) => (
              <option value={status} key={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Task"}
        </button>
      </form>
    </section>
  );
};

export default NewTask;
