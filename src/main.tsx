import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { LoginProvider } from "./context/login.tsx";
import { DataProvider } from "./context/data.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoginProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </LoginProvider>
  </StrictMode>
);
