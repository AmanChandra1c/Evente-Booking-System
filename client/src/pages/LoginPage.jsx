import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/Context";
import Button from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import ScrollReveal from "../components/ui/ScrollReveal";
import Input from "../components/ui/Input";
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
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    } else if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/signin", { formData });
      setUser(res.data);
      toast.success("Logged in successfully");
      
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
      toast.error(error.response?.data.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0">
          <div className="h-full w-full opacity-20">
            <div className="h-full w-full bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
            <div className="h-full w-full bg-gradient-to-tr from-pink-600/5 via-blue-600/5 to-purple-600/5"></div>
            <div className="h-full w-full bg-gradient-to-bl from-purple-600/3 via-blue-600/3 to-pink-600/3"></div>
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                <h1 className="text-4xl font-bold text-gradient mb-2">
                  Welcome Back
                </h1>
                
                <p className="text-slate-400 text-lg">
                  Sign in to access your account
                </p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                  placeholder="Enter your password"
                  glass
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full text-sm sm:text-base py-3 sm:py-4"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4 4m4-4v4m-4 4h8" />
                    </svg>
                    Sign In
                  </span>
                </Button>
              </form>

              {/* Footer */}
              <div className="text-center pt-4 sm:pt-6 border-t border-slate-700">
                <p className="text-slate-400 text-sm sm:text-base">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                  >
                    Create Account
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

export default LoginPage;
