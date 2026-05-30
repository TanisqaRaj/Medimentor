import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reduxslice/AuthSlice";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Can be email, phone, or username
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.accessToken);
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

      const response = await fetch(`${BACKEND}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();

        // Store the token in local storage
        dispatch(login({ accessToken: data.accessToken,
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
    <main className="w-full min-h-screen flex flex-col md:flex-row bg-surface">
      {/* Left Side: Image/Illustration */}
      <section className="hidden md:flex w-full md:w-1/2 lg:w-7/12 bg-primary-container relative items-center justify-center overflow-hidden h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-secondary opacity-90"></div>
        {/* Background Pattern / Decoration */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        {/* Content Container */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-xl">
          {/* Brand Logo */}
          <div className="flex items-center gap-xs text-on-primary">
            <span className="material-symbols-outlined filled text-display-lg">health_and_safety</span>
            <span className="font-display-lg text-headline-lg tracking-tight">MediMentor</span>
          </div>
          <div className="flex-grow flex items-center justify-center w-full py-8">
            <img alt="Medical Professional" className="w-4/5 max-w-lg h-auto object-cover rounded-xl shadow-2xl shadow-primary/20 aspect-[4/3]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2AWWGpu6opggMmqvMP_Js1cp3H3-OLiVbrAJcbQaQErG1EcrUhxb2qrEzY4TG-5_xBk1GgcUv_NbDGv1rMLa_E6i9D-whzgx0AxYGefd3iBlk0qPgCJ9EPYKmO9DfVzgIPxI5UsvT1jVZ43hA_48XcmIrkGfCmUmGj9_XQClkgFaMxUj_V0O154rqdcr7JxtHfHRenEDnu1FhR6vOI-5aLWYUZetZjQjdIcr_T1EysWVb5_RNziLogNijd76DbzCptde4cMiFKTCl" />
          </div>
          {/* Testimonial / Value Prop */}
          <div className="max-w-md text-on-primary">
            <p className="font-headline-md text-headline-md mb-sm text-balance">&quot;Clinical Clarity Certified.&quot;</p>
            <p className="font-body-lg text-body-lg text-primary-fixed-dim">Join thousands of healthcare professionals connecting and learning in a secure environment.</p>
          </div>
        </div>
      </section>
      
      {/* Right Side: Login Form */}
      <section className="w-full md:w-1/2 lg:w-5/12 flex flex-col items-center justify-between p-sm md:p-xl bg-surface min-h-screen">
        <div className="w-full flex-grow flex items-center justify-center">
          <div className="w-full max-w-md bg-surface-container-lowest p-lg rounded-xl border border-surface-container-highest shadow-sm">
            {/* Back Button */}
            <button onClick={handleBackClick} className="text-primary hover:text-primary-container mb-4 flex items-center transition-colors focus:outline-none">
              <i className="fas fa-arrow-left mr-2"></i>
            </button>
            
            {/* Mobile Brand (Hidden on Desktop) */}
            <div className="md:hidden flex items-center gap-xs text-primary mb-xl justify-center">
              <span className="material-symbols-outlined filled text-display-lg text-primary">health_and_safety</span>
              <span className="font-display-lg text-headline-lg tracking-tight">MediMentor</span>
            </div>
            
            <div className="mb-lg">
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Welcome back</h1>
              <p className="font-body-md text-body-md text-tertiary">Please enter your credentials to access your account.</p>
            </div>
            
            {/* Error Messages */}
            {errorMessage.phoneError && <div className="mb-4 text-error text-sm">{errorMessage.phoneError}</div>}
            {errorMessage.emailError && <div className="mb-4 text-error text-sm">{errorMessage.emailError}</div>}
            {errorMessage.userNameError && <div className="mb-4 text-error text-sm">{errorMessage.userNameError}</div>}
            {errorMessage.passwordError && <div className="mb-4 text-error text-sm">{errorMessage.passwordError}</div>}
            {errorMessage.loginTypeError && <div className="mb-4 text-error text-sm">{errorMessage.loginTypeError}</div>}
            {typeof errorMessage === 'string' && errorMessage && <div className="mb-4 text-error text-sm">{errorMessage}</div>}

            <form className="space-y-md" onSubmit={handleSubmit}>
              {/* Login Type Dropdown */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-base" htmlFor="loginType">Select Role</label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 pl-sm flex items-center pointer-events-none text-tertiary">
                    <span className="material-symbols-outlined">badge</span>
                  </div>
                  <select
                    id="loginType"
                    value={loginType}
                    onChange={(e) => setLoginType(e.target.value)}
                    className="block w-full pl-xl pr-sm py-sm font-body-md text-body-md text-on-surface bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors appearance-none"
                  >
                    <option value="">Select role</option>
                    <option value="user">User</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-0 flex items-center px-2 text-tertiary">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              {/* Identifier Input */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-base" htmlFor="identifier">Email, Phone, or Username</label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 pl-sm flex items-center pointer-events-none text-tertiary">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <input 
                    className="block w-full pl-xl pr-sm py-sm font-body-md text-body-md text-on-surface bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors placeholder:text-tertiary-fixed-dim" 
                    id="identifier" 
                    name="identifier" 
                    placeholder="Email, Phone, or Username" 
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-base" htmlFor="password">Password</label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 pl-sm flex items-center pointer-events-none text-tertiary">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <input 
                    className="block w-full pl-xl pr-sm py-sm font-body-md text-body-md text-on-surface bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors placeholder:text-tertiary-fixed-dim" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex justify-end mt-4 mb-2">
                  <span className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors focus:ring-2 focus:ring-primary focus:outline-none rounded cursor-pointer" onClick={navigatebackupemail}>Forgot Password?</span>
                </div>
              </div>
              
              {/* Submit Button */}
              <button className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-lg hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-container/20 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary-container flex items-center justify-center gap-xs" type="submit">
                Sign In
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
            
            {/* Divider */}
            <div className="mt-lg mb-lg relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-container-high"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-sm bg-surface-container-lowest font-caption text-caption text-tertiary">Secure Connection</span>
              </div>
            </div>
            
            {/* Create Account Link */}
            <div className="text-center">
              <p className="font-body-md text-body-md text-tertiary">
                Don&apos;t have an account? 
                <span className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors focus:ring-2 focus:ring-primary focus:outline-none rounded ml-xs cursor-pointer" onClick={navigateRegister}>Create an Account</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Minimal Footer Note */}
        <div className="w-full text-center py-6 hidden md:block">
          <p className="font-caption text-caption text-tertiary">© 2024 MedCore Health Systems. Clinical Clarity Certified.</p>
        </div>
      </section>
    </main>
  );
};

export default Login;
