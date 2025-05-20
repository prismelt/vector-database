import { useState } from "react";
import QueryForm from "./components/query";
import IntelligentQueryForm from "./components/intelligence";
import UploadForm from "./components/upload";
import DeleteForm from "./components/delete";

function App() {
  const [formType, setFormType] = useState("");

  const renderForm = () => {
    switch (formType) {
      case "query":
        return <QueryForm />;
      case "intelligent-query":
        return <IntelligentQueryForm />;
      case "upload":
        return <UploadForm />;
      case "delete":
        return <DeleteForm />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <select
        onChange={(e) => setFormType(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      >
        <option value="">Select the type of operation</option>
        <option value="query">Query</option>
        <option value="intelligent-query">Intelligent Query</option>
        <option value="upload">Upload</option>
        <option value="delete">Delete</option>
      </select>
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        {renderForm()}
      </div>
    </div>
  );
}

export default App;
