import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

const venueImages = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
];

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .bmv-login-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #0e0a07;
  }

  /* ── Left panel ── */
  .bmv-panel-left {
    position: relative;
    width: 52%;
    overflow: hidden;
    display: none;
  }
  @media (min-width: 900px) { .bmv-panel-left { display: block; } }

  .bmv-panel-bg {
    position: absolute; inset: 0;
    background-image: url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80');
    background-size: cover;
    background-position: center;
    transform: scale(1.05);
    animation: slowZoom 20s ease-in-out infinite alternate;
  }
  @keyframes slowZoom {
    from { transform: scale(1.05); }
    to   { transform: scale(1.12); }
  }

  .bmv-panel-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      135deg,
      rgba(14,10,7,0.72) 0%,
      rgba(200,80,10,0.35) 60%,
      rgba(14,10,7,0.85) 100%
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

  .bmv-panel-hero {
    margin-bottom: 52px;
  }
  .bmv-hero-eyebrow {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #f97316;
    margin-bottom: 18px;
  }
  .bmv-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(38px, 4vw, 58px);
    font-weight: 300;
    line-height: 1.15;
    color: #fff;
    margin-bottom: 22px;
  }
  .bmv-hero-title em { font-style: italic; color: #fdba74; }
  .bmv-hero-desc {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.75;
    color: rgba(255,255,255,0.65);
    max-width: 340px;
  }

  .bmv-panel-stats {
    display: flex;
    gap: 36px;
    padding-top: 28px;
    border-top: 1px solid rgba(255,255,255,0.12);
  }
  .bmv-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 400;
    color: #fff;
    line-height: 1;
  }
  .bmv-stat-label {
    font-size: 11px;
    font-weight: 400;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.06em;
    margin-top: 4px;
  }

  /* ── Right panel (form) ── */
  .bmv-panel-right {
    flex: 1;
    background: #faf8f6;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 48px 32px;
    position: relative;
    overflow: hidden;
  }

  .bmv-panel-right::before {
    content: '';
    position: absolute;
    top: -120px; right: -120px;
    width: 360px; height: 360px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .bmv-panel-right::after {
    content: '';
    position: absolute;
    bottom: -100px; left: -80px;
    width: 280px; height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .bmv-form-box {
    width: 100%;
    max-width: 400px;
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
    margin-bottom: 36px;
  }

  .bmv-field {
    margin-bottom: 18px;
    position: relative;
  }
  .bmv-field label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #5a4f45;
    margin-bottom: 8px;
  }
  .bmv-field input {
    width: 100%;
    background: #fff;
    border: 1.5px solid #e8e0d8;
    border-radius: 10px;
    padding: 14px 16px;
    font-size: 14.5px;
    font-family: 'DM Sans', sans-serif;
    color: #1a1007;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .bmv-field input::placeholder { color: #c0b8ae; }
  .bmv-field input:focus {
    border-color: #f97316;
    box-shadow: 0 0 0 3.5px rgba(249,115,22,0.12);
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
    margin-top: 8px;
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

  .bmv-divider {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 24px 0;
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

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="bmv-login-root">

        {/* ── Left decorative panel ── */}
        <div className="bmv-panel-left">
          <div className="bmv-panel-bg" />
          <div className="bmv-panel-overlay" />
          <div className="bmv-panel-content">
            <div className="bmv-brand">
              <div className="bmv-brand-icon">
                <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V21H3V9.5z"/></svg>
              </div>
              <span className="bmv-brand-name">Book My Venue</span>
            </div>
            <div className="bmv-panel-hero">
              <p className="bmv-hero-eyebrow">Premium Venue Booking</p>
              <h2 className="bmv-hero-title">
                Find the <em>perfect</em><br />space for every<br />occasion
              </h2>
              <p className="bmv-hero-desc">
                From intimate gatherings to grand celebrations — discover and book extraordinary venues tailored to your vision.
              </p>
              <div className="bmv-panel-stats" style={{ marginTop: 36 }}>
                <div>
                  <div className="bmv-stat-value">2,400+</div>
                  <div className="bmv-stat-label">Venues Listed</div>
                </div>
                <div>
                  <div className="bmv-stat-value">98%</div>
                  <div className="bmv-stat-label">Satisfaction</div>
                </div>
                <div>
                  <div className="bmv-stat-value">50K+</div>
                  <div className="bmv-stat-label">Events Hosted</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="bmv-panel-right">
          <div className="bmv-form-box">

            {/* Mobile brand */}
            <div className="bmv-mobile-brand">
              <div className="bmv-brand-icon">
                <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V21H3V9.5z"/></svg>
              </div>
              <span className="bmv-brand-name" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#1a1007' }}>Book My Venue</span>
            </div>

            <p className="bmv-form-eyebrow">Welcome Back</p>
            <h1 className="bmv-form-title">Sign in to<br />your account</h1>
            <p className="bmv-form-subtitle">Enter your credentials to continue</p>

            {error && <div className="bmv-error">{error}</div>}

            <form onSubmit={handleSubmit}>
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
                  placeholder="Your password"
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ textAlign: 'right', marginBottom: 20, marginTop: -6 }}>
                <a href="#" style={{ fontSize: 13, color: '#f97316', textDecoration: 'none', fontWeight: 400 }}>
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="bmv-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="bmv-loading-dots">
                    <span /><span /><span />
                  </span>
                ) : "Continue →"}
              </button>
            </form>

            <div className="bmv-divider">
              <div className="bmv-divider-line" />
              <span className="bmv-divider-text">or</span>
              <div className="bmv-divider-line" />
            </div>

            <p className="bmv-switch">
              New to Book My Venue?{" "}
              <a href="/">Create an account</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
