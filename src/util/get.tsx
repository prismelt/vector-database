import styles from "../app.module.css";
import * as api from "../lib/api";
import { useState } from "react";
import useDataContext from "../context/data";

interface groupType {
  group_id: number;
  is_admin: boolean;
}

function renderGetForm(group: groupType) {
  const [id, setId] = useState<number>(group.is_admin ? 1 : group.group_id);
  const [query, setQuery] = useState("");
  const [n, setN] = useState(1);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { setData } = useDataContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(id && query && n)) {
      setError("Please fill in all fields");
      setSuccess("");
      return;
    }
    try {
      const data = await api.get(id!, query, n);
      setResults(data);
      setData(data); // data is already an array from the API
      setError("");
      setSuccess("Data retrieved successfully!");
      // Clear input fields
      setQuery("");
      setN(1);
      // Reset id only if admin
      if (group.is_admin) {
        setId(1);
      }
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error: " + err);
      setSuccess("");
      setResults([]);
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
            Query
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.input}
              placeholder="Enter query"
            />
          </label>
          <label className={styles.label}>
            Number of Results
            <input
              type="number"
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
              className={styles.input}
              placeholder="Enter number of results"
            />
          </label>
          <button type="submit" className={styles.button}>
            Get
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
      </form>

      {results.length > 0 && (
        <div className={styles.results}>
          <h2 className={styles.resultsTitle}>Results</h2>
          <ul className={styles.resultsList}>
            {results.map((result, index) => (
              <li key={index} className={styles.resultItem}>
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default renderGetForm;
