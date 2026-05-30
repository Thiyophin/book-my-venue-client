import { useEffect, useState } from "react";
import { getVenues } from "../services/venueService";
import { useNavigate } from "react-router-dom";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .bmv-home {
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background: #faf8f6;
    color: #1a1007;
  }

  /* ── Navbar ── */
  .bmv-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px;
    height: 68px;
    background: rgba(250,248,246,0.88);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    transition: background 0.3s;
  }
  .bmv-nav-brand {
    display: flex; align-items: center; gap: 10px; text-decoration: none;
  }
  .bmv-nav-icon {
    width: 34px; height: 34px; background: #f97316; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
  }
  .bmv-nav-icon svg { width: 19px; height: 19px; fill: white; }
  .bmv-nav-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 19px; font-weight: 600; color: #1a1007; letter-spacing: .03em;
  }
  .bmv-nav-links {
    display: flex; align-items: center; gap: 32px;
    list-style: none;
  }
  .bmv-nav-links a {
    font-size: 13.5px; font-weight: 400; color: #5a4f45;
    text-decoration: none; transition: color .18s;
  }
  .bmv-nav-links a:hover { color: #f97316; }
  .bmv-nav-actions { display: flex; align-items: center; gap: 12px; }
  .bmv-btn-ghost {
    padding: 8px 20px; border-radius: 8px;
    border: 1.5px solid #e8e0d8; background: transparent;
    font-size: 13px; font-weight: 400; color: #5a4f45;
    cursor: pointer; text-decoration: none; font-family: 'DM Sans', sans-serif;
    transition: border-color .18s, color .18s;
  }
  .bmv-btn-ghost:hover { border-color: #f97316; color: #f97316; }
  .bmv-btn-orange {
    padding: 8px 22px; border-radius: 8px;
    background: linear-gradient(135deg, #f97316, #ea580c);
    border: none; font-size: 13px; font-weight: 500; color: #fff;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 14px rgba(249,115,22,.3);
    text-decoration: none;
    transition: opacity .18s, transform .15s;
  }
  .bmv-btn-orange:hover { opacity: .9; transform: translateY(-1px); }

  /* ── Hero ── */
  .bmv-hero {
    position: relative;
    min-height: 92vh;
    display: flex; align-items: center;
    overflow: hidden;
    padding-top: 68px;
  }
  .bmv-hero-bg {
    position: absolute; inset: 0;
    background-image: url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=85');
    background-size: cover; background-position: center;
    transform: scale(1.04);
    animation: heroZoom 24s ease-in-out infinite alternate;
  }
  @keyframes heroZoom {
    from { transform: scale(1.04); }
    to   { transform: scale(1.10); }
  }
  .bmv-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      110deg,
      rgba(14,10,7,.82) 0%,
      rgba(14,10,7,.55) 50%,
      rgba(200,80,10,.18) 100%
    );
  }
  .bmv-hero-inner {
    position: relative; z-index: 2;
    max-width: 1200px; margin: 0 auto; padding: 0 48px;
    width: 100%;
  }
  .bmv-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 11px; font-weight: 500; letter-spacing: .22em;
    text-transform: uppercase; color: #f97316;
    margin-bottom: 22px;
    animation: fadeUp .8s ease both;
  }
  .bmv-hero-eyebrow-line {
    width: 32px; height: 1px; background: #f97316;
  }
  .bmv-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(50px, 6vw, 84px);
    font-weight: 300;
    line-height: 1.1;
    color: #fff;
    margin-bottom: 24px;
    animation: fadeUp .8s .1s ease both;
  }
  .bmv-hero-title em { font-style: italic; color: #fdba74; }
  .bmv-hero-subtitle {
    font-size: 16px; font-weight: 300; color: rgba(255,255,255,.7);
    line-height: 1.8; max-width: 480px; margin-bottom: 44px;
    animation: fadeUp .8s .2s ease both;
  }

  /* Search bar */
  .bmv-search-bar {
    display: flex; align-items: center;
    background: #fff;
    border-radius: 14px;
    padding: 6px 6px 6px 22px;
    max-width: 600px;
    box-shadow: 0 16px 48px rgba(0,0,0,.22);
    gap: 12px;
    animation: fadeUp .8s .3s ease both;
  }
  .bmv-search-bar input {
    flex: 1; border: none; outline: none;
    font-size: 14.5px; font-family: 'DM Sans', sans-serif;
    color: #1a1007; background: transparent;
  }
  .bmv-search-bar input::placeholder { color: #b0a89e; }
  .bmv-search-btn {
    padding: 12px 26px; border-radius: 10px;
    background: linear-gradient(135deg, #f97316, #ea580c);
    border: none; color: #fff; font-size: 14px; font-weight: 500;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
    box-shadow: 0 4px 16px rgba(249,115,22,.35);
    transition: opacity .18s, transform .15s;
  }
  .bmv-search-btn:hover { opacity: .9; transform: translateY(-1px); }

  .bmv-hero-tags {
    display: flex; gap: 10px; flex-wrap: wrap;
    margin-top: 20px;
    animation: fadeUp .8s .4s ease both;
  }
  .bmv-tag {
    padding: 6px 16px; border-radius: 999px;
    border: 1px solid rgba(255,255,255,.2);
    background: rgba(255,255,255,.08);
    font-size: 12.5px; color: rgba(255,255,255,.75);
    cursor: pointer; transition: all .18s; backdrop-filter: blur(4px);
  }
  .bmv-tag:hover { background: rgba(249,115,22,.25); border-color: #f97316; color: #fff; }

  /* hero stats strip */
  .bmv-hero-stats {
    position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
    background: rgba(14,10,7,.65); backdrop-filter: blur(12px);
    border-top: 1px solid rgba(255,255,255,.08);
  }
  .bmv-hero-stats-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 48px;
    display: flex; gap: 0;
  }
  .bmv-hstat {
    flex: 1; padding: 22px 0;
    border-right: 1px solid rgba(255,255,255,.08);
    padding-left: 32px;
  }
  .bmv-hstat:first-child { padding-left: 0; }
  .bmv-hstat:last-child { border-right: none; }
  .bmv-hstat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 400; color: #fff; line-height: 1;
  }
  .bmv-hstat-lbl {
    font-size: 11px; font-weight: 300; color: rgba(255,255,255,.5);
    letter-spacing: .06em; margin-top: 4px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Section wrapper ── */
  .bmv-section {
    max-width: 1200px; margin: 0 auto; padding: 80px 48px;
  }
  .bmv-section-head {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 44px;
  }
  .bmv-section-eyebrow {
    font-size: 11px; font-weight: 500; letter-spacing: .22em;
    text-transform: uppercase; color: #f97316; margin-bottom: 8px;
  }
  .bmv-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(30px, 3.5vw, 44px);
    font-weight: 400; color: #1a1007; line-height: 1.2;
  }
  .bmv-section-title em { font-style: italic; color: #f97316; }
  .bmv-see-all {
    font-size: 13px; color: #f97316; text-decoration: none;
    font-weight: 500; white-space: nowrap;
    display: flex; align-items: center; gap: 5px;
    transition: gap .18s;
  }
  .bmv-see-all:hover { gap: 10px; }

  /* ── Filter chips ── */
  .bmv-filters {
    display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 36px;
  }
  .bmv-chip {
    padding: 8px 18px; border-radius: 999px;
    border: 1.5px solid #e8e0d8; background: #fff;
    font-size: 13px; color: #7c6f62; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all .18s;
  }
  .bmv-chip:hover, .bmv-chip.active {
    background: #fff5ee; border-color: #f97316; color: #ea580c;
    font-weight: 500;
  }

  /* ── Venue grid ── */
  .bmv-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 28px;
  }

  /* Venue card */
  .bmv-card {
    background: #fff;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid #f0ebe4;
    transition: transform .22s, box-shadow .22s;
    cursor: pointer;
    position: relative;
  }
  .bmv-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 18px 48px rgba(0,0,0,.11);
  }
  .bmv-card-img-wrap {
    position: relative; overflow: hidden; height: 220px;
  }
  .bmv-card-img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform .5s ease;
  }
  .bmv-card:hover .bmv-card-img { transform: scale(1.06); }
  .bmv-card-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(14,10,7,.45) 0%, transparent 55%);
  }
  .bmv-card-badge {
    position: absolute; top: 14px; left: 14px;
    padding: 5px 12px; border-radius: 999px;
    background: rgba(250,248,246,.9); backdrop-filter: blur(6px);
    font-size: 11px; font-weight: 500; color: #ea580c;
    letter-spacing: .06em; text-transform: uppercase;
  }
  .bmv-card-save {
    position: absolute; top: 14px; right: 14px;
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(250,248,246,.9); backdrop-filter: blur(6px);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; transition: background .18s;
  }
  .bmv-card-save:hover { background: #fff; }
  .bmv-card-body { padding: 18px 20px 20px; }
  .bmv-card-location {
    font-size: 11.5px; color: #a09690; font-weight: 400;
    letter-spacing: .04em; margin-bottom: 5px;
    display: flex; align-items: center; gap: 4px;
  }
  .bmv-card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 21px; font-weight: 400; color: #1a1007; line-height: 1.25;
    margin-bottom: 8px;
  }
  .bmv-card-tags {
    display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px;
  }
  .bmv-card-tag {
    padding: 3px 10px; border-radius: 999px;
    background: #faf3ec; border: 1px solid #f5e8d8;
    font-size: 11px; color: #a0714a;
  }
  .bmv-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 14px; border-top: 1px solid #f0ebe4;
  }
  .bmv-card-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400; color: #1a1007;
  }
  .bmv-card-price span { font-family: 'DM Sans', sans-serif; font-size: 12px; color: #a09690; font-weight: 300; }
  .bmv-card-rating {
    display: flex; align-items: center; gap: 4px;
    font-size: 12.5px; color: #5a4f45; font-weight: 400;
  }
  .bmv-star { color: #f97316; font-size: 13px; }
  .bmv-card-btn {
    width: 100%; margin-top: 14px; padding: 11px;
    border-radius: 10px;
    background: linear-gradient(135deg, #f97316, #ea580c);
    border: none; color: #fff; font-size: 13px; font-weight: 500;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    box-shadow: 0 4px 14px rgba(249,115,22,.25);
    transition: opacity .18s, transform .15s;
  }
  .bmv-card-btn:hover { opacity: .9; transform: translateY(-1px); }

  /* ── Empty state ── */
  .bmv-empty {
    grid-column: 1 / -1; text-align: center; padding: 80px 0;
  }
  .bmv-empty-icon { font-size: 48px; margin-bottom: 16px; }
  .bmv-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 300; color: #5a4f45; margin-bottom: 8px;
  }
  .bmv-empty-desc { font-size: 14px; color: #a09690; }

  /* ── Skeleton loader ── */
  .bmv-skeleton {
    background: #f0ebe4;
    border-radius: 18px; overflow: hidden;
    border: 1px solid #f0ebe4;
  }
  .bmv-skel-img { height: 220px; background: #e8e0d8; animation: shimmer 1.5s infinite; }
  .bmv-skel-body { padding: 18px 20px; }
  .bmv-skel-line {
    height: 12px; border-radius: 6px; background: #e8e0d8;
    margin-bottom: 10px; animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer {
    0%   { opacity: 1; }
    50%  { opacity: .5; }
    100% { opacity: 1; }
  }

  /* ── How it works ── */
  .bmv-hiw { background: #1a1007; }
  .bmv-hiw .bmv-section-title { color: #fff; }
  .bmv-hiw .bmv-section-eyebrow { color: #f97316; }
  .bmv-hiw-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2px;
    margin-top: 48px;
  }
  .bmv-hiw-step {
    padding: 40px 32px;
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(255,255,255,.06);
    position: relative;
  }
  .bmv-hiw-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 72px; font-weight: 300; line-height: 1;
    color: rgba(249,115,22,.18);
    position: absolute; top: 20px; right: 24px;
  }
  .bmv-hiw-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(249,115,22,.12); border: 1px solid rgba(249,115,22,.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; margin-bottom: 20px;
  }
  .bmv-hiw-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400; color: #fff; margin-bottom: 10px;
  }
  .bmv-hiw-desc {
    font-size: 13.5px; font-weight: 300; color: rgba(255,255,255,.5);
    line-height: 1.75;
  }

  /* ── CTA banner ── */
  .bmv-cta {
    background: linear-gradient(135deg, #f97316 0%, #c2410c 100%);
    position: relative; overflow: hidden;
  }
  .bmv-cta::before {
    content: '';
    position: absolute; top: -80px; right: -80px;
    width: 400px; height: 400px; border-radius: 50%;
    background: rgba(255,255,255,.06);
    pointer-events: none;
  }
  .bmv-cta-inner {
    max-width: 1200px; margin: 0 auto; padding: 72px 48px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 32px; position: relative; z-index: 1;
  }
  .bmv-cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 3.5vw, 46px);
    font-weight: 300; color: #fff; line-height: 1.25;
  }
  .bmv-cta-title em { font-style: italic; }
  .bmv-cta-desc {
    font-size: 14px; font-weight: 300; color: rgba(255,255,255,.75);
    margin-top: 10px; max-width: 400px; line-height: 1.75;
  }
  .bmv-btn-white {
    padding: 14px 34px; border-radius: 10px;
    background: #fff; border: none;
    font-size: 14px; font-weight: 500; color: #ea580c;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    white-space: nowrap; flex-shrink: 0;
    transition: opacity .18s, transform .15s;
    box-shadow: 0 6px 24px rgba(0,0,0,.15);
  }
  .bmv-btn-white:hover { opacity: .95; transform: translateY(-1px); }

  /* ── Footer ── */
  .bmv-footer {
    background: #0e0a07; padding: 52px 48px 28px;
  }
  .bmv-footer-inner {
    max-width: 1200px; margin: 0 auto;
  }
  .bmv-footer-top {
    display: flex; gap: 60px; justify-content: space-between;
    padding-bottom: 44px;
    border-bottom: 1px solid rgba(255,255,255,.07);
    flex-wrap: wrap;
  }
  .bmv-footer-brand-desc {
    font-size: 13.5px; font-weight: 300; color: rgba(255,255,255,.45);
    margin-top: 14px; max-width: 260px; line-height: 1.75;
  }
  .bmv-footer-col-title {
    font-size: 11px; font-weight: 500; letter-spacing: .18em;
    text-transform: uppercase; color: rgba(255,255,255,.35);
    margin-bottom: 18px;
  }
  .bmv-footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .bmv-footer-links a {
    font-size: 13.5px; font-weight: 300; color: rgba(255,255,255,.55);
    text-decoration: none; transition: color .18s;
  }
  .bmv-footer-links a:hover { color: #f97316; }
  .bmv-footer-bottom {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 24px;
    font-size: 12.5px; color: rgba(255,255,255,.3); font-weight: 300;
    flex-wrap: wrap; gap: 12px;
  }
  .bmv-footer-bottom a { color: rgba(255,255,255,.3); text-decoration: none; }
  .bmv-footer-bottom a:hover { color: rgba(255,255,255,.6); }

  @media (max-width: 768px) {
    .bmv-nav { padding: 0 20px; }
    .bmv-nav-links { display: none; }
    .bmv-hero-inner { padding: 0 20px; }
    .bmv-section { padding: 56px 20px; }
    .bmv-hero-stats-inner { padding: 0 20px; flex-wrap: wrap; }
    .bmv-cta-inner { flex-direction: column; }
    .bmv-footer { padding: 40px 20px 20px; }
    .bmv-footer-top { flex-direction: column; gap: 32px; }
  }
`;

/* ─── Skeleton Card ──────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bmv-skeleton">
      <div className="bmv-skel-img" />
      <div className="bmv-skel-body">
        <div className="bmv-skel-line" style={{ width: "60%" }} />
        <div className="bmv-skel-line" style={{ width: "80%" }} />
        <div className="bmv-skel-line" style={{ width: "40%" }} />
      </div>
    </div>
  );
}

/* ─── Venue Card ─────────────────────────────────────────────────────────── */
function VenueCard({ venue, onClick }) {
  const [saved, setSaved] = useState(false);
  const tags = venue.tags || ["Weddings", "Events"];
  const rating = venue.rating || (4.5 + Math.random() * 0.4).toFixed(1);
  const reviews = venue.reviews || Math.floor(Math.random() * 120 + 40);

  return (
    <div className="bmv-card" onClick={onClick}>
      <div className="bmv-card-img-wrap">
        <img
          src={venue.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80"}
          alt={venue.name}
          className="bmv-card-img"
        />
        <div className="bmv-card-img-overlay" />
        <span className="bmv-card-badge">Available</span>
        <button
          className="bmv-card-save"
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          title={saved ? "Unsave" : "Save venue"}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>

      <div className="bmv-card-body">
        <div className="bmv-card-location">
          <span>📍</span> {venue.location}
        </div>
        <div className="bmv-card-name">{venue.name}</div>
        <div className="bmv-card-tags">
          {tags.slice(0, 3).map((t, i) => (
            <span key={i} className="bmv-card-tag">{t}</span>
          ))}
        </div>
        <div className="bmv-card-footer">
          <div className="bmv-card-price">
            ₹{venue.pricePerHour?.toLocaleString("en-IN")}
            <span> / hour</span>
          </div>
          <div className="bmv-card-rating">
            <span className="bmv-star">★</span>
            {rating}
            <span style={{ color: "#c0b8ae" }}>({reviews})</span>
          </div>
        </div>
        <button className="bmv-card-btn">View Venue →</button>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Weddings", "Corporate", "Parties", "Outdoor", "Banquets"];
  const quickTags = ["Wedding halls", "Rooftop venues", "Beach resorts", "Banquet halls", "Conference rooms"];

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await getVenues();
      setVenues(res.data.venues || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = venues.filter((v) => {
    const matchSearch =
      !search ||
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.location?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "All" ||
      (v.tags && v.tags.includes(activeFilter));
    return matchSearch && matchFilter;
  });

  return (
    <>
      <style>{style}</style>
      <div className="bmv-home">

        {/* ── Navbar ── */}
        <nav className="bmv-nav">
          <a className="bmv-nav-brand" href="/">
            <div className="bmv-nav-icon">
              <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V21H3V9.5z"/></svg>
            </div>
            <span className="bmv-nav-name">Book My Venue</span>
          </a>
          <ul className="bmv-nav-links">
            <li><a href="#">Browse Venues</a></li>
            <li><a href="#">How It Works</a></li>
            <li><a href="#">List Your Venue</a></li>
          </ul>
          <div className="bmv-nav-actions">
            <a className="bmv-btn-ghost" href="/login">Sign In</a>
            <a className="bmv-btn-orange" href="/signup">Get Started</a>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="bmv-hero">
          <div className="bmv-hero-bg" />
          <div className="bmv-hero-overlay" />

          <div className="bmv-hero-inner">
            <div className="bmv-hero-eyebrow">
              <span className="bmv-hero-eyebrow-line" />
              Premium Venue Booking
            </div>
            <h1 className="bmv-hero-title">
              Find your <em>perfect</em><br />
              venue for every<br />
              occasion
            </h1>
            <p className="bmv-hero-subtitle">
              Discover and book extraordinary spaces for weddings, corporate events,
              parties, and celebrations — all in one place.
            </p>

            <div className="bmv-search-bar">
              <span style={{ fontSize: 18, color: "#c0b8ae" }}>🔍</span>
              <input
                type="text"
                placeholder="Search by venue name or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="bmv-search-btn">Search Venues</button>
            </div>

            <div className="bmv-hero-tags">
              {quickTags.map((t) => (
                <button key={t} className="bmv-tag" onClick={() => setSearch(t.split(" ")[0])}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="bmv-hero-stats">
            <div className="bmv-hero-stats-inner">
              {[
                { val: "2,400+", lbl: "Venues Listed" },
                { val: "50K+",   lbl: "Events Hosted" },
                { val: "98%",    lbl: "Client Satisfaction" },
                { val: "24/7",   lbl: "Support Available" },
              ].map((s) => (
                <div key={s.lbl} className="bmv-hstat">
                  <div className="bmv-hstat-val">{s.val}</div>
                  <div className="bmv-hstat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Venues ── */}
        <section className="bmv-section">
          <div className="bmv-section-head">
            <div>
              <div className="bmv-section-eyebrow">Handpicked for You</div>
              <h2 className="bmv-section-title">
                <em>Featured</em> venues
              </h2>
            </div>
            <a href="#" className="bmv-see-all">View all venues →</a>
          </div>

          {/* Filter chips */}
          <div className="bmv-filters">
            {filters.map((f) => (
              <button
                key={f}
                className={`bmv-chip ${activeFilter === f ? "active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="bmv-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.length > 0
              ? filtered.map((venue) => (
                  <VenueCard
                    key={venue._id}
                    venue={venue}
                    onClick={() => navigate(`/venue/${venue._id}`)}
                  />
                ))
              : (
                <div className="bmv-empty">
                  <div className="bmv-empty-icon">🏛️</div>
                  <div className="bmv-empty-title">No venues found</div>
                  <div className="bmv-empty-desc">
                    Try adjusting your search or browse all categories
                  </div>
                </div>
              )
            }
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="bmv-hiw">
          <div className="bmv-section" style={{ paddingTop: 80, paddingBottom: 80 }}>
            <div className="bmv-section-eyebrow" style={{ color: "#f97316" }}>Simple Process</div>
            <h2 className="bmv-section-title" style={{ color: "#fff" }}>
              Book a venue in<br /><em style={{ color: "#fdba74" }}>three easy steps</em>
            </h2>

            <div className="bmv-hiw-grid">
              {[
                { icon: "🔍", n: "01", title: "Browse & Discover", desc: "Explore thousands of curated venues filtered by category, location, capacity, and price." },
                { icon: "📅", n: "02", title: "Check Availability", desc: "Pick your date and time, view real-time availability, and reserve instantly without back-and-forth." },
                { icon: "✨", n: "03", title: "Confirm & Celebrate", desc: "Receive instant booking confirmation, coordinate with the venue owner, and create memories." },
                { icon: "🏆", n: "04", title: "Rate & Review", desc: "Share your experience to help others find the perfect venue for their next occasion." },
              ].map((s) => (
                <div key={s.n} className="bmv-hiw-step">
                  <div className="bmv-hiw-num">{s.n}</div>
                  <div className="bmv-hiw-icon">{s.icon}</div>
                  <div className="bmv-hiw-title">{s.title}</div>
                  <div className="bmv-hiw-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bmv-cta">
          <div className="bmv-cta-inner">
            <div>
              <h2 className="bmv-cta-title">
                Own a venue?<br />
                <em>List it with us today</em>
              </h2>
              <p className="bmv-cta-desc">
                Join 2,400+ venue owners earning more by listing on Book My Venue.
                Free setup, instant payouts, full control.
              </p>
            </div>
            <button className="bmv-btn-white" onClick={() => navigate("/signup")}>
              List Your Venue →
            </button>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bmv-footer">
          <div className="bmv-footer-inner">
            <div className="bmv-footer-top">
              <div>
                <div className="bmv-nav-brand" style={{ marginBottom: 0 }}>
                  <div className="bmv-nav-icon">
                    <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V21H3V9.5z"/></svg>
                  </div>
                  <span className="bmv-nav-name" style={{ color: "#fff" }}>Book My Venue</span>
                </div>
                <p className="bmv-footer-brand-desc">
                  Kerala's premier venue booking platform. Connecting event planners with extraordinary spaces since 2023.
                </p>
              </div>
              <div>
                <div className="bmv-footer-col-title">Explore</div>
                <ul className="bmv-footer-links">
                  {["Wedding Halls", "Banquet Halls", "Outdoor Venues", "Conference Rooms", "Rooftop Venues"].map(l => (
                    <li key={l}><a href="#">{l}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="bmv-footer-col-title">Company</div>
                <ul className="bmv-footer-links">
                  {["About Us", "How It Works", "List Your Venue", "Careers", "Blog"].map(l => (
                    <li key={l}><a href="#">{l}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="bmv-footer-col-title">Support</div>
                <ul className="bmv-footer-links">
                  {["Help Centre", "Contact Us", "Cancellation Policy", "Trust & Safety", "Terms of Service"].map(l => (
                    <li key={l}><a href="#">{l}</a></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bmv-footer-bottom">
              <span>© 2024 Book My Venue. All rights reserved.</span>
              <div style={{ display: "flex", gap: 20 }}>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms</a>
                <a href="#">Cookies</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
