import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function AgentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z][a-zA-Z0-9-]*(\.[a-zA-Z]{2,})+$/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorEmail("");
    setErrorPassword("");

    if (!validateEmail(email)) {
      setErrorEmail("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/agent/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Store JWT token and agent details (Note: localStorage not available in artifacts)
        console.log("Token:", data.token);
        console.log("Role: AGENT");
        console.log("Agent ID:", data.agentId);
        console.log("Agent Name:", data.name);
        localStorage.setItem("token", data.token);
        localStorage.setItem("agentId", data.agentId);
        localStorage.setItem("agentName", data.name);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", "agent");
        
         // REDIRECT
        navigate("/agent/dashboard");
      } else {
        const text = await response.text();
        let serverError = text;

        try {
          const parsed = JSON.parse(text);
          if (parsed?.email) setErrorEmail(parsed.email);
          if (parsed?.password) setErrorPassword(parsed.password);
          serverError = parsed?.message || parsed || text;
        } catch (err) {
          serverError = text || "Something went wrong. Please try again.";
        }

        if (!errorEmail && !errorPassword) {
          if (response.status === 401) setErrorPassword("Invalid password.");
          else if (response.status === 404) setErrorEmail("Agent not found.");
          else setErrorPassword(serverError);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorPassword("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #2d1b4e 0%, #6366f1 100%)",
        padding: "0",
        margin: "0",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          width: "95%",
          borderRadius: "20px",
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {/* Left Side - Branding & Content */}
          <div 
            style={{
              flex: "1 1 50%",
              background: "linear-gradient(135deg, #2d1b4e 0%, #6366f1 100%)",
              position: "relative",
              overflow: "hidden",
              minHeight: "600px",
              display: "flex",
            }}
          >
            <div style={{ padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "white", width: "100%" }}>
              {/* Header */}
              <div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <h4 style={{ fontWeight: "bold", margin: "0 0 0 1rem" }}>InsurAI Agents</h4>
                </div>

                <h2 style={{ fontWeight: "bold", marginBottom: "1rem", fontSize: "2.2rem", lineHeight: "1.2" }}>
                  Agent <br />
                  <span style={{ color: "#a78bfa" }}>Portal</span> Access
                </h2>
                <p style={{ marginBottom: "1.5rem", color: "rgba(255, 255, 255, 0.8)", fontSize: "1.1rem", lineHeight: "1.6" }}>
                  Access your dedicated agent dashboard to manage policies, clients, and commissions with AI-powered insights.
                </p>
              </div>

              {/* Features List */}
              <div style={{ marginBottom: "3rem" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(167, 139, 250, 0.2)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "1rem" }}>Client Management Tools</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(167, 139, 250, 0.2)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "1rem" }}>Commission Tracking</span>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(167, 139, 250, 0.2)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "1rem" }}>Policy Analytics</span>
                </div>
              </div>

              {/* Bottom Text */}
              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.2)", paddingTop: "20px" }}>
                <p style={{ margin: "0", color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem" }}>
                  Trusted by 5,000+ insurance agents nationwide
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div
              style={{
                position: "absolute",
                top: "10%",
                right: "10%",
                width: "100px",
                height: "100px",
                background: "radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "20%",
                left: "5%",
                width: "60px",
                height: "60px",
                background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />
          </div>

          {/* Right Side - Form */}
          <div style={{ flex: "1 1 50%", minWidth: "300px" }}>
            <div style={{ padding: "2.5rem" }}>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    background: "linear-gradient(135deg, #6366f1, #2d1b4e)",
                    borderRadius: "16px",
                    margin: "0 auto 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
                    color: "white",
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </div>
                <h3 style={{ fontWeight: "bold", color: "#2d1b4e", margin: "0 0 0.5rem 0" }}>Agent Login</h3>
                <p style={{ color: "#6c757d", margin: "0" }}>Access your agent dashboard</p>
              </div>

              {/* Login Form */}
              <div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontWeight: "600", color: "#2d1b4e", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="email"
                      id="agent-email"
                      name="username"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="agent@example.com"
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        border: `1px solid ${errorEmail ? "#dc3545" : "#e0e0e0"}`,
                        padding: "12px 16px 12px 44px",
                        fontSize: "0.95rem",
                        transition: "all 0.3s ease",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#6366f1";
                        e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errorEmail ? "#dc3545" : "#e0e0e0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "16px",
                        transform: "translateY(-50%)",
                        color: errorEmail ? "#dc3545" : "#6366f1",
                        opacity: 0.6,
                      }}
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  {errorEmail && (
                    <div style={{ display: "flex", alignItems: "center", marginTop: "0.5rem", color: "#dc3545", fontSize: "0.8rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "0.25rem" }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errorEmail}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontWeight: "600", color: "#2d1b4e", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="agent-password"
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        border: `1px solid ${errorPassword ? "#dc3545" : "#e0e0e0"}`,
                        padding: "12px 44px 12px 44px",
                        fontSize: "0.95rem",
                        transition: "all 0.3s ease",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#6366f1";
                        e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errorPassword ? "#dc3545" : "#e0e0e0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "16px",
                        transform: "translateY(-50%)",
                        color: errorPassword ? "#dc3545" : "#6366f1",
                        opacity: 0.6,
                      }}
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <button
                      type="button"
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "16px",
                        transform: "translateY(-50%)",
                        color: errorPassword ? "#dc3545" : "#6366f1",
                        background: "none",
                        border: "none",
                        opacity: 0.6,
                        cursor: "pointer",
                        padding: "0",
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        {showPassword ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </>
                        ) : (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                  {errorPassword && (
                    <div style={{ display: "flex", alignItems: "center", marginTop: "0.5rem", color: "#dc3545", fontSize: "0.8rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "0.25rem" }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errorPassword}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #6366f1, #2d1b4e)",
                    border: "none",
                    color: "white",
                    padding: "14px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.3)";
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ 
                        display: "inline-block",
                        width: "14px",
                        height: "14px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        marginRight: "8px"
                      }} />
                      Signing In...
                    </>
                  ) : (
                    "Access Agent Dashboard"
                  )}
                </button>
              </div>

              {/* Footer */}
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <p style={{ marginBottom: "0.5rem", color: "#6c757d", fontSize: "0.9rem" }}>
                  Need agent assistance?
                </p>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <a
                    href="#"
                    style={{
                      color: "#6366f1",
                      fontSize: "0.9rem",
                      textDecoration: "none",
                      fontWeight: "600",
                      transition: "color 0.3s ease",
                      marginRight: "0.75rem",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#2d1b4e";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#6366f1";
                    }}
                  >
                    Register New Agent
                  </a>
                  <span style={{ color: "#ccc" }}>|</span>
                  <button
                    style={{
                      color: "#6366f1",
                      fontSize: "0.9rem",
                      textDecoration: "none",
                      fontWeight: "600",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0",
                      marginLeft: "0.75rem",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#2d1b4e";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#6366f1";
                    }}
                  >
                    Contact Admin
                  </button>
                </div>
              </div>

              {/* Security Badge */}
              <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #e0e0e0" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ color: "#6366f1", marginRight: "0.5rem" }}
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <small style={{ color: "#666", fontSize: "0.8rem" }}>
                    Secure Agent Portal • Commission Protected
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}