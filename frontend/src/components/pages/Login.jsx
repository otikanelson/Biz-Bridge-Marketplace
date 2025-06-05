// Updated Login.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  // Get auth context
  const { isAuthenticated, login, authError, loading } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(from);
    }
  }, [isAuthenticated, loading, navigate, from]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Call login from auth context
        const result = await login({
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          // Navigate to intended route after successful login
          navigate(from);
        }
      } catch (error) {
        console.error("Login submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span
              onClick={() => navigate("/")}
              className="text-red-500 text-5xl select-none font-bold cursor-pointer"
            >
              𐐒
            </span>
            <span
              onClick={() => navigate("/")}
              className="text-white text-4xl select-none font-bold cursor-pointer"
            >
              B
            </span>
            <span
              onClick={() => navigate("/")}
              className="text-red-500 text-2xl select-none cursor-pointer font-semibold ml-5"
            >
              BizBridge
            </span>
          </div>
          <nav className="flex space-x-8">
            <span
              onClick={() => navigate("/")}
              className="hover:text-red-400 cursor-pointer"
            >
              Home
            </span>
            <span
              onClick={() => navigate("/login")}
              className="text-red-400 cursor-pointer"
            >
              Login
            </span>
            <span
              onClick={() => navigate("/signup")}
              className="hover:text-red-400 cursor-pointer"
            >
              Register
            </span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-white flex-grow py-12">
        <div className="container mx-auto border-y border-orange-500 py-8 px-4 mb-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            Welcome Back to BizBridge
          </h1>
        </div>

        <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Login to Your Account
          </h2>

          {/* Display auth errors */}
          {authError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="w-196 bg-gradient-to-r from-red-50 to-white p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                Welcome Back
              </h2>
              <p className="text-center text-gray-600 mb-4">
                Join our community of skilled artisans and grow your business or
                you can find skilled artisans to assist you in various tasks
              </p>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="mr-2"
                />
                <label htmlFor="remember" className="text-gray-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-red-500 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className={`w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-red-500 hover:underline">
                  Sign up here
                </Link>
              </p>
              <p className="text-gray-600 mt-2">
                Want to list your services?{" "}
                <Link
                  to="/signup?type=artisan"
                  className="text-red-500 hover:underline"
                >
                  Register as an artisan
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-4">Connect with us!</h3>
            <div className="flex justify-center space-x-4">
              {/* Social media icons */}
            </div>
          </div>
          <div className="text-center">
            <p>
              &copy; {new Date().getFullYear()} BizBridge. All rights reserved.
            </p>
            <div className="mt-2">
              <a href="#" className="text-red-400 hover:text-red-500 mx-2">
                Terms of Service
              </a>
              <a href="#" className="text-red-400 hover:text-red-500 mx-2">
                Privacy Policy
              </a>
              <a href="#" className="text-red-400 hover:text-red-500 mx-2">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
