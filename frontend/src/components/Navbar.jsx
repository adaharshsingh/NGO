import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const isAdminPage = location.pathname === "/admin";

  const logoutAndGoPublic = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between px-6 border-b bg-white">
      <button
        onClick={logoutAndGoPublic}
        className="font-bold text-lg"
      >
        NGO Reports
      </button>

      <div className="space-x-4 flex items-center">
        {!token && !isAdminPage && (
          <button
            onClick={() => navigate("/admin")}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Admin Login
          </button>
        )}

        {token && (
          <>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}