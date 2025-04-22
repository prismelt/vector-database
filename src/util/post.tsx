import styles from "../app.module.css";
import { useState, useRef } from "react";
import * as api from "../lib/api";

interface groupType {
  group_id: number;
  is_admin: boolean;
}

function renderPostForm(group: groupType) {
  const [id, setId] = useState<number>(group.is_admin ? 1 : group.group_id);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(id && name && file)) {
      setError("Please fill in all fields");
      setSuccess("");
      return;
    }
    try {
      await api.post(id!, name, file);
      setError("");
      setSuccess(`File "${file.name}" uploaded successfully!`);
      setName("");
      setFile(null);
      if (group.is_admin) {
        setId(1);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error: " + err);
      setSuccess("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(""); // Clear any previous errors
    }
  };

  const handleReset = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
            File
            <div className={styles.fileInputContainer}>
              <input
                type="file"
                onChange={handleFileChange}
                className={`${styles.input} ${styles.fileInput}`}
                accept=".txt,.md,.json,.csv,.pdf"
                ref={fileInputRef}
                style={{
                  color: "transparent",
                  padding: "0.5rem",
                  cursor: "pointer",
                }}
              />
              {file && (
                <div className={styles.fileInfo}>
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className={styles.resetButton}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <p className={styles.label}>
              Accepted file types: .txt, .md, .json, .csv, .pdf
            </p>
          </label>
          <button type="submit" className={styles.button}>
            Upload
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
      </form>
    </div>
  );
}

export default renderPostForm;
