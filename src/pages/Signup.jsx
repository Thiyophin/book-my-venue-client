import { useState } from "react";
import { signup } from "../services/authService";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .bmv-signup-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #0e0a07;
  }

  /* ── Right decorative panel (flipped from login) ── */
  .bmv-panel-deco {
    position: relative;
    width: 48%;
    overflow: hidden;
    display: none;
    order: 2;
  }
  @media (min-width: 900px) { .bmv-panel-deco { display: block; } }

  .bmv-panel-bg {
    position: absolute; inset: 0;
    background-image: url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80');
    background-size: cover;
    background-position: center;
    transform: scale(1.05);
    animation: slowZoom 22s ease-in-out infinite alternate;
  }
  @keyframes slowZoom {
    from { transform: scale(1.05); }
    to   { transform: scale(1.13); }
  }

  .bmv-panel-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      220deg,
      rgba(14,10,7,0.80) 0%,
      rgba(180,60,5,0.30) 55%,
      rgba(14,10,7,0.88) 100%
    );
  }

  .bmv-panel-content {
    position: relative; z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px 52px;
  }

  .bmv-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .bmv-brand-icon {
    width: 38px; height: 38px;
    background: #f97316;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }
  .bmv-brand-icon svg { width: 22px; height: 22px; fill: white; }
  .bmv-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.03em;
  }

  .bmv-panel-quote {
    margin-bottom: 60px;
  }
  .bmv-quote-mark {
    font-family: 'Cormorant Garamond', serif;
    font-size: 80px;
    line-height: 0.7;
    color: #f97316;
    margin-bottom: 20px;
  }
  .bmv-quote-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(26px, 2.8vw, 36px);
    font-weight: 300;
    font-style: italic;
    color: #fff;
    line-height: 1.5;
    max-width: 320px;
  }
  .bmv-quote-attr {
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    margin-top: 20px;
  }

  .bmv-panel-badges {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .bmv-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    backdrop-filter: blur(6px);
  }
  .bmv-badge-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #f97316;
    flex-shrink: 0;
  }
  .bmv-badge-text {
    font-size: 13px;
    font-weight: 300;
    color: rgba(255,255,255,0.75);
  }

  /* ── Left form panel ── */
  .bmv-panel-form {
    flex: 1;
    order: 1;
    background: #faf8f6;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 48px 32px;
    position: relative;
    overflow: hidden;
  }

  .bmv-panel-form::before {
    content: '';
    position: absolute;
    top: -80px; left: -80px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .bmv-form-box {
    width: 100%;
    max-width: 420px;
    position: relative; z-index: 1;
  }

  .bmv-mobile-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 40px;
  }
  @media (min-width: 900px) { .bmv-mobile-brand { display: none; } }

  .bmv-form-eyebrow {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #f97316;
    margin-bottom: 10px;
  }

  .bmv-form-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px;
    font-weight: 400;
    color: #1a1007;
    line-height: 1.15;
    margin-bottom: 8px;
  }

  .bmv-form-subtitle {
    font-size: 14px;
    color: #7c6f62;
    font-weight: 300;
    margin-bottom: 32px;
  }

  .bmv-field {
    margin-bottom: 16px;
    position: relative;
  }
  .bmv-field label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #5a4f45;
    margin-bottom: 7px;
  }
  .bmv-field input,
  .bmv-field select {
    width: 100%;
    background: #fff;
    border: 1.5px solid #e8e0d8;
    border-radius: 10px;
    padding: 13px 16px;
    font-size: 14.5px;
    font-family: 'DM Sans', sans-serif;
    color: #1a1007;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
    -webkit-appearance: none;
  }
  .bmv-field input::placeholder { color: #c0b8ae; }
  .bmv-field input:focus,
  .bmv-field select:focus {
    border-color: #f97316;
    box-shadow: 0 0 0 3.5px rgba(249,115,22,0.12);
  }

  .bmv-select-wrap {
    position: relative;
  }
  .bmv-select-wrap::after {
    content: '▾';
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    color: #a09690;
    pointer-events: none;
  }

  /* Role toggle pills */
  .bmv-role-toggle {
    display: flex;
    gap: 8px;
    margin-bottom: 22px;
  }
  .bmv-role-pill {
    flex: 1;
    padding: 11px 10px;
    border-radius: 9px;
    border: 1.5px solid #e8e0d8;
    background: #fff;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    color: #7c6f62;
    cursor: pointer;
    text-align: center;
    transition: all 0.18s;
  }
  .bmv-role-pill.active {
    background: #fff5ee;
    border-color: #f97316;
    color: #ea580c;
    font-weight: 500;
  }
  .bmv-role-pill:hover:not(.active) {
    border-color: #d0c8c0;
    color: #4a3f35;
  }

  .bmv-submit-btn {
    width: 100%;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 15px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 6px 24px rgba(249,115,22,0.35);
    margin-top: 4px;
    position: relative;
    overflow: hidden;
  }
  .bmv-submit-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    pointer-events: none;
  }
  .bmv-submit-btn:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 10px 32px rgba(249,115,22,0.4);
  }
  .bmv-submit-btn:active { transform: translateY(0); }

  .bmv-terms {
    text-align: center;
    font-size: 12px;
    color: #a09690;
    margin-top: 16px;
    line-height: 1.6;
  }
  .bmv-terms a { color: #f97316; text-decoration: none; }

  .bmv-divider {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 20px 0;
  }
  .bmv-divider-line { flex: 1; height: 1px; background: #e8e0d8; }
  .bmv-divider-text { font-size: 12px; color: #b0a89e; }

  .bmv-switch {
    text-align: center;
    font-size: 13.5px;
    color: #7c6f62;
    font-weight: 300;
  }
  .bmv-switch a {
    color: #f97316;
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .bmv-switch a:hover { opacity: 0.75; }

  .bmv-success {
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 8px;
    padding: 12px 14px;
    font-size: 13px;
    color: #166534;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .bmv-error {
    background: #fff2ee;
    border: 1px solid #fecba8;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    color: #c2440e;
    margin-bottom: 16px;
    animation: shake 0.35s ease;
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    25%      { transform: translateX(-6px); }
    75%      { transform: translateX(6px); }
  }

  .bmv-loading-dots span {
    display: inline-block;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #fff;
    margin: 0 2px;
    animation: dot-bounce 1.2s infinite;
  }
  .bmv-loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .bmv-loading-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dot-bounce {
    0%,80%,100% { transform: translateY(0); }
    40%          { transform: translateY(-6px); }
  }
`;

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const setRole = (role) =>
    setFormData({ ...formData, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await signup(formData);
      setSuccess(res.data.message || "Account created! Please log in.");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="bmv-signup-root">

        {/* ── Left form panel ── */}
        <div className="bmv-panel-form">
          <div className="bmv-form-box">

            {/* Mobile brand */}
            <div className="bmv-mobile-brand">
              <div className="bmv-brand-icon">
                <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V21H3V9.5z"/></svg>
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: '#1a1007' }}>
                Book My Venue
              </span>
            </div>

            <p className="bmv-form-eyebrow">Join the Platform</p>
            <h1 className="bmv-form-title">Create your<br />account</h1>
            <p className="bmv-form-subtitle">Book or list venues in minutes</p>

            {error && <div className="bmv-error">{error}</div>}
            {success && (
              <div className="bmv-success">
                <span>✓</span> {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="bmv-field">
                <label>I am a</label>
                <div className="bmv-role-toggle">
                  <button
                    type="button"
                    className={`bmv-role-pill ${formData.role === "user" ? "active" : ""}`}
                    onClick={() => setRole("user")}
                  >
                    🎉 Guest / Planner
                  </button>
                  <button
                    type="button"
                    className={`bmv-role-pill ${formData.role === "owner" ? "active" : ""}`}
                    onClick={() => setRole("owner")}
                  >
                    🏛️ Venue Owner
                  </button>
                </div>
              </div>

              <div className="bmv-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Your full name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="bmv-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="bmv-field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Min. 8 characters"
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="bmv-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="bmv-loading-dots">
                    <span /><span /><span />
                  </span>
                ) : "Create Account →"}
              </button>
            </form>

            <p className="bmv-terms">
              By signing up, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>
            </p>

            <div className="bmv-divider">
              <div className="bmv-divider-line" />
              <span className="bmv-divider-text">or</span>
              <div className="bmv-divider-line" />
            </div>

            <p className="bmv-switch">
              Already have an account?{" "}
              <a href="/login">Sign in</a>
            </p>
          </div>
        </div>

        {/* ── Right decorative panel ── */}
        <div className="bmv-panel-deco">
          <div className="bmv-panel-bg" />
          <div className="bmv-panel-overlay" />
          <div className="bmv-panel-content">
            <div className="bmv-brand">
              <div className="bmv-brand-icon">
                <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V21H3V9.5z"/></svg>
              </div>
              <span className="bmv-brand-name">Book My Venue</span>
            </div>
            <div className="bmv-panel-quote">
              <div className="bmv-quote-mark">"</div>
              <p className="bmv-quote-text">
                Every great event begins with finding the right space
              </p>
              <p className="bmv-quote-attr">— The Book My Venue Promise</p>
            </div>
            <div className="bmv-panel-badges">
              <div className="bmv-badge">
                <div className="bmv-badge-dot" />
                <span className="bmv-badge-text">Instant booking confirmation</span>
              </div>
              <div className="bmv-badge">
                <div className="bmv-badge-dot" />
                <span className="bmv-badge-text">Verified venues across Kerala</span>
              </div>
              <div className="bmv-badge">
                <div className="bmv-badge-dot" />
                <span className="bmv-badge-text">Secure payments & refund policy</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
