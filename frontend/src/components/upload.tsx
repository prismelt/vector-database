import React, { useState } from "react";

interface UploadResponse {
  status: string;
}

function UploadForm() {
  const [collectionName, setCollectionName] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [dbId, setDbId] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("collection_name", collectionName);
    if (fileName) formData.append("file_name", fileName);
    if (dbId !== "") formData.append("db_id", String(dbId));
    formData.append("document", file, file.name);

    try {
      const response = await fetch("http://localhost:8000/", {
        method: "POST",
        body: formData,
      });
      const data: UploadResponse = await response.json();
      console.log("Upload result:", data.status);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "300px",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ marginBottom: "0.5rem" }}>Collection Name</label>
        <input
          type="text"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          required
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ marginBottom: "0.5rem" }}>File Name (optional)</label>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ marginBottom: "0.5rem" }}>DB ID (optional)</label>
        <input
          type="number"
          value={dbId}
          onChange={(e) =>
            setDbId(e.target.value === "" ? "" : Number(e.target.value))
          }
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ marginBottom: "0.5rem" }}>PDF Document</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Upload
      </button>
    </form>
  );
}

export default UploadForm;
