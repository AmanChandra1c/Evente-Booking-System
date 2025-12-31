import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/Context";
import API from "../../api/axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/auth/signout");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 rounded-2xl my-2">
      <div className="px-4 mx-auto flex items-center justify-between">
        {/* Logo */}
        <h1
          className="text-xl font-bold text-indigo-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Bookify
        </h1>

        {/* Menu */}
        <ul className="flex gap-8 text-gray-700 font-medium items-center">
          <Link
            to="/"
            className="hover:text-indigo-600 cursor-pointer transition"
          >
            Home
          </Link>
          <Link
            to="/events"
            className="hover:text-indigo-600 cursor-pointer transition"
          >
            Events
          </Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="hover:text-indigo-600 cursor-pointer transition"
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
