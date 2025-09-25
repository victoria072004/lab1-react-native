import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";   // <--- verifică că App.jsx există exact aici
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
