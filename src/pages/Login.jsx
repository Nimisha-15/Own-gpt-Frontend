import { useState, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ThreeDBackground from "../components/ui/ThreeDBackground";
import { GoogleLogin } from "@react-oauth/google";

/* ─────────────────────────────────────────────────────────────────
   InputField extracted OUTSIDE Login so it is never re-created
   on parent re-renders — this stops the animation re-triggering
───────────────────────────────────────────────────────────────── */
const InputField = ({
  label,
  field,
  type = "text",
  placeholder,
  delay = 0,
  value,
  error,
  onChange,
  showPassword,
  onTogglePassword,
}) => (
  <div
    className="mb-4"
    style={{ animation: `fadeInUp 0.6s ease-out ${delay}s both` }}
  >
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        type={
          field === "password" ? (showPassword ? "text" : "password") : type
        }
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl text-white
          placeholder-gray-500 outline-none transition duration-300
          ${
            error
              ? "border-red-500/50 focus:border-red-400 focus:shadow-lg focus:shadow-red-500/20"
              : "border-white/10 focus:border-indigo-400/50 focus:shadow-lg focus:shadow-indigo-500/20"
          }`}
      />
      {field === "password" && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute inset-y-0 right-0 pr-4 flex items-center
            text-gray-400 hover:text-gray-200 text-xs font-medium transition-colors"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      )}
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-400 animate-shake">{error}</p>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   Login Page
───────────────────────────────────────────────────────────────── */
const Login = () => {
  const [mode, setMode] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: localStorage.getItem("remembered_email") || "",
    password: "",
  });

  const navigate = useNavigate();
  const { axios, setUser } = useAppContext();

  /* ── Validation ── */
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePassword = (v) => v.length >= 6;
  const validateName = (v) => v.trim().length >= 2;

  const validateForm = useCallback(() => {
    const errs = {};

    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!validateEmail(formData.email)) errs.email = "Enter a valid email";

    if (!formData.password.trim()) errs.password = "Password is required";
    else if (!validatePassword(formData.password))
      errs.password = "Min 6 characters";

    if (mode === "register") {
      if (!formData.name.trim()) errs.name = "Name is required";
      else if (!validateName(formData.name)) errs.name = "Min 2 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData, mode]);

  /* ── Input change handler ── */
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // clear field error on type
  }, []);

  // Google OAuth Handler

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post("/api/user/google-login", {
        credential: credentialResponse.credential,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        toast.success("Logged in successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
    }
  };

  /* ── Submit ── */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isLoading || !validateForm()) {
        if (!validateForm()) toast.error("Please fix the errors in the form");
        return;
      }

      setIsLoading(true);

      const url = mode === "login" ? "/api/user/login" : "/api/user/register";
      const payload =
        mode === "login"
          ? { email: formData.email.trim(), password: formData.password }
          : {
              name: formData.name.trim(),
              email: formData.email.trim(),
              password: formData.password,
            };

      try {
        const { data } = await axios.post(url, payload);

        if (data?.success) {
          localStorage.setItem("token", data.token);
          rememberMe
            ? localStorage.setItem("remembered_email", formData.email)
            : localStorage.removeItem("remembered_email");

          setUser(data.user);
          toast.success(data.message || "Welcome! 🎉");
          navigate("/");
        } else {
          toast.error(data?.message || "Authentication failed");
          setIsLoading(false);
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || err.message || "Server error",
        );
        setIsLoading(false);
      }
    },
    [
      isLoading,
      mode,
      formData,
      rememberMe,
      axios,
      setUser,
      navigate,
      validateForm,
    ],
  );

  /* ── Switch auth mode ── */
  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setErrors({});
    setShowPassword(false);
  };

  /* ── Shared InputField props ── */
  const fieldProps = {
    value: (field) => formData[field],
    error: (field) => errors[field],
    onChange: handleInputChange,
    showPassword,
    onTogglePassword: () => setShowPassword((v) => !v),
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black flex overflow-hidden">
      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(30px,-50px) scale(1.1); }
          66%       { transform: translate(-20px,20px) scale(0.9); }
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes gradientShift {
          0%,100% { background-position:0% 50%; }
          50%     { background-position:100% 50%; }
        }
        @keyframes shake {
          0%,100% { transform:translateX(0); }
          25%     { transform:translateX(-4px); }
          75%     { transform:translateX(4px); }
        }
        .animate-blob   { animation: blob 7s infinite; }
        .animate-shake  { animation: shake 0.3s ease-in-out; }
      `}</style>

      {/* ── Blob background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-indigo-600 opacity-20 rounded-full blur-3xl animate-blob" />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-purple-600 opacity-20 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-600 opacity-10 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* ── Right – Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md relative"
          style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}
        >
          {/* Glassmorphic card */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10" />

          <div className="relative p-8 md:p-10">
            {/* Gradient top bar */}
            <div
              className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full blur-sm"
              style={{ animation: "gradientShift 3s ease infinite" }}
            />

            {/* Header */}
            <div
              className="text-center mb-8"
              style={{ animation: "slideDown 0.5s ease-out" }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-gray-200 bg-clip-text text-transparent mb-3">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {mode === "login"
                  ? "Sign in to access your AI chat"
                  : "Join our community to start chatting"}
              </p>
            </div>

            {/* ── Fields ── */}
            {mode === "register" && (
              <InputField
                label="Full Name"
                field="name"
                placeholder="John Doe"
                delay={0.2}
                value={formData.name}
                error={errors.name}
                onChange={handleInputChange}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((v) => !v)}
              />
            )}

            <InputField
              label="Email Address"
              field="email"
              type="email"
              placeholder="you@example.com"
              delay={mode === "register" ? 0.3 : 0.2}
              value={formData.email}
              error={errors.email}
              onChange={handleInputChange}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((v) => !v)}
            />

            <InputField
              label="Password"
              field="password"
              type="password"
              placeholder="Enter your password"
              delay={mode === "register" ? 0.4 : 0.3}
              value={formData.password}
              error={errors.password}
              onChange={handleInputChange}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((v) => !v)}
            />

            {/* Remember me & Forgot */}
            {mode === "login" && (
              <div
                className="flex items-center justify-between mb-6"
                style={{ animation: "fadeInUp 0.6s ease-out 0.5s both" }}
              >
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-white/5 border border-white/20 rounded accent-indigo-500 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => toast.info("Password reset coming soon!")}
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{ animation: "fadeInUp 0.6s ease-out 0.6s both" }}
              className={`w-full py-3 rounded-xl font-semibold text-white transition duration-300
                flex items-center justify-center gap-2 mb-6
                ${
                  isLoading
                    ? "bg-gray-700/50 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/50 hover:scale-105 active:scale-95"
                }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
              )}
            </button>

            {/* Divider */}
            <div
              className="flex items-center gap-4 mb-6"
              style={{ animation: "fadeInUp 0.6s ease-out 0.7s both" }}
            >
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-xs font-medium">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social buttons */}
            <div
              className="mb-8 flex flex-col gap-4 items-center"
              style={{ animation: "fadeInUp 0.6s ease-out 0.8s both" }}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Login Failed")}
                theme="filled_black"
                shape="pill"
                size="large"
                width="320"
              />

              <button
                type="button"
                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white"
                onClick={() => toast("GitHub login coming soon")}
              >
                Continue with GitHub
              </button>
            </div>

            {/* Toggle mode */}
            <div
              className="text-center pt-6 border-t border-white/10"
              style={{ animation: "fadeInUp 0.6s ease-out 0.9s both" }}
            >
              <p className="text-gray-400 text-sm">
                {mode === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  type="button"
                  onClick={switchMode}
                  className="ml-2 text-indigo-400 hover:text-indigo-300 font-semibold
                    transition-colors duration-300 hover:underline"
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
