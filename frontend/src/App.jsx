import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import BulkUpload from "./pages/BulkUpload";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";

function Layout({ children }) {
  const { pathname } = useLocation();
  const noNavbarOffset = pathname === "/admin";

  return (
    <main className={noNavbarOffset ? "" : "pt-16"}>
      {children}
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/bulk" element={<Layout><BulkUpload /></Layout>} />
        <Route path="/admin" element={<Layout><AdminLogin /></Layout>} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}