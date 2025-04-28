import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginImg from "../assets/images/loginimg.png"; // Adjust the path as per your project structure
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reduxslice/AuthSlice";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Can be email, phone, or username
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  console.log(token);
  // Regex validations
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[0-9]{10}$/; // Simple phone number validation
  const usernameRegex = /^[a-zA-Z0-9._-]{3,}$/; // Simple username validation
  const passwordRegex = /^[A-Za-z]+@[0-9]+$/;

  const navigateRegister = () => {
    navigate("/registration");
  };
  const navigatebackupemail = () => {
    navigate("/forgotpasswordemail");
  };
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Frontend validation
    if (!loginType) {
      setErrorMessage({
        loginTypeError: "Please select a role.",
      });
      return;
    }

    if (
      !emailRegex.test(identifier) &&
      !phoneRegex.test(identifier) &&
      !usernameRegex.test(identifier)
    ) {
      setErrorMessage({
        emailError: "Email is required",
        phoneError: "Phone is required",
        userNameError: "Username is required",
      });
      return;
    } else {
      setErrorMessage({});
    }

    if (!passwordRegex.test(password)) {
      setErrorMessage({
        passwordError: "Correct Password is required",
      });
      return;
    } else {
      setErrorMessage({});
    }

    // Backend call
    try {
      const requestBody = {
        password,
        role: loginType,
      };

      // Send only email or username based on the role
      if (emailRegex.test(identifier)) {
        requestBody.email = identifier;
      } else {
        requestBody.username = identifier;
      }

      console.log("Request Body:", requestBody); // Log the request body for debugging

      const response = await fetch("https://medimentorbackend.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();

        // Store the token in local storage
        dispatch(
          login({
            token: data.token,
            user: data.user,
          })
        );

        // Role-based navigation
        if (data.user.role === "doctor") {
          navigate("/doctordashboard");
        } else if (data.user.role === "user") {
          navigate("/dashboard");
        } else if (data.user.role === "admin") {
          navigate("/admindashboard"); // Handle admin redirection here
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to log in.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Login form section */}
      <div className="w-full md:w-1/2  flex flex-col justify-center items-center p-8  rounded-lg">
        <div className="w-full max-w-sm bg-white p-2 rounded-lg shadow-lg">
          <button onClick={handleBackClick} className="text-emerald-600 mb-4">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="flex items-center justify-center">
            <h2 className="text-2xl sm:text-4xl text-emerald-500 p-2 mb-6">
              Let&apos;s you sign in
            </h2>
          </div>

          {/* Error Message */}
          {errorMessage.phoneError && (
            <div className="mb-4 text-red-500 text-sm">
              {errorMessage.phoneError}
            </div>
          )}
          {errorMessage.emailError && (
            <div className="mb-4 text-red-500 text-sm">
              {errorMessage.emailError}
            </div>
          )}
          {errorMessage.userNameError && (
            <div className="mb-4 text-red-500 text-sm">
              {errorMessage.userNameError}
            </div>
          )}
          {errorMessage.passwordError && (
            <div className="mb-4 text-red-500 text-sm">
              {errorMessage.passwordError}
            </div>
          )}
          {errorMessage.loginTypeError && (
            <div className="mb-4 text-red-500 text-sm">
              {errorMessage.loginTypeError}
            </div>
          )}

          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            className="p-5"
          >
            {/* Login Type Dropdown */}
            <div className="mb-4 relative">
              <label
                className="block text-gray-600 text-sm font-medium mb-2"
                htmlFor="loginType"
              >
                Select Role
              </label>
              <select
                id="loginType"
                value={loginType}
                onChange={(e) => setLoginType(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 sm:py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select role</option> {/* Updated default value */}
                <option value="user">User</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {/* Identifier Input */}
            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-medium mb-2"
                htmlFor="identifier"
              >
                <span className="block sm:hidden">Username</span>
                <span className="hidden sm:block">
                  Email or Phone Number or Username
                </span>
              </label>
              <input
                className=" text-sm shadow appearance-none border rounded w-full py-2 sm:py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email or Phone Number or Username"
              />
            </div>
            {/* Password Input */}
            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className=" text-sm shadow appearance-none border rounded w-full py-2 sm:py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <div onClick={navigatebackupemail}>
              <p className="text-sm text-emerald-500 mt-2 hover:cursor-pointer">Forgot Password</p>
              </div>
              
            </div>
            {/* Submit Button */}
            <div className="mb-4">
              <button
                type="submit"
                className="bg-emerald-400 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                Sign In
              </button>
            </div>
            {/* SignUp */}
            <div
              className="flex flex-row justify-center items-center"
              onClick={navigateRegister}
            >
              <p className="text-center p-2 text-gray-600 text-sm">
                Don&apos;t have an acoount?
              </p>
              <p className="text-sm text-emerald-500 hover:cursor-pointer">Signup</p>
            </div>
          </form>
        </div>
      </div>

      {/* Login Image Section */}
      <div className="hidden md:flex md:w-1/2 p-1 justify-center items-center">
        <div className="w-full max-w-lg bg-white p-2 rounded-lg shadow-lg">
          <img src={LoginImg} alt="login img" className="max-w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default Login;
