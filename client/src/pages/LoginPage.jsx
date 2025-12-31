import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/Context";
import API from "../../api/axios";

const LoginPage = () => {
  const { setUser, setLoading } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    // setLoading(true);
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    } else if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      const res = await API.post("/auth/signin", { formData });
      setUser(res.data);
      toast.success("loged in successfully");
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error.response?.data?.message);
      toast.error(error.response?.data.message);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mt-2">Login to your account</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 cursor-pointer rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold cursor-pointer hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
