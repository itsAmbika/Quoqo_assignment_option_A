import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./TaskList.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const STATUS_OPTIONS = ["pending", "in_progress", "completed", "cancelled"];

const formatStatus = (status) => status.replace("_", " ");
const formatDate = (dateValue) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue));

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState("");
  const [commentTextByTaskId, setCommentTextByTaskId] = useState({});
  const [commentAuthorByTaskId, setCommentAuthorByTaskId] = useState({});
  const [commentingTaskId, setCommentingTaskId] = useState("");

  const statusCounts = STATUS_OPTIONS.reduce(
    (counts, status) => ({
      ...counts,
      [status]: tasks.filter((task) => task.status === status).length,
    }),
    {}
  );

  // Fetch all tasks when the component first renders.
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update a task status and sync the updated task back into local state.
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setUpdatingTaskId(taskId);
      setError("");

      const response = await axios.patch(`${API_BASE_URL}/tasks/${taskId}/status`, {
        status: newStatus,
      });

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === taskId ? response.data.task : task
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update task status");
    } finally {
      setUpdatingTaskId("");
    }
  };

  // Add a comment to one task and replace the local task with the API response.
  const handleCommentSubmit = async (event, taskId) => {
    event.preventDefault();

    const text = commentTextByTaskId[taskId] || "";
    const author = commentAuthorByTaskId[taskId] || "";

    if (!text.trim()) {
      setError("Comment text is required");
      return;
    }

    try {
      setCommentingTaskId(taskId);
      setError("");

      const response = await axios.post(`${API_BASE_URL}/tasks/${taskId}/comments`, {
        text,
        author,
      });

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === taskId ? response.data.task : task
        )
      );

      setCommentTextByTaskId((currentValues) => ({
        ...currentValues,
        [taskId]: "",
      }));
      setCommentAuthorByTaskId((currentValues) => ({
        ...currentValues,
        [taskId]: "",
      }));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add comment");
    } finally {
      setCommentingTaskId("");
    }
  };

  if (loading) {
    return <p className="task-message">Loading tasks...</p>;
  }

  return (
    <section className="task-list">
      <div className="task-list__header">
        <div>
          <h2>Tasks</h2>
          <p>{tasks.length} workflow items</p>
        </div>
        <div className="task-list__actions">
          <Link className="primary-action" to="/new">
            New Task
          </Link>
          <button type="button" onClick={fetchTasks}>
            Refresh
          </button>
        </div>
      </div>

      <div className="task-summary" aria-label="Task status summary">
        {STATUS_OPTIONS.map((status) => (
          <div className="task-summary__item" key={status}>
            <span>{formatStatus(status)}</span>
            <strong>{statusCounts[status]}</strong>
          </div>
        ))}
      </div>

      {error && <p className="task-message task-message--error">{error}</p>}

      {tasks.length === 0 ? (
        <p className="task-message">No tasks found.</p>
      ) : (
        <div className="task-list__items">
          {tasks.map((task) => (
            <article className="task-card" key={task._id}>
              <div className="task-card__top">
                <div>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  <div className="task-meta">
                    <span className={`status-badge status-badge--${task.status}`}>
                      {formatStatus(task.status)}
                    </span>
                    {task.createdAt && <span>Created {formatDate(task.createdAt)}</span>}
                    <span>{task.comments?.length || 0} comments</span>
                  </div>
                </div>

                <label className="task-status">
                  Status
                  <select
                    value={task.status}
                    disabled={updatingTaskId === task._id}
                    onChange={(event) =>
                      handleStatusChange(task._id, event.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option value={status} key={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="task-comments">
                <h4>Comments</h4>

                {task.comments?.length ? (
                  <ul>
                    {task.comments.map((comment) => (
                      <li key={comment._id}>
                        <span>{comment.text}</span>
                        <small>
                          By {comment.author || "Anonymous"}
                          {comment.createdAt ? ` on ${formatDate(comment.createdAt)}` : ""}
                        </small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="task-comments__empty">No comments yet.</p>
                )}
              </div>

              <form
                className="comment-form"
                onSubmit={(event) => handleCommentSubmit(event, task._id)}
              >
                <input
                  type="text"
                  placeholder="Author"
                  value={commentAuthorByTaskId[task._id] || ""}
                  onChange={(event) =>
                    setCommentAuthorByTaskId((currentValues) => ({
                      ...currentValues,
                      [task._id]: event.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={commentTextByTaskId[task._id] || ""}
                  onChange={(event) =>
                    setCommentTextByTaskId((currentValues) => ({
                      ...currentValues,
                      [task._id]: event.target.value,
                    }))
                  }
                />
                <button type="submit" disabled={commentingTaskId === task._id}>
                  {commentingTaskId === task._id ? "Adding..." : "Add Comment"}
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default TaskList;
