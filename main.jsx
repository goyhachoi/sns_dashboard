import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SNSDashboard from "./dashboard.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SNSDashboard />
  </StrictMode>
);
