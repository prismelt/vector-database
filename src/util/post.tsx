import styles from "../app.module.css";
import { useState } from "react";
import * as api from "../lib/api";

interface groupType {
  group_id: number;
  is_admin: boolean;
}

function renderPostForm(group: groupType) {
  const [id, setId] = useState<number>(group.is_admin ? 1 : group.group_id);
  const [name, setName] = useState("");
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(id && name && data)) {
      setError("Please fill in all fields");
      setSuccess("");
      return;
    }
    try {
      await api.post(id!, name, data);
      setError("");
      setSuccess("Data posted successfully!");
      // Clear input fields
      setName("");
      setData("");
      // Reset id only if admin
      if (group.is_admin) {
        setId(1);
      }
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error: " + err);
      setSuccess("");
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          {group.is_admin && (
            <label className={styles.label}>
              Database ID
              <select
                value={id}
                onChange={(e) => setId(parseInt(e.target.value))}
                className={styles.input}
              >
                <option value={1}>Database 1</option>
                <option value={2}>Database 2</option>
                <option value={3}>Database 3</option>
              </select>
            </label>
          )}

          <label className={styles.label}>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Enter name"
            />
          </label>
          <label className={styles.label}>
            Data
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              className={styles.input}
              placeholder="Enter data"
            />
          </label>
          <button type="submit" className={styles.button}>
            Post
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
      </form>
    </div>
  );
}

export default renderPostForm;
