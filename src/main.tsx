import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./Pages/HomePage";
import { BudgetSimulatorPage } from "./Pages/BudgetSimulatorPage";
import { paths } from "./Routes/paths";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={paths.HOME} replace />} />
        <Route path={paths.HOME} element={<HomePage />} />
        <Route path={paths.BUDGET_SIMULATOR} element={<BudgetSimulatorPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
