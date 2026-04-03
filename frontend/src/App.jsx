import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import GuidePage from "./pages/GuidePage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ExamplesPage from "./pages/ExamplesPage";
import SimulatorPage from "./pages/SimulatorPage";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <AppLayout>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<SimulatorPage />} path="/simulator" />
          <Route element={<ExamplesPage />} path="/examples" />
          <Route element={<GuidePage />} path="/guide" />
          <Route element={<AboutPage />} path="/about" />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
