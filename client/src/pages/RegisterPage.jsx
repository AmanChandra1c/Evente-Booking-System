import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../../context/Context";
import Button from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import ScrollReveal from "../components/ui/ScrollReveal";
import Input from "../components/ui/Input";
import API from "../../api/axios";

const RegisterPage = () => {
  const { setUser, loading, setLoading } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    } else if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    } else if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/signup", { formData });
      setUser(res.data);
      toast.success("Registered successfully");
      
      // Add smooth transition delay
      setTimeout(() => {
        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 500);
    } catch (error) {
      console.error(error.response?.data?.message);
      toast.error(error.response?.data.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20"></div>
        <div className="absolute inset-0">
          <div className="h-full w-full opacity-20">
            <div className="h-full w-full bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10"></div>
            <div className="h-full w-full">
              <div className="h-full w-full bg-gradient-to-tr from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
              <div className="h-full w-full">
                <div className="h-full w-full bg-gradient-to-bl from-pink-600/3 via-blue-600/3 to-purple-600/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={0.1}>
          <Card glass className="overflow-hidden">
            <CardBody className="p-8">
              {/* Header */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v-3m0 3h.01M12 9v3m0 0v-3m0 3h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12z" />
                  </svg>
                </div>
                
                <h1 className="text-4xl font-bold text-gradient mb-2">
                  Create Account
                </h1>
                
                <p className="text-slate-400 text-lg">
                  Join us and start your journey
                </p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <Input
                  label="Full Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  glass
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  glass
                  required
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  glass
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Account Type
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/60 backdrop-blur border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="user">User Account</option>
                    <option value="admin">Admin Account</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v-3m0 3h.01M12 9v3m0 0v-3m0 3h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12z" />
                    </svg>
                    Create Account
                  </span>
                </Button>
              </form>

              {/* Footer */}
              <div className="text-center pt-6 border-t border-slate-700">
                <p className="text-slate-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </CardBody>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default RegisterPage;
