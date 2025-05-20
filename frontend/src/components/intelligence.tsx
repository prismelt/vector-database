import React, { useState } from "react";

// Define the expected structure of the request body for the /query/ai endpoint
interface InformationSchemaPayload {
  prompt: string;
  collection_name: string;
  db_id?: number | null; // Optional, can be number or null
  response_schema: {
    data: { [key: string]: "number" | "text" | "boolean" };
  };
}

// Define a type for individual schema fields in the UI state
interface SchemaField {
  id: string; // For React key prop
  name: string;
  type: "number" | "text" | "boolean";
}

// Define the expected structure of the API response
// This is an assumption based on the previous component and `basic_query`
// Adjust if your /query/ai endpoint returns a different structure
interface ApiResponse {
  results: Array<{ id: string; text: string; [key: string]: unknown }>; // Allow for dynamic fields
  // Or if it's just a simple string or object
  // message?: string;
  // data?: any;
}

const IntelligentQueryForm: React.FC = () => {
  // State for form inputs
  const [prompt, setPrompt] = useState<string>("Extract user name and age.");
  const [collectionName, setCollectionName] = useState<string>("user_profiles");
  const [dbId, setDbId] = useState<string>(""); // Stored as string for input, converted on submit

  // State for dynamic response_schema fields
  const [schemaFields, setSchemaFields] = useState<SchemaField[]>([
    { id: crypto.randomUUID(), name: "userName", type: "text" },
    { id: crypto.randomUUID(), name: "userAge", type: "number" },
  ]);

  // State for API response and loading/error states
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Base URL for the FastAPI server
  const API_BASE_URL = "http://localhost:8000"; // Default FastAPI port is 8000

  // --- Schema Field Management ---
  const handleAddSchemaField = () => {
    setSchemaFields([
      ...schemaFields,
      { id: crypto.randomUUID(), name: "", type: "text" },
    ]);
  };

  const handleRemoveSchemaField = (id: string) => {
    setSchemaFields(schemaFields.filter((field) => field.id !== id));
  };

  const handleSchemaFieldNameChange = (id: string, newName: string) => {
    setSchemaFields(
      schemaFields.map((field) =>
        field.id === id ? { ...field, name: newName } : field
      )
    );
  };

  const handleSchemaFieldTypeChange = (
    id: string,
    newType: "number" | "text" | "boolean"
  ) => {
    setSchemaFields(
      schemaFields.map((field) =>
        field.id === id ? { ...field, type: newType } : field
      )
    );
  };

  // --- Form Submission ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    // Validate schema fields: names should not be empty
    if (schemaFields.some((field) => !field.name.trim())) {
      setError("All schema field names must be filled.");
      setIsLoading(false);
      return;
    }
    if (schemaFields.length === 0) {
      setError(
        "Response schema cannot be empty. Please add at least one field."
      );
      setIsLoading(false);
      return;
    }

    // Construct the response_schema.data object
    const responseSchemaData: { [key: string]: "number" | "text" | "boolean" } =
      {};
    for (const field of schemaFields) {
      if (field.name.trim()) {
        // Ensure name is not just whitespace
        responseSchemaData[field.name.trim()] = field.type;
      }
    }

    const payload: InformationSchemaPayload = {
      prompt,
      collection_name: collectionName,
      response_schema: {
        data: responseSchemaData,
      },
    };

    if (dbId) {
      const parsedDbId = parseInt(dbId, 10);
      if (!isNaN(parsedDbId)) {
        payload.db_id = parsedDbId;
      } else {
        setError("Invalid Database ID. Must be a number.");
        setIsLoading(false);
        return;
      }
    } else {
      payload.db_id = null; // Explicitly send null if empty, as per Optional[int]
    }

    try {
      const res = await fetch(`${API_BASE_URL}/query/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ detail: res.statusText }));
        throw new Error(
          `API Error: ${res.status} - ${errorData.detail || "Unknown error"}`
        );
      }

      const data: ApiResponse = await res.json();
      setResponse(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
        color: "white",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "48rem",
          backgroundColor: "#1e293b",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            textAlign: "center",
            color: "#2dd4bf",
          }}
        >
          Intelligent AI Query
        </h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
          {/* Prompt Input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="prompt"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#5eead4",
                marginBottom: "0.25rem",
              }}
            >
              Prompt
            </label>
            <textarea
              id="prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "#334155",
                border: "1px solid #475569",
                borderRadius: "0.5rem",
                color: "white",
                outline: "none",
                transition: "all 150ms ease-in-out",
              }}
              placeholder="e.g., Find users interested in AI"
            />
          </div>

          {/* Collection Name and DB ID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <label
                htmlFor="collectionName"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#5eead4",
                  marginBottom: "0.25rem",
                }}
              >
                Collection Name
              </label>
              <input
                type="text"
                id="collectionName"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  backgroundColor: "#334155",
                  border: "1px solid #475569",
                  borderRadius: "0.5rem",
                  color: "white",
                  outline: "none",
                  transition: "all 150ms ease-in-out",
                }}
                placeholder="e.g., user_data"
              />
            </div>
            <div>
              <label
                htmlFor="dbId"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#5eead4",
                  marginBottom: "0.25rem",
                }}
              >
                Database ID (Optional)
              </label>
              <input
                type="text"
                id="dbId"
                value={dbId}
                onChange={(e) => setDbId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  backgroundColor: "#334155",
                  border: "1px solid #475569",
                  borderRadius: "0.5rem",
                  color: "white",
                  outline: "none",
                  transition: "all 150ms ease-in-out",
                }}
                placeholder="e.g., 123 (numeric)"
              />
            </div>
          </div>

          {/* Response Schema Fields */}
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              border: "1px solid #334155",
              borderRadius: "0.5rem",
              backgroundColor: "rgba(51, 65, 85, 0.3)",
            }}
          >
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#5eead4",
                marginBottom: "0.75rem",
              }}
            >
              Define Response Schema
            </h3>
            {schemaFields.map((field, index) => (
              <div
                key={field.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  padding: "0.75rem",
                  backgroundColor: "#334155",
                  borderRadius: "0.375rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ flexGrow: 1, width: "100%" }}>
                  <label
                    htmlFor={`fieldName-${field.id}`}
                    style={{
                      position: "absolute",
                      width: "1px",
                      height: "1px",
                      padding: "0",
                      margin: "-1px",
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                      whiteSpace: "nowrap",
                      borderWidth: "0",
                    }}
                  >
                    Field Name
                  </label>
                  <input
                    type="text"
                    id={`fieldName-${field.id}`}
                    value={field.name}
                    onChange={(e) =>
                      handleSchemaFieldNameChange(field.id, e.target.value)
                    }
                    placeholder={`Field ${index + 1} Name`}
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "0.375rem",
                      color: "white",
                      outline: "none",
                    }}
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <label
                    htmlFor={`fieldType-${field.id}`}
                    style={{
                      position: "absolute",
                      width: "1px",
                      height: "1px",
                      padding: "0",
                      margin: "-1px",
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                      whiteSpace: "nowrap",
                      borderWidth: "0",
                    }}
                  >
                    Field Type
                  </label>
                  <select
                    id={`fieldType-${field.id}`}
                    value={field.type}
                    onChange={(e) =>
                      handleSchemaFieldTypeChange(
                        field.id,
                        e.target.value as "number" | "text" | "boolean"
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "0.375rem",
                      color: "white",
                      outline: "none",
                    }}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSchemaField(field.id)}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "#dc2626",
                    color: "white",
                    borderRadius: "0.375rem",
                    transition: "all 150ms ease-in-out",
                    width: "100%",
                    fontSize: "0.875rem",
                  }}
                  aria-label="Remove schema field"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSchemaField}
              style={{
                marginTop: "0.75rem",
                width: "100%",
                padding: "0.5rem 1rem",
                backgroundColor: "#0284c7",
                color: "white",
                fontWeight: "500",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                transition: "all 150ms ease-in-out",
                fontSize: "0.875rem",
              }}
            >
              + Add Schema Field
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              backgroundColor: "#0d9488",
              color: "white",
              fontWeight: "600",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: "all 150ms ease-in-out",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isLoading ? "0.5" : "1",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? (
              <>
                <svg
                  style={{
                    animation: "spin 1s linear infinite",
                    marginRight: "0.75rem",
                    height: "1.25rem",
                    width: "1.25rem",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    style={{ opacity: "0.25" }}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    style={{ opacity: "0.75" }}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Querying AI...
              </>
            ) : (
              "Submit Intelligent Query"
            )}
          </button>
        </form>

        {/* Display API Response/Error */}
        {error && (
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              backgroundColor: "#b91c1c",
              border: "1px solid #7f1d1d",
              borderRadius: "0.5rem",
              color: "white",
            }}
          >
            <h3
              style={{
                fontWeight: "600",
                fontSize: "1.125rem",
                marginBottom: "0.5rem",
              }}
            >
              Error:
            </h3>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {error}
            </pre>
          </div>
        )}

        {response && (
          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              backgroundColor: "#334155",
              border: "1px solid #475569",
              borderRadius: "0.75rem",
              boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
            }}
          >
            <h3
              style={{
                fontWeight: "600",
                fontSize: "1.25rem",
                marginBottom: "1rem",
                color: "#5eead4",
              }}
            >
              AI Query Response:
            </h3>
            {response.results && Array.isArray(response.results) ? (
              <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                {response.results.map((item, index) => (
                  <li
                    key={item.id || index}
                    style={{
                      padding: "1rem",
                      backgroundColor: "#1e293b",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      boxShadow:
                        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    {Object.entries(item).map(([key, value]) => (
                      <div key={key} style={{ marginBottom: "0.25rem" }}>
                        <span
                          style={{
                            fontSize: "0.875rem",
                            color: "#94a3b8",
                            textTransform: "capitalize",
                          }}
                        >
                          {key.replace(/([A-Z])/g, " $1")}:{" "}
                        </span>
                        <span style={{ fontSize: "1rem", color: "white" }}>
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </li>
                ))}
                {response.results.length === 0 && (
                  <p style={{ color: "#94a3b8" }}>
                    No results found for your query.
                  </p>
                )}
              </ul>
            ) : (
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  fontSize: "0.875rem",
                  backgroundColor: "#0f172a",
                  padding: "1rem",
                  borderRadius: "0.375rem",
                }}
              >
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
      <footer
        style={{
          marginTop: "3rem",
          textAlign: "center",
          fontSize: "0.875rem",
          color: "#64748b",
        }}
      >
        <p>Intelligent Query Form &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default IntelligentQueryForm;
