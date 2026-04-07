import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { smartSearch } from "../../features/user/searchSlice";

const TABS = [
  { key: "cities", label: "Cities", icon: "🏙️" },
  { key: "hotels", label: "Hotels", icon: "🏨" },
  { key: "places", label: "Places", icon: "📍" },
  { key: "restaurants", label: "Restaurants", icon: "🍽️" },
  { key: "travel", label: "Travel", icon: "✈️" },
];

const IMAGES = [
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b",
];

const HEADLINE_MAP = {
  cities: {
    title: "Discover Your Next City",
    sub: "Explore urban wonders around the globe",
  },
  hotels: {
    title: "Stay in Luxury",
    sub: "Hand-picked hotels for every journey",
  },
  places: {
    title: "Find Hidden Gems",
    sub: "Off-the-beaten-path destinations await",
  },
  restaurants: {
    title: "Taste the World",
    sub: "Authentic flavours at every destination",
  },
  travel: {
    title: "The World is Yours",
    sub: "Plan the adventure of a lifetime",
  },
};

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("cities");
  const [currentImage, setCurrentImage] = useState(0);
  const [formData, setFormData] = useState({
    city: "",
    checkIn: "",
    checkOut: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ── slideshow ── */
  useEffect(() => {
    const id = setInterval(
      () => setCurrentImage((p) => (p + 1) % IMAGES.length),
      10000,
    );
    return () => clearInterval(id);
  }, []);

  /* ── original logic – untouched ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = () => {
    if (!formData.city?.trim()) {
      alert("Please enter city");
      return;
    }
    let query = "",
      route = "";
    if (activeTab === "hotels") {
      query = `${formData.city.trim()} hotels`;
      route = "/hotels";
    } else if (activeTab === "places") {
      query = `${formData.city.trim()} places`;
      route = "/places";
    } else if (activeTab === "cities") {
      query = formData.city.trim();
      route = "/cities";
    } else if (activeTab === "restaurants") {
      query = `${formData.city.trim()} restaurants`;
      route = "/restaurants";
    } else {
      query = formData.city.trim();
      route = "/travel";
    }
    console.log("✅ SENDING QUERY:", query);
    console.log("📍 ROUTE:", route);
    dispatch(smartSearch(query))
      .unwrap()
      .then(() => navigate(route))
      .catch((err) => console.error("API ERROR:", err));
  };

  const handleTabClick = (key) => {
    setActiveTab(key);
    const sectionMap = {
      cities: "popular-cities",
      hotels: "why-choose-us",
      places: "why-choose-us",
      restaurants: "why-choose-us",
      travel: "why-choose-us",
    };
    const el = document.getElementById(sectionMap[key]);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const { title, sub } = HEADLINE_MAP[activeTab];

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(.5); cursor:pointer; }
      `}</style>

      <section className="relative w-full min-h-screen overflow-hidden font-['DM_Sans',sans-serif] text-white">
        {/* ── Background Slideshow ── */}
        <div className="absolute inset-0">
          {IMAGES.map((img, i) => (
            <div
              key={i}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ease-in-out ${
                i === currentImage ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          {/* dramatic cinematic vignette */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,9,8,0.92)_0%,rgba(10,9,8,0.45)_50%,rgba(10,9,8,0.25)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,9,8,0.4)_0%,transparent_60%)]" />
        </div>

        {/* ── Content ── */}
        <div className="relative z-20 flex min-h-screen flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl">
            {/* ── Eyebrow ── */}
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[#3d6ef5]" />
              <span className="text-[#3d6ef5] text-[11px] font-semibold tracking-[0.18em] uppercase">
                World-Class Travel Planning
              </span>
            </div>

            {/* ── Headline ── */}
            <div
              key={activeTab}
              className="animate-[fadeUp_.7s_ease_both] mt-5"
            >
              <h1
                className="font-['Cormorant_Garamond',serif] font-light leading-[1.05] tracking-[-.01em] text-[clamp(40px,7vw,84px)]"
              >
                {title}
              </h1>
              <p
                className="mt-3 max-w-xl text-white/60 text-[clamp(14px,2vw,17px)] font-normal"
              >
                {sub}
              </p>
            </div>

            {/* ── Tab Pills ── */}
            <div className="mt-8 flex flex-wrap gap-3">
              {TABS.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => handleTabClick(key)}
                  className={[
                    "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap",
                    "border backdrop-blur-md transition-all duration-300 ease-in-out",
                    activeTab === key
                      ? "border-[#3d6ef5]/40 bg-[#3d6ef5]/15 text-white shadow-[0_12px_30px_rgba(61,110,245,0.18)]"
                      : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/25 hover:text-white",
                  ].join(" ")}
                >
                  <span className="text-base leading-none">{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* ── Search Card ── */}
            <div className="mt-10 ui-card p-5 sm:p-8 bg-black/50">
              <div className="flex flex-wrap items-end gap-0">
                {/* City */}
                <div className="flex flex-col gap-2 flex-1 min-w-[200px] max-sm:min-w-full">
                  <span className="text-[11px] font-semibold tracking-[.1em] uppercase text-white/[0.45]">
                    Destination
                  </span>
                  <div className="relative">
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/[0.35] pointer-events-none"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input
                      className="ui-input !pl-11 !pr-4 !py-3.5"
                      type="text"
                      name="city"
                      placeholder="City or destination"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="hidden md:block w-px h-12 bg-white/10 self-end mb-1 mx-6 shrink-0" />

                {/* Check-in */}
                <div className="flex flex-col gap-2 flex-1 min-w-[200px] max-sm:min-w-full">
                  <span className="text-[11px] font-semibold tracking-[.1em] uppercase text-white/[0.45]">
                    Check-in
                  </span>
                  <div className="relative">
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/[0.35] pointer-events-none"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      className="ui-input !pl-11 !pr-4 !py-3.5"
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="hidden md:block w-px h-12 bg-white/10 self-end mb-1 mx-6 shrink-0" />

                {/* Check-out */}
                <div className="flex flex-col gap-2 flex-1 min-w-[200px] max-sm:min-w-full">
                  <span className="text-[11px] font-semibold tracking-[.1em] uppercase text-white/[0.45]">
                    Check-out
                  </span>
                  <div className="relative">
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/[0.35] pointer-events-none"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      className="ui-input !pl-11 !pr-4 !py-3.5"
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="w-full sm:w-auto sm:ml-auto sm:pl-6 pt-6 shrink-0">
                  <button
                    className="ui-btn-primary w-full sm:w-auto"
                    onClick={handleSearch}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                    <span>Search</span>
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="transition-transform duration-200 group-hover:translate-x-[3px]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Stats row ── */}
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { label: "Destinations", value: "500+" },
                { label: "Happy Travellers", value: "2M+" },
                { label: "Hotels Listed", value: "12K+" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-4 py-2 text-sm text-white/80 transition-all duration-300 ease-in-out hover:bg-white/10"
                >
                  <strong className="text-white font-semibold">{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Slide Dots ── */}
        <div className="absolute bottom-7 right-8 flex gap-1.5 z-30">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`h-1.5 rounded-full cursor-pointer transition-all duration-[350ms] ${
                i === currentImage
                  ? "w-7 bg-white"
                  : "w-1.5 bg-white/[0.35] hover:bg-white/[0.65]"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
