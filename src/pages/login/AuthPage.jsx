import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../config/axios";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

// ─── EyeBall ───────────────────────────────────────────────────────────────
const EyeBall = ({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  forceLookX,
  forceLookY,
}) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  const pos = () => {
    if (!ref.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined)
      return { x: forceLookX, y: forceLookY };
    const r = ref.current.getBoundingClientRect();
    const dx = mouse.x - (r.left + r.width / 2),
      dy = mouse.y - (r.top + r.height / 2);
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };
  const p = pos();
  return (
    <div
      ref={ref}
      style={{
        width: size,
        height: isBlinking ? 2 : size,
        backgroundColor: eyeColor,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: "height 0.1s ease-out, width 0.1s ease-out",
        flexShrink: 0,
      }}
    >
      {!isBlinking && (
        <div
          style={{
            width: pupilSize,
            height: pupilSize,
            backgroundColor: pupilColor,
            borderRadius: "50%",
            transform: `translate(${p.x}px, ${p.y}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      )}
    </div>
  );
};

// ─── Pupil only ─────────────────────────────────────────────────────────────
const Pupil = ({
  size = 12,
  maxDistance = 5,
  pupilColor = "#2D2D2D",
  forceLookX,
  forceLookY,
}) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  const pos = () => {
    if (!ref.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined)
      return { x: forceLookX, y: forceLookY };
    const r = ref.current.getBoundingClientRect();
    const dx = mouse.x - (r.left + r.width / 2),
      dy = mouse.y - (r.top + r.height / 2);
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };
  const p = pos();
  return (
    <div
      ref={ref}
      style={{
        width: size,
        height: size,
        backgroundColor: pupilColor,
        borderRadius: "50%",
        transform: `translate(${p.x}px, ${p.y}px)`,
        transition: "transform 0.1s ease-out",
        flexShrink: 0,
      }}
    />
  );
};

// ─── Cartoon Scene ──────────────────────────────────────────────────────────
const CartoonScene = ({ isTyping, password, showPassword }) => {
  const [purpleBlink, setPurpleBlink] = useState(false);
  const [blackBlink, setBlackBlink] = useState(false);
  const [lookingAtEachOther, setLookingAtEachOther] = useState(false);
  const [purplePeeking, setPurplePeeking] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const purpleRef = useRef(null),
    blackRef = useRef(null),
    yellowRef = useRef(null),
    orangeRef = useRef(null);

  useEffect(() => {
    const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  useEffect(() => {
    const s = () => {
      const t = setTimeout(
        () => {
          setPurpleBlink(true);
          setTimeout(() => {
            setPurpleBlink(false);
            s();
          }, 150);
        },
        Math.random() * 4000 + 3000,
      );
      return t;
    };
    const t = s();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const s = () => {
      const t = setTimeout(
        () => {
          setBlackBlink(true);
          setTimeout(() => {
            setBlackBlink(false);
            s();
          }, 150);
        },
        Math.random() * 4000 + 3000,
      );
      return t;
    };
    const t = s();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isTyping) {
      setLookingAtEachOther(true);
      const t = setTimeout(() => setLookingAtEachOther(false), 800);
      return () => clearTimeout(t);
    } else setLookingAtEachOther(false);
  }, [isTyping]);

  useEffect(() => {
    if (password.length > 0 && showPassword) {
      const t = setTimeout(
        () => {
          setPurplePeeking(true);
          setTimeout(() => setPurplePeeking(false), 800);
        },
        Math.random() * 3000 + 2000,
      );
      return () => clearTimeout(t);
    } else setPurplePeeking(false);
  }, [password, showPassword, purplePeeking]);

  const calcPos = (ref) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2,
      cy = r.top + r.height / 3;
    const dx = mouse.x - cx,
      dy = mouse.y - cy;
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    };
  };

  const pp = calcPos(purpleRef),
    bp = calcPos(blackRef),
    yp = calcPos(yellowRef),
    op = calcPos(orangeRef);
  const hiding = isTyping || (password.length > 0 && !showPassword);
  const visible = password.length > 0 && showPassword;

  return (
    <div
      style={{ position: "relative", width: 460, height: 340, flexShrink: 0 }}
    >
      {/* Purple — back */}
      <div
        ref={purpleRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 50,
          width: 150,
          height: hiding ? 370 : 330,
          backgroundColor: "#6C3FF5",
          borderRadius: "10px 10px 0 0",
          zIndex: 1,
          transition: "all 0.7s ease-in-out",
          transform: visible
            ? "skewX(0deg)"
            : hiding
              ? `skewX(${(pp.bodySkew || 0) - 12}deg) translateX(35px)`
              : `skewX(${pp.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            gap: 26,
            transition: "all 0.7s ease-in-out",
            left: visible ? 16 : lookingAtEachOther ? 46 : 36 + pp.faceX,
            top: visible ? 28 : lookingAtEachOther ? 52 : 32 + pp.faceY,
          }}
        >
          <EyeBall
            size={16}
            pupilSize={6}
            maxDistance={4}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={purpleBlink}
            forceLookX={
              visible
                ? purplePeeking
                  ? 4
                  : -4
                : lookingAtEachOther
                  ? 3
                  : undefined
            }
            forceLookY={
              visible
                ? purplePeeking
                  ? 5
                  : -4
                : lookingAtEachOther
                  ? 4
                  : undefined
            }
          />
          <EyeBall
            size={16}
            pupilSize={6}
            maxDistance={4}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={purpleBlink}
            forceLookX={
              visible
                ? purplePeeking
                  ? 4
                  : -4
                : lookingAtEachOther
                  ? 3
                  : undefined
            }
            forceLookY={
              visible
                ? purplePeeking
                  ? 5
                  : -4
                : lookingAtEachOther
                  ? 4
                  : undefined
            }
          />
        </div>
      </div>

      {/* Black — middle */}
      <div
        ref={blackRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 195,
          width: 100,
          height: 255,
          backgroundColor: "#2D2D2D",
          borderRadius: "8px 8px 0 0",
          zIndex: 2,
          transition: "all 0.7s ease-in-out",
          transform: visible
            ? "skewX(0deg)"
            : lookingAtEachOther
              ? `skewX(${(bp.bodySkew || 0) * 1.5 + 10}deg) translateX(18px)`
              : hiding
                ? `skewX(${(bp.bodySkew || 0) * 1.5}deg)`
                : `skewX(${bp.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            gap: 20,
            transition: "all 0.7s ease-in-out",
            left: visible ? 8 : lookingAtEachOther ? 26 : 20 + bp.faceX,
            top: visible ? 22 : lookingAtEachOther ? 10 : 26 + bp.faceY,
          }}
        >
          <EyeBall
            size={14}
            pupilSize={5}
            maxDistance={3}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={blackBlink}
            forceLookX={visible ? -4 : lookingAtEachOther ? 0 : undefined}
            forceLookY={visible ? -4 : lookingAtEachOther ? -4 : undefined}
          />
          <EyeBall
            size={14}
            pupilSize={5}
            maxDistance={3}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={blackBlink}
            forceLookX={visible ? -4 : lookingAtEachOther ? 0 : undefined}
            forceLookY={visible ? -4 : lookingAtEachOther ? -4 : undefined}
          />
        </div>
      </div>

      {/* Orange semi-circle — front left */}
      <div
        ref={orangeRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 200,
          height: 165,
          backgroundColor: "#FF9B6B",
          borderRadius: "100px 100px 0 0",
          zIndex: 3,
          transition: "all 0.7s ease-in-out",
          transform: visible ? "skewX(0deg)" : `skewX(${op.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            gap: 28,
            transition: "all 0.2s ease-out",
            left: visible ? 42 : 68 + (op.faceX || 0),
            top: visible ? 70 : 75 + (op.faceY || 0),
          }}
        >
          <Pupil
            size={11}
            maxDistance={4}
            pupilColor="#2D2D2D"
            forceLookX={visible ? -5 : undefined}
            forceLookY={visible ? -4 : undefined}
          />
          <Pupil
            size={11}
            maxDistance={4}
            pupilColor="#2D2D2D"
            forceLookX={visible ? -5 : undefined}
            forceLookY={visible ? -4 : undefined}
          />
        </div>
      </div>

      {/* Yellow rounded — front right */}
      <div
        ref={yellowRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 260,
          width: 120,
          height: 190,
          backgroundColor: "#E8D754",
          borderRadius: "60px 60px 0 0",
          zIndex: 4,
          transition: "all 0.7s ease-in-out",
          transform: visible ? "skewX(0deg)" : `skewX(${yp.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            gap: 20,
            transition: "all 0.2s ease-out",
            left: visible ? 16 : 42 + (yp.faceX || 0),
            top: visible ? 28 : 32 + (yp.faceY || 0),
          }}
        >
          <Pupil
            size={11}
            maxDistance={4}
            pupilColor="#2D2D2D"
            forceLookX={visible ? -5 : undefined}
            forceLookY={visible ? -4 : undefined}
          />
          <Pupil
            size={11}
            maxDistance={4}
            pupilColor="#2D2D2D"
            forceLookX={visible ? -5 : undefined}
            forceLookY={visible ? -4 : undefined}
          />
        </div>
        <div
          style={{
            position: "absolute",
            width: 66,
            height: 3,
            backgroundColor: "#2D2D2D",
            borderRadius: 2,
            transition: "all 0.2s ease-out",
            left: visible ? 8 : 32 + (yp.faceX || 0),
            top: visible ? 72 : 72 + (yp.faceY || 0),
          }}
        />
      </div>
    </div>
  );
};

// ─── Main Login Page ─────────────────────────────────────────────────────────
export default function AuthPage({ initialMode = "login" }) {
  const { setUser, navigate } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  // mode: "login" | "register"
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setMode(initialMode);
    setError("");
    setPassword("");
    setConfirmPassword("");
  }, [initialMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const payload =
        mode === "login" ? { email, password } : { name, email, password };

      const endpoint =
        mode === "login" ? "/api/user/login" : "/api/user/register";

      const { data } = await axiosInstance.post(endpoint, payload);

      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        toast.success(
          mode === "login"
            ? "Logged in successfully"
            : "Account created successfully",
        );
        navigate("/chat");
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    height: 48,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: 14,
    padding: "0 16px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ── LEFT PANEL (light gray) ── */}
      <div
        style={{
          width: "50%",
          minHeight: "100vh",
          background: "linear-gradient(160deg, #e8e8e8 0%, #d0d0d0 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={assets.custom_logo}
              alt="Logo"
              className="w-6 h-6 object-contain"
            />
          </div>
          <span style={{ fontWeight: 600, fontSize: 17, color: "#222" }}>
            Boxto.ai
          </span>
        </div>

        {/* Characters */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            flex: 1,
            paddingBottom: 16,
          }}
        >
          <CartoonScene
            isTyping={isTyping}
            password={password}
            showPassword={showPassword}
          />
        </div>

        {/* Footer links */}
        <div style={{ display: "flex", gap: 28, fontSize: 13, color: "#555" }}>
          {["Privacy Policy", "Terms of Service", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              style={{ color: "#555", textDecoration: "none" }}
              onMouseEnter={(e) => (e.target.style.color = "#111")}
              onMouseLeave={(e) => (e.target.style.color = "#555")}
            >
              {l}
            </a>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL (dark) ── */}
      <div
        style={{
          width: "50%",
          minHeight: "100vh",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 32px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h1
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 8px",
                letterSpacing: "-0.02em",
              }}
            >
              {mode === "login" ? "Welcome back!" : "Create account"}
            </h1>
            <p style={{ fontSize: 14, color: "#666", margin: 0 }}>
              {mode === "login"
                ? "Please enter your details"
                : "Sign up to get started"}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            {mode === "register" && (
              <div>
                <label
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#ccc",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Alex Carter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.3)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.12)")
                  }
                />
              </div>
            )}

            <div>
              <label
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#ccc",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="anna@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => {
                  setIsTyping(true);
                  e.target.style.borderColor = "rgba(255,255,255,0.3)";
                }}
                onBlur={(e) => {
                  setIsTyping(false);
                  e.target.style.borderColor = "rgba(255,255,255,0.12)";
                }}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#ccc",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.3)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.12)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#666",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#ccc",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.3)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.12)")
                  }
                />
              </div>
            )}

            {mode === "login" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 14,
                    color: "#999",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      width: 16,
                      height: 16,
                      accentColor: "#fff",
                      cursor: "pointer",
                    }}
                  />
                  Remember for 30 days
                </label>
                <button
                  type="button"
                  onClick={() => alert("Coming soon")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#fff",
                  }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {error && (
              <p
                style={{
                  fontSize: 13,
                  color: "#f87171",
                  margin: 0,
                  padding: "8px 12px",
                  background: "rgba(248,113,113,0.1)",
                  borderRadius: 8,
                }}
              >
                {error}
              </p>
            )}

            {/* Primary button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                height: 50,
                width: "100%",
                borderRadius: 8,
                border: "none",
                background: "#f0f0f0",
                color: "#111",
                fontSize: 15,
                fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background 0.2s",
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.target.style.background = "#fff";
              }}
              onMouseLeave={(e) => (e.target.style.background = "#f0f0f0")}
            >
              {isLoading ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid #aaa",
                      borderTop: "2px solid #333",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                      display: "inline-block",
                    }}
                  />{" "}
                  Signing in...
                </>
              ) : mode === "login" ? (
                "Log in"
              ) : (
                "Create account"
              )}
            </button>

            {/* Google button */}
            <button
              type="button"
              onClick={() => alert("Wire up @react-oauth/google here")}
              style={{
                height: 50,
                width: "100%",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
              }
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.8 6.1C12.4 13.2 17.7 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.4 28.6A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.1.8-4.6L2.5 13.3A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.8-6.1z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.3 0-11.6-4.2-13.5-9.9l-7.8 6.1C6.6 42.6 14.6 48 24 48z"
                />
              </svg>
              Log in with Google
            </button>
          </form>

          {/* Switch mode */}
          <p
            style={{
              textAlign: "center",
              fontSize: 14,
              color: "#666",
              marginTop: 28,
            }}
          >
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
                setPassword("");
                setConfirmPassword("");
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {mode === "login" ? "Sign Up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
