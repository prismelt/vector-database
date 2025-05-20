import React, { useState } from "react";

// Define the expected structure of the API response
// You might need to adjust this based on what your `basic_query` function returns
interface ApiResponse {
  // Example: Assuming your response is an array of objects with a 'text' field
  results: Array<{ id: string; text: string; score: number }>;
  // Or if it's just a simple string or object
  // message?: string;
  // data?: any;
}

function QueryForm() {
  // State for form inputs
  const [prompt, setPrompt] = useState<string>(
    "What is the capital of France?"
  );
  const [collectionName, setCollectionName] = useState<string>("my_documents");
  const [dbId, setDbId] = useState<string>(""); // Optional, so can be empty
  const [limit, setLimit] = useState<number>(2);

  // State for API response and loading/error states
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Base URL for the FastAPI server - adjust if your server runs elsewhere
  const API_BASE_URL = "http://localhost:8000"; // Default FastAPI port is 8000

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setError(null);
    setResponse(null);

    // Construct query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("prompt", prompt);
    queryParams.append("collection_name", collectionName);
    if (dbId) {
      queryParams.append("db_id", dbId);
    }
    queryParams.append("limit", limit.toString());

    try {
      // Make the GET request
      const res = await fetch(
        `${API_BASE_URL}/query/basic?${queryParams.toString()}`
      );

      if (!res.ok) {
        // Handle HTTP errors
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
          maxWidth: "42rem",
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
            color: "#38bdf8",
          }}
        >
          FastAPI Query Interface
        </h1>

        {/* Form for API query */}
        <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="prompt"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#7dd3fc",
                marginBottom: "0.25rem",
              }}
            >
              Prompt
            </label>
            <input
              type="text"
              id="prompt"
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
              placeholder="Enter your query prompt"
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="collectionName"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#7dd3fc",
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
              placeholder="e.g., articles, documents"
            />
          </div>

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
                htmlFor="dbId"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#7dd3fc",
                  marginBottom: "0.25rem",
                }}
              >
                Database ID (Optional)
              </label>
              <input
                type="number"
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
                placeholder="e.g., 123"
              />
            </div>

            <div>
              <label
                htmlFor="limit"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#7dd3fc",
                  marginBottom: "0.25rem",
                }}
              >
                Limit
              </label>
              <input
                type="number"
                id="limit"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value, 10))}
                min="1"
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
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              backgroundColor: "#0284c7",
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
                Querying...
              </>
            ) : (
              "Submit Query"
            )}
          </button>
        </form>

        {/* Display API Response */}
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
                color: "#7dd3fc",
              }}
            >
              API Response:
            </h3>
            {response.results && Array.isArray(response.results) ? (
              <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                {response.results.map((item, index) => (
                  <li
                    key={item.id || index}
                    style={{
                      padding: "1rem",
                      backgroundColor: "#475569",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      boxShadow:
                        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <p style={{ fontSize: "0.875rem", color: "#cbd5e1" }}>
                      ID: {item.id || "N/A"}
                    </p>
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "white",
                        marginTop: "0.25rem",
                      }}
                    >
                      {item.text}
                    </p>
                    {typeof item.score !== "undefined" && (
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#38bdf8",
                          marginTop: "0.25rem",
                        }}
                      >
                        Score: {item.score.toFixed(4)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  fontSize: "0.875rem",
                  backgroundColor: "#1e293b",
                  padding: "1rem",
                  borderRadius: "0.375rem",
                }}
              >
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
            {response.results && response.results.length === 0 && (
              <p style={{ color: "#94a3b8" }}>
                No results found for your query.
              </p>
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
        <p>FastAPI Query Component &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default QueryForm;
