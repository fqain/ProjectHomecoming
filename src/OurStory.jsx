import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Heart, ChevronLeft, ChevronRight, ImagePlus, Pencil, Check, Crown, Lock,
  Camera, PlaneTakeoff, PlaneLanding, Compass, Stamp,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const C = {
  ink: "#2c2417",
  inkSoft: "#4a3f2c",
  parchment: "#f8f1e1",
  parchmentDark: "#ecdcb4",
  leather: "#3a0f1d",
  leatherLight: "#5c1a2e",
  leatherDark: "#22090f",
  gold: "#c9a24b",
  goldDeep: "#8f6d24",
  goldPale: "#e7d6a9",
  teal: "#3f7d78",
  rose: "#b3555f",
  bg1: "#1c2440",
  bg2: "#0e1226",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,600&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Special+Elite&display=swap');

.os-root { font-family: 'EB Garamond', serif; }
.os-display { font-family: 'Playfair Display', serif; }
.os-stamp-font { font-family: 'Special Elite', monospace; }

.corner-mark { position:absolute; width:9px; height:9px; border:1.5px solid rgba(201,162,75,0.85); transform:rotate(45deg); }
.polaroid { background:#fbf6ea; padding:8px 8px 20px 8px; border-radius:2px; box-shadow:0 8px 18px rgba(0,0,0,0.4); }

@keyframes os-float { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-8px) rotate(0.4deg); } }
@keyframes os-stampIn { 0% { transform: scale(2.4) rotate(-18deg); opacity:0; } 60% { transform: scale(0.92) rotate(-8deg); opacity:1; } 100% { transform: scale(1) rotate(-8deg); opacity:1; } }
@keyframes os-shimmer { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
@keyframes os-fadeUp { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform: translateY(0); } }

.os-idle-float { animation: os-float 6s ease-in-out infinite; }
.os-stamp-in { animation: os-stampIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
.os-shimmer { animation: os-shimmer 2.6s ease-in-out infinite; }
.os-fade-up { animation: os-fadeUp 0.5s ease both; }

.os-dot { transition: transform 0.2s ease, background 0.2s ease; cursor: pointer; }
.os-dot:hover { transform: scale(1.35); }

.os-navbtn { transition: background 0.2s ease, transform 0.2s ease; }
.os-navbtn:hover:not(:disabled) { background: rgba(255,255,255,0.16); transform: translateY(-50%) scale(1.06); }
.os-navbtn:focus-visible, .os-edit-input:focus-visible, .os-seal-btn:focus-visible, .os-dot:focus-visible {
  outline: 2px solid #e7d6a9; outline-offset: 2px;
}

.os-seal-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.os-seal-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(0,0,0,0.4); }
.os-seal-btn:active { transform: translateY(0px) scale(0.98); }

.os-edit-btn svg, .os-seal-btn svg { display: block; flex-shrink: 0; }
.os-edit-btn { font: inherit; }

.os-ticket-edit { background: transparent; border: none; border-bottom: 1px dashed rgba(255,255,255,0.4); }

.os-lace {
  background-image:
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.10) 0 2px, transparent 2.5px),
    radial-gradient(circle at 60% 45%, rgba(255,255,255,0.08) 0 3px, transparent 3.5px),
    radial-gradient(circle at 30% 70%, rgba(255,255,255,0.09) 0 2px, transparent 2.5px),
    radial-gradient(circle at 80% 15%, rgba(255,255,255,0.07) 0 2px, transparent 2.5px),
    radial-gradient(circle at 85% 80%, rgba(255,255,255,0.09) 0 3px, transparent 3.5px),
    radial-gradient(circle at 45% 90%, rgba(255,255,255,0.08) 0 2px, transparent 2.5px),
    repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 10px),
    repeating-linear-gradient(-45deg, rgba(0,0,0,0.12) 0 2px, transparent 2px 10px);
  background-size: 70px 70px, 90px 90px, 80px 80px, 60px 60px, 100px 100px, 75px 75px, 100% 100%, 100% 100%;
}

@media (prefers-reduced-motion: reduce) {
  .os-idle-float, .os-stamp-in, .os-shimmer, .os-fade-up { animation: none !important; }
}

/* ---- iPhone 16 / narrow phones (≤ 420px logical width) ---- */
@media (max-width: 420px) {
  .os-page-root { padding: 1.1rem 0.65rem 2.25rem !important; }
  .os-ticket-outer { max-width: 100% !important; border-radius: 14px !important; }
  .os-ticket-main { padding: 0.85rem 0.85rem !important; }
  .os-ticket-stub { width: 4.4rem !important; padding: 0.7rem 0.4rem !important; }
  .os-hero-photo { width: 2.9rem !important; height: 2.9rem !important; }
  .os-countdown-num { font-size: 1.28rem !important; }
  .os-ticket-field-value { font-size: 0.92rem !important; }
  .os-book-outer { padding-left: 2.3rem; padding-right: 2.3rem; box-sizing: border-box; max-width: 100% !important; }
  .os-navbtn { width: 2rem !important; height: 2rem !important; }
  .os-navbtn-left { left: 0.15rem !important; }
  .os-navbtn-right { right: 0.15rem !important; }
  .os-cover-title { font-size: 1.45rem !important; }
  .os-cover-body { font-size: 0.9rem !important; }
  .os-page-title { font-size: 1.18rem !important; }
  .os-page-body { font-size: 0.9rem !important; }
  .os-prevtrip-item { width: 5.1rem !important; }
  .os-nameplate-text { font-size: 0.7rem !important; }
}
`;

/* ------------------------------------------------------------------ */
/*  Story content                                                      */
/* ------------------------------------------------------------------ */
const storyPages = [
  { id: "where", kind: "text", eyebrow: "01 · The Destination", title: "Where We're Going", body: "Type the destination and what's pulling us there — the food, the view, the reason we picked it." },
  { id: "day1", kind: "text", eyebrow: "02 · Day One, Fri", title: "Arrival", body: "What we land into — the first evening, the first meal, the first walk." },
  { id: "day2", kind: "text", eyebrow: "03 · Midweek", title: "Exploring", body: "The plan for the big day — the thing we've been looking forward to most." },
  { id: "day3", kind: "text", eyebrow: "04 · Day Seven, Fri", title: "Slow Morning, Long Goodbye", body: "How we ease out of it — the last coffee, the last view, before heading home." },
  { id: "gallery", kind: "gallery", eyebrow: "05 · After the Trip", title: "Our Memories", images: [
    { src: null, caption: "" }, { src: null, caption: "" }, { src: null, caption: "" }, { src: null, caption: "" },
  ] },
];

const coverPage = { id: "cover", kind: "cover", title: "Ireland Trip 2026", body: "Fyaz & Rida's Adventure", nameplate: "IRELAND · 2026", photo: null };
const closingPage = { id: "closing", kind: "cover", title: "To Be Continued …", body: "Filled in with what actually happened, the day we got back.", stampWord: "ARRIVED", nameplate: "SLÁN GO FÓILL", photo: null };

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
function useCountdown(targetISO) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const target = new Date(targetISO);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, arrived: diff <= 0 };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

function fmtCode(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return "--- --";
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" }).toUpperCase();
}
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function OurStory() {
  const [couple, setCouple] = useState("Fyaz & Rida");
  const [fromCity, setFromCity] = useState("HOME");
  const [toCity, setToCity] = useState("TOGETHER");
  const [arrival, setArrival] = useState("2026-07-31T18:00");
  const [departure, setDeparture] = useState("2026-08-07");
  const [heroPhoto, setHeroPhoto] = useState(null);
  const [prevTrips, setPrevTrips] = useState(Array(6).fill(null));
  const [revealed, setRevealed] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [revealLabel, setRevealLabel] = useState("Until we're together");
  const [arrivedMessage, setArrivedMessage] = useState("She's here. \u{1F451}");
  const [sealLabel, setSealLabel] = useState("The Queen Has Arrived");

  const [pageData, setPageData] = useState([coverPage, ...storyPages, closingPage]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState(null);
  const [dir, setDir] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const wrapRef = useRef(null);

  const countdown = useCountdown(arrival);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (countdown.arrived) setRevealed(true);
  }, [countdown.arrived]);

  const jumpTo = useCallback((target) => {
    if (animating || target === currentIndex || target < 0 || target >= pageData.length) return;
    setDir(target > currentIndex ? "next" : "prev");
    setPendingIndex(target);
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(true)));
  }, [animating, currentIndex, pageData.length]);

  const goTo = (direction) => jumpTo(currentIndex + (direction === "next" ? 1 : -1));

  useEffect(() => {
    if (!revealed) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") goTo("next");
      if (e.key === "ArrowLeft") goTo("prev");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, currentIndex, animating]);

  const onLeafTransitionEnd = (e) => {
    if (e.propertyName !== "transform") return;
    setNoTransition(true);
    setCurrentIndex(pendingIndex);
    setAnimating(false);
    setDir(null);
    requestAnimationFrame(() => requestAnimationFrame(() => setNoTransition(false)));
  };

  const updatePage = (idx, field, value) => {
    setPageData((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  };

  const handleImageUpload = async (pageIdx, slotIdx, file) => {
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    setPageData((prev) => prev.map((p, i) => {
      if (i !== pageIdx) return p;
      const images = p.images.map((img, s) => (s === slotIdx ? { ...img, src: dataUrl } : img));
      return { ...p, images };
    }));
  };

  const handleCaptionChange = (pageIdx, slotIdx, caption) => {
    setPageData((prev) => prev.map((p, i) => {
      if (i !== pageIdx) return p;
      const images = p.images.map((img, s) => (s === slotIdx ? { ...img, caption } : img));
      return { ...p, images };
    }));
  };

  const handleHeroUpload = async (file) => {
    if (!file) return;
    setHeroPhoto(await readFileAsDataURL(file));
  };

  const handleCoverPhotoUpload = async (pageIdx, file) => {
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    updatePage(pageIdx, "photo", dataUrl);
  };

  const handlePrevTripUpload = async (idx, file) => {
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    setPrevTrips((prev) => prev.map((p, i) => (i === idx ? dataUrl : p)));
  };

  const showUnderneath = pendingIndex !== null ? pendingIndex : currentIndex;
  const wrapperStyle = (page) => (page?.kind === "cover" ? hardcoverPageStyle : pageBaseStyle);

  /* ---- cover ornament: one small motif, echoing the reference photo's restraint ---- */
  const renderCoverOrnaments = () => (
    <div style={{ position: "absolute", top: "9%", right: "11%", opacity: 0.9 }}>
      <Compass size={20} color={C.goldPale} strokeWidth={1.6} />
    </div>
  );

  const renderPageContent = (page, idx) => {
    if (page.kind === "cover") {
      const isFront = idx === 0;
      return (
        <div className="os-lace" style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", background: isFront
          ? `linear-gradient(135deg, ${C.leatherLight} 0%, ${C.leather} 55%, ${C.leatherDark} 100%)`
          : `linear-gradient(135deg, ${C.teal} 0%, #245951 55%, #163a35 100%)` }}>
          {/* gold corner brackets, like the reference photo */}
          {["tl", "tr", "bl", "br"].map((corner) => (
            <div key={corner} style={goldCornerStyle(corner)} />
          ))}
          {renderCoverOrnaments()}

          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", textAlign: "center", padding: "2.4rem 1.8rem" }}>
            <label style={{ ...coverPhotoSlotStyle, marginBottom: "1rem" }}>
              {page.photo ? (
                <img src={page.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", color: "rgba(231,214,169,0.75)" }}>
                  <ImagePlus size={20} />
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.72rem" }}>add photo</span>
                </div>
              )}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleCoverPhotoUpload(idx, e.target.files[0])} />
            </label>

            {editMode ? (
              <textarea aria-label="Cover title" className="os-edit-input os-cover-title" value={page.title} onChange={(e) => updatePage(idx, "title", e.target.value)} rows={2}
                style={{ ...coverTitleStyle, background: "transparent", border: "none", borderBottom: "1px dashed rgba(201,162,75,0.6)", textAlign: "center", width: "100%", resize: "none" }} />
            ) : (
              <h1 className="os-display os-cover-title" style={coverTitleStyle}>{page.title}</h1>
            )}
            {editMode ? (
              <input aria-label="Cover subtitle" className="os-edit-input os-cover-body" value={page.body} onChange={(e) => updatePage(idx, "body", e.target.value)}
                style={{ ...coverBodyStyle, background: "transparent", border: "none", borderBottom: "1px dashed rgba(201,162,75,0.6)", textAlign: "center", width: "100%" }} />
            ) : (
              <p className="os-cover-body" style={coverBodyStyle}>{page.body}</p>
            )}

            {page.stampWord && (
              <div className="os-stamp-font" style={exitStampStyle}>
                <Stamp size={13} style={{ marginRight: "0.3rem", verticalAlign: "-2px" }} />
                {page.stampWord}
              </div>
            )}
          </div>

          {/* nameplate strip, riveted, like the reference photo */}
          <div style={nameplateWrapStyle}>
            <div style={rivetStyle} />
            <div style={nameplateStyle}>
              {editMode ? (
                <input aria-label="Nameplate text" className="os-edit-input os-nameplate-text" value={page.nameplate || ""} onChange={(e) => updatePage(idx, "nameplate", e.target.value.toUpperCase())}
                  style={{ ...nameplateTextStyle, background: "transparent", border: "none", textAlign: "center", width: "100%" }} />
              ) : (
                <span className="os-nameplate-text" style={nameplateTextStyle}>{page.nameplate}</span>
              )}
            </div>
            <div style={rivetStyle} />
          </div>
        </div>
      );
    }

    if (page.kind === "gallery") {
      return (
        <div style={{ padding: "2.1rem 2.1rem 1.6rem", height: "100%", display: "flex", flexDirection: "column" }}>
          <p className="os-stamp-font" style={eyebrowStyle}>{page.eyebrow}</p>
          {editMode ? (
            <input className="os-edit-input" aria-label="Gallery title" value={page.title} onChange={(e) => updatePage(idx, "title", e.target.value)}
              style={{ ...pageTitleStyle, background: "transparent", border: "none", borderBottom: "1px dashed #c9a24b" }} />
          ) : (
            <h2 className="os-display os-page-title" style={pageTitleStyle}>{page.title}</h2>
          )}
          <div style={{ width: "2.25rem", height: "2px", background: C.gold, margin: "0.6rem 0 0.9rem" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridAutoRows: "min-content", gap: "0.85rem", alignContent: "start", overflow: "auto" }}>
            {page.images.map((img, slotIdx) => (
              <div key={slotIdx} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <label style={imgSlotStyle}>
                  {img.src ? (
                    <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }} />
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", color: "#b09a6b" }}>
                      <ImagePlus size={18} />
                      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.75rem" }}>add photo</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleImageUpload(idx, slotIdx, e.target.files[0])} />
                </label>
                {editMode ? (
                  <input className="os-edit-input" placeholder="caption…" value={img.caption} onChange={(e) => handleCaptionChange(idx, slotIdx, e.target.value)}
                    style={{ ...captionStyle, borderBottom: "1px dashed #c9a24b", width: "100%" }} />
                ) : (
                  img.caption && <p style={captionStyle}>{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: "2.25rem", height: "100%", display: "flex", flexDirection: "column" }}>
        {page.eyebrow && <p className="os-stamp-font" style={eyebrowStyle}>{page.eyebrow}</p>}
        {editMode ? (
          <input className="os-edit-input" aria-label="Page title" value={page.title} onChange={(e) => updatePage(idx, "title", e.target.value)}
            style={{ ...pageTitleStyle, background: "transparent", border: "none", borderBottom: "1px dashed #c9a24b" }} />
        ) : (
          <h2 className="os-display os-page-title" style={pageTitleStyle}>{page.title}</h2>
        )}
        <div style={{ width: "2.25rem", height: "2px", background: C.gold, margin: "0.75rem 0 1.1rem" }} />
        {editMode ? (
          <textarea className="os-edit-input" aria-label="Page body" value={page.body} onChange={(e) => updatePage(idx, "body", e.target.value)}
            style={{ ...pageBodyStyle, background: "transparent", border: "none", flex: 1, resize: "none" }} />
        ) : (
          <p className="os-page-body" style={pageBodyStyle}>{page.body}</p>
        )}
      </div>
    );
  };

  const rotations = [-4, 3, -2, 5, -3, 2];
  const transformOrigin = dir === "prev" ? "right center" : "left center";
  const leafRotation = animating ? (dir === "next" ? "rotateY(-179.9deg)" : "rotateY(179.9deg)") : "rotateY(0deg)";

  return (
    <div className="os-root os-page-root" style={{ minHeight: "100vh", background: `radial-gradient(circle at 50% 0%, ${C.bg1} 0%, #151b38 55%, ${C.bg2} 100%)`, padding: "2.25rem 1rem 3rem", display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box", width: "100%" }}>
      <style>{FONTS}</style>

      {/* ---------------- Boarding-pass hero ---------------- */}
      <div style={ticketOuterStyle} className={`os-ticket-outer${!revealed ? " os-idle-float" : ""}`}>
        <div style={ticketMainStyle} className="os-ticket-main">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.7rem" }}>
            <span className="os-stamp-font" style={ticketKicker}>BOARDING PASS</span>
            <PlaneTakeoff size={16} color={C.goldPale} />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="os-stamp-font" style={ticketFieldLabel}>FROM</div>
              {editMode ? (
                <input className="os-ticket-edit os-display os-ticket-field-value" value={fromCity} onChange={(e) => setFromCity(e.target.value.toUpperCase())} style={{ ...ticketFieldValue, width: "100%" }} />
              ) : (
                <div className="os-display os-ticket-field-value" style={ticketFieldValue}>{fromCity}</div>
              )}
            </div>
            <PlaneLanding size={18} color={C.gold} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0, textAlign: "right" }}>
              <div className="os-stamp-font" style={ticketFieldLabel}>TO</div>
              {editMode ? (
                <input className="os-ticket-edit os-display os-ticket-field-value" value={toCity} onChange={(e) => setToCity(e.target.value.toUpperCase())} style={{ ...ticketFieldValue, width: "100%", textAlign: "right" }} />
              ) : (
                <div className="os-display os-ticket-field-value" style={ticketFieldValue}>{toCity}</div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1.4rem", margin: "0.9rem 0 0.3rem" }}>
            <div>
              <div className="os-stamp-font" style={ticketFieldLabel}>DEPART</div>
              <div className="os-stamp-font" style={ticketSmallCode}>{fmtCode(arrival)}</div>
            </div>
            <div>
              <div className="os-stamp-font" style={ticketFieldLabel}>RETURN</div>
              <div className="os-stamp-font" style={ticketSmallCode}>{fmtCode(departure)}</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div className="os-stamp-font" style={ticketFieldLabel}>PASSENGER</div>
              {editMode ? (
                <input className="os-ticket-edit os-stamp-font" value={couple} onChange={(e) => setCouple(e.target.value)} style={{ ...ticketSmallCode, textAlign: "right", width: "8.5rem" }} />
              ) : (
                <div className="os-stamp-font" style={{ ...ticketSmallCode, textAlign: "right" }}>{couple}</div>
              )}
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            {countdown.arrived ? (
              <p className="os-display os-stamp-in" style={{ color: C.goldPale, fontSize: "1.35rem", margin: 0, fontWeight: 600 }}>{arrivedMessage}</p>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {[["DAYS", countdown.days], ["HRS", countdown.hours], ["MIN", countdown.minutes], ["SEC", countdown.seconds]].map(([label, val]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div className="os-display os-countdown-num" style={{ color: C.goldPale, fontSize: "1.55rem", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{String(val).padStart(2, "0")}</div>
                    <div className="os-stamp-font" style={{ color: "#9c8f66", fontSize: "0.62rem", letterSpacing: "0.1em" }}>{label}</div>
                  </div>
                ))}
              </div>
            )}
            {editMode ? (
              <input className="os-edit-input" value={revealLabel} onChange={(e) => setRevealLabel(e.target.value)}
                style={{ color: "#9aa3c9", fontSize: "0.75rem", marginTop: "0.5rem", width: "100%", textAlign: "center", background: "transparent", border: "none", borderBottom: "1px dashed rgba(201,162,75,0.4)" }} />
            ) : (
              <p style={{ color: "#9aa3c9", fontSize: "0.75rem", margin: "0.5rem 0 0", textAlign: "center" }}>{revealLabel}</p>
            )}
          </div>
        </div>

        {/* perforation */}
        <div style={perforationStyle}>
          <div style={{ ...notchStyle, top: -9 }} />
          <div style={{ ...notchStyle, bottom: -9 }} />
        </div>

        <div style={ticketStubStyle} className="os-ticket-stub">
          <label style={heroPhotoStyle} className="os-hero-photo">
            {heroPhoto ? (
              <img src={heroPhoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", color: "#c9b98a" }}>
                <Camera size={18} />
                <span style={{ fontSize: "0.68rem", textAlign: "center" }}>photo</span>
              </div>
            )}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleHeroUpload(e.target.files[0])} />
          </label>
          <span className="os-stamp-font" style={{ color: "#9c8f66", fontSize: "0.58rem", marginTop: "0.5rem", writingMode: "vertical-rl", letterSpacing: "0.1em" }}>SEAT 2A</span>
        </div>
      </div>

      {editMode && (
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "0.9rem", flexWrap: "wrap" }}>
          <input type="datetime-local" value={arrival} onChange={(e) => setArrival(e.target.value)} style={dateInputStyle} aria-label="Arrival date and time" />
          <input type="date" value={departure} onChange={(e) => setDeparture(e.target.value)} style={dateInputStyle} aria-label="Departure date" />
        </div>
      )}

      {!revealed && (
        <button className="os-seal-btn" onClick={() => setRevealed(true)} style={sealBtnStyle}>
          <Crown size={15} /> {sealLabel}
        </button>
      )}
      {editMode && !revealed && (
        <input className="os-edit-input" value={sealLabel} onChange={(e) => setSealLabel(e.target.value)}
          style={{ color: "#9aa3c9", fontSize: "0.72rem", marginTop: "0.4rem", textAlign: "center", background: "transparent", border: "none", borderBottom: "1px dashed rgba(201,162,75,0.4)" }} />
      )}

<br></br>
      {/* ---------------- Previous trips, stamp strip ---------------- */}
      <div style={{ width: "100%", maxWidth: "30rem", marginBottom: "2rem" }}>
        <p className="os-stamp-font" style={{ ...eyebrowStyle, color: C.gold, textAlign: "center" }}>PASSPORT · PRIOR STAMPS</p>
        <h3 className="os-display" style={{ color: "#f7f0e1", textAlign: "center", margin: "0.2rem 0 1.1rem", fontSize: "1.3rem" }}>Our Adventures So Far</h3>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(201,162,75,0.3)", borderRadius: "14px", padding: "1.4rem 1rem" }}>
          {prevTrips.map((img, i) => (
            <label key={i} className="polaroid os-prevtrip-item" style={{ width: "6.5rem", transform: `rotate(${rotations[i]}deg)`, cursor: "pointer" }}>
              <div style={{ width: "100%", aspectRatio: "1 / 1", background: "#e9e0c8", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "2px", overflow: "hidden" }}>
                {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ImagePlus size={18} color="#b09a6b" />}
              </div>
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handlePrevTripUpload(i, e.target.files[0])} />
            </label>
          ))}
        </div>
      </div>

      {/* ---------------- Flip-book ---------------- */}
      {!revealed ? (
        <div className="os-book-outer" style={{ width: "100%", maxWidth: "26rem" }}>
          <div className="os-book-wrap" style={{ position: "relative", width: "100%", aspectRatio: "3 / 4" }}>
            <div style={{ ...hardcoverPageStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem", textAlign: "center", padding: "2rem" }}>
              <div style={frameInsetStyle} />
              {renderCoverOrnaments()}
              <Lock size={22} color={C.gold} style={{ position: "relative" }} />
              <p className="os-display" style={{ position: "relative", color: C.goldPale, fontSize: "1.05rem", margin: 0 }}>The story opens when you're together</p>
              <p style={{ position: "relative", color: "#b39f78", fontSize: "0.82rem", margin: 0 }}>— or tap "{sealLabel}" above</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="os-book-outer" style={{ width: "100%", maxWidth: "26rem", position: "relative" }}>
            <div ref={wrapRef} className="os-book-wrap" style={{ position: "relative", width: "100%", aspectRatio: "3 / 4", perspective: "2200px" }}>
              <div style={wrapperStyle(pageData[showUnderneath])}>{renderPageContent(pageData[showUnderneath], showUnderneath)}</div>

              <div
                onTransitionEnd={onLeafTransitionEnd}
                style={{
                  ...wrapperStyle(pageData[currentIndex]),
                  transformOrigin,
                  transformStyle: "preserve-3d",
                  transition: noTransition || reducedMotion ? "none" : "transform 0.85s cubic-bezier(0.45,0.05,0.25,1)",
                  transform: reducedMotion ? "none" : leafRotation,
                  opacity: reducedMotion && pendingIndex !== null ? 0 : 1,
                  zIndex: 5,
                }}
              >
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
                  {renderPageContent(pageData[currentIndex], currentIndex)}
                  <div style={{ ...pageShadeStyle, opacity: animating ? 1 : 0 }} />
                </div>
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: `linear-gradient(135deg, ${C.parchmentDark}, ${C.parchment})`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Heart size={24} color={C.gold} />
                </div>
              </div>

              <button className="os-navbtn os-navbtn-left" aria-label="Previous page" onClick={() => goTo("prev")} disabled={currentIndex === 0} style={{ ...navBtnStyle, left: "-2.6rem", opacity: currentIndex === 0 ? 0.25 : 1 }}>
                <ChevronLeft color={C.goldPale} />
              </button>
              <button className="os-navbtn os-navbtn-right" aria-label="Next page" onClick={() => goTo("next")} disabled={currentIndex === pageData.length - 1} style={{ ...navBtnStyle, right: "-2.6rem", opacity: currentIndex === pageData.length - 1 ? 0.25 : 1 }}>
                <ChevronRight color={C.goldPale} />
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.6rem" }} role="tablist" aria-label="Story pages">
            {pageData.map((p, i) => (
              <div key={p.id} role="tab" aria-selected={i === currentIndex} tabIndex={0} className="os-dot"
                onClick={() => jumpTo(i)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") jumpTo(i); }}
                style={{ width: i === currentIndex ? "16px" : "6px", height: "6px", borderRadius: "999px", background: i === currentIndex ? C.gold : "rgba(255,255,255,0.25)" }} />
            ))}
          </div>
        </>
      )}

<br></br><br></br><br></br>
      <button className="os-navbtn os-edit-btn" onClick={() => setEditMode((v) => !v)} style={editBtnStyle}>
        {editMode ? <Check size={14} /> : <Pencil size={14} />}
        {editMode ? "Done editing" : "Edit story"}
      </button>

    </div>
    
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                              */
/* ------------------------------------------------------------------ */
const pageBaseStyle = {
  position: "absolute", inset: 0,
  background: `linear-gradient(180deg, ${C.parchment}, ${C.parchmentDark})`,
  borderRadius: "10px", boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
  border: "1px solid rgba(180,150,90,0.25)", overflow: "hidden",
};

const hardcoverPageStyle = {
  position: "absolute", inset: 0,
  background: `linear-gradient(135deg, ${C.leatherLight} 0%, ${C.leather} 60%, ${C.leatherDark} 100%)`,
  borderRadius: "10px",
  boxShadow: "0 20px 45px rgba(0,0,0,0.55), inset 0 0 0 2px rgba(201,162,75,0.5)",
  border: "1px solid rgba(201,162,75,0.6)", overflow: "hidden",
};

const pageShadeStyle = {
  position: "absolute", inset: 0, pointerEvents: "none",
  background: "linear-gradient(90deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 35%)",
  transition: "opacity 0.85s ease",
};

const frameInsetStyle = { position: "absolute", inset: "10px", border: "1px solid rgba(201,162,75,0.55)", borderRadius: "6px", pointerEvents: "none" };

const goldCornerStyle = (corner) => {
  const size = "26px";
  const base = {
    position: "absolute", width: size, height: size,
    background: `linear-gradient(135deg, #f2d98a, ${C.gold} 40%, ${C.goldDeep})`,
    boxShadow: "0 2px 6px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.35)",
    zIndex: 2,
  };
  const shapes = {
    tl: { top: 0, left: 0, clipPath: "polygon(0 0, 100% 0, 0 100%)" },
    tr: { top: 0, right: 0, clipPath: "polygon(100% 0, 100% 100%, 0 0)" },
    bl: { bottom: 0, left: 0, clipPath: "polygon(0 0, 100% 100%, 0 100%)" },
    br: { bottom: 0, right: 0, clipPath: "polygon(100% 0, 100% 100%, 0 100%)" },
  };
  return { ...base, ...shapes[corner] };
};

const nameplateWrapStyle = {
  position: "absolute", left: "12%", right: "12%", bottom: "8%",
  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
};

const nameplateStyle = {
  flex: 1, background: "linear-gradient(180deg, #f3e6c4, #ddc48a)",
  borderRadius: "999px", padding: "0.4rem 0.9rem",
  boxShadow: "0 3px 8px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.5)",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const nameplateTextStyle = { color: "#5c4420", fontSize: "0.78rem", letterSpacing: "0.14em", fontWeight: 600, fontFamily: "'EB Garamond', serif" };

const rivetStyle = {
  width: "9px", height: "9px", borderRadius: "50%", flexShrink: 0,
  background: "radial-gradient(circle at 35% 30%, #6b5335, #2c2213)",
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
};

const exitStampStyle = {
  position: "absolute", bottom: "1.4rem", right: "1.6rem",
  color: "rgba(201,162,75,0.55)", fontSize: "0.68rem", letterSpacing: "0.14em",
  border: "1.5px solid rgba(201,162,75,0.45)", borderRadius: "3px", padding: "0.15rem 0.4rem",
  transform: "rotate(-8deg)",
};

const eyebrowStyle = { color: C.goldDeep, fontSize: "0.72rem", letterSpacing: "0.06em", margin: 0 };
const pageTitleStyle = { color: C.ink, fontSize: "1.45rem", margin: "0.25rem 0 0", fontWeight: 600 };
const pageBodyStyle = { color: C.inkSoft, fontSize: "1.03rem", lineHeight: 1.6, fontFamily: "'EB Garamond', serif" };
const coverTitleStyle = { color: C.goldPale, fontSize: "1.85rem", fontWeight: 700, margin: "0 0 0.75rem" };
const coverBodyStyle = { fontStyle: "italic", color: "#b39f78", fontSize: "1.03rem", margin: 0, fontFamily: "'EB Garamond', serif" };
const captionStyle = { fontStyle: "italic", color: C.goldDeep, fontSize: "0.72rem", margin: 0, background: "transparent", border: "none", padding: 0, fontFamily: "'EB Garamond', serif" };

const editBtnStyle = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
  background: "rgba(201,162,75,0.15)", border: "1px solid rgba(201,162,75,0.4)",
  color: "#f7f0e1", borderRadius: "999px", padding: "0.5rem 1rem",
  fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", lineHeight: 1,
  whiteSpace: "nowrap", marginBottom: "1.6rem", cursor: "pointer",
  WebkitAppearance: "none", appearance: "none",
};

const sealBtnStyle = {
  display: "flex", alignItems: "center", gap: "0.4rem", justifyContent: "center",
  background: `linear-gradient(135deg, ${C.gold}, ${C.goldDeep})`,
  border: "none", color: "#2a1e0a", borderRadius: "999px", padding: "0.55rem 1.1rem",
  fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "0.9rem",
  marginTop: "1.1rem", cursor: "pointer", boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
};

const navBtnStyle = {
  position: "absolute", top: "50%", transform: "translateY(-50%)",
  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(201,162,75,0.3)",
  borderRadius: "50%", width: "2.4rem", height: "2.4rem",
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
};

const coverPhotoSlotStyle = {
  position: "relative", zIndex: 1,
  display: "flex", alignItems: "center", justifyContent: "center",
  width: "12rem", height: "12rem", margin: "1rem auto 1rem",
  borderRadius: "12px", border: "1.5px dashed rgba(231,214,169,0.55)",
  background: "rgba(0,0,0,0.15)", cursor: "pointer", overflow: "hidden", flexShrink: 0,
};

const imgSlotStyle = {
  display: "flex", alignItems: "center", justifyContent: "center",
  border: "1.5px dashed #d8c48f", borderRadius: "6px", aspectRatio: "1 / 1",
  background: "rgba(201,162,75,0.06)", cursor: "pointer",
};

const heroPhotoStyle = {
  display: "flex", alignItems: "center", justifyContent: "center",
  width: "3.6rem", height: "3.6rem", borderRadius: "8px",
  border: "1.5px dashed rgba(201,162,75,0.6)", cursor: "pointer", overflow: "hidden",
};

const dateInputStyle = {
  background: "rgba(0,0,0,0.2)", border: "1px solid rgba(201,162,75,0.4)",
  borderRadius: "8px", color: "#f7f0e1", padding: "0.3rem 0.5rem",
  fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", colorScheme: "dark",
};

/* --- boarding pass ticket --- */
const ticketOuterStyle = {
  width: "100%", maxWidth: "26rem", display: "flex",
  background: `linear-gradient(160deg, ${C.leatherLight}, ${C.leather})`,
  border: "1px solid rgba(201,162,75,0.4)", borderRadius: "16px",
  boxShadow: "0 18px 40px rgba(0,0,0,0.45)", marginBottom: "1rem", overflow: "visible", position: "relative",
};

const ticketMainStyle = { flex: 1, padding: "1.1rem 1.2rem" };

const ticketKicker = { color: C.gold, fontSize: "0.68rem", letterSpacing: "0.18em" };
const ticketFieldLabel = { color: "#9c8f66", fontSize: "0.6rem", letterSpacing: "0.1em", marginBottom: "0.1rem" };
const ticketFieldValue = { color: "#f7f0e1", fontSize: "1.05rem", fontWeight: 700, letterSpacing: "0.03em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
const ticketSmallCode = { color: "#e7d6a9", fontSize: "0.78rem" };

const perforationStyle = { position: "relative", width: 0, borderLeft: "2px dashed rgba(201,162,75,0.35)" };
const notchStyle = { position: "absolute", left: "-9px", width: "18px", height: "18px", borderRadius: "50%", background: C.bg2 };

const ticketStubStyle = {
  width: "5.6rem", padding: "1rem 0.6rem", display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center", gap: "0.2rem",
};
