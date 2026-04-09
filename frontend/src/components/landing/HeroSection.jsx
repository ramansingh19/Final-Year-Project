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
  cities: { title: "Discover Your Next City", sub: "Explore urban wonders around the globe" },
  hotels: { title: "Stay in Luxury", sub: "Hand-picked hotels for every journey" },
  places: { title: "Find Hidden Gems", sub: "Off-the-beaten-path destinations await" },
  restaurants: { title: "Taste the World", sub: "Authentic flavours at every destination" },
  travel: { title: "The World is Yours", sub: "Plan the adventure of a lifetime" },
};

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("cities");
  const [currentImage, setCurrentImage] = useState(0);
  const [formData, setFormData] = useState({ city: "", checkIn: "", checkOut: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Slideshow
  useEffect(() => {
    const id = setInterval(() => setCurrentImage((p) => (p + 1) % IMAGES.length), 10000);
    return () => clearInterval(id);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = () => {
    if (!formData.city?.trim()) return alert("Please enter city");

    let query = "", route = "";
    if (activeTab === "hotels") { query = `${formData.city.trim()} hotels`; route = "/hotels"; }
    else if (activeTab === "places") { query = `${formData.city.trim()} places`; route = "/places"; }
    else if (activeTab === "cities") { query = formData.city.trim(); route = "/cities"; }
    else if (activeTab === "restaurants") { query = `${formData.city.trim()} restaurants`; route = "/restaurants"; }
    else { query = formData.city.trim(); route = "/travel"; }

    dispatch(smartSearch(query))
      .unwrap()
      .then(() => navigate(route))
      .catch((err) => console.error("API ERROR:", err));
  };

  const handleTabClick = (key) => {
    setActiveTab(key);
    const sectionMap = { cities: "popular-cities", hotels: "why-choose-us", places: "why-choose-us", restaurants: "why-choose-us", travel: "why-choose-us" };
    const el = document.getElementById(sectionMap[key]);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const { title, sub } = HEADLINE_MAP[activeTab];

  return (
    <section className="relative w-full min-h-screen overflow-hidden font-sans text-gray-900 bg-gray-50">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {IMAGES.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1200 ease-in-out ${i === currentImage ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="absolute inset-0 bg-linear-to-t from-gray-50/10 via-gray-50/10 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-gray-50/10 via-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex min-h-screen flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-black" />
            <span className="text-black text-xs font-semibold tracking-widest uppercase">World-Class Travel Planning</span>
          </div>

          {/* Headline */}
          <div key={activeTab} className="animate-fadeUp mt-5">
            <h1 className="font-serif font-light leading-[1.05] text-gray-900 text-[clamp(40px,7vw,84px)]">{title}</h1>
            <p className="mt-3 max-w-xl text-black text-[clamp(14px,2vw,17px)]">{sub}</p>
          </div>

          {/* Tabs */}
          <div className="mt-8 flex flex-wrap gap-3">
            {TABS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => handleTabClick(key)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium border backdrop-blur-md transition-all duration-300 ease-in-out ${
                  activeTab === key
                    ? "bg-blue-100 border-blue-200 text-blue-800 shadow-lg"
                    : "bg-white/50 border-gray-300 text-gray-700 hover:bg-white/70 hover:border-gray-400"
                }`}
              >
                <span className="text-base leading-none">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Search Card */}
          <div className="mt-10 bg-white/90 p-6 sm:p-8 rounded-lg shadow-md flex flex-wrap gap-4 items-end">
            {/* Destination */}
            <div className="flex flex-col gap-2 flex-1 min-w-50">
              <span className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Destination</span>
              <div className="relative">
                <input
                  type="text"
                  name="city"
                  placeholder="City or destination"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
              </div>
            </div>

            {/* Check-in */}
            <div className="flex flex-col gap-2 flex-1 min-w-50">
              <span className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Check-in</span>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              />
            </div>

            {/* Check-out */}
            <div className="flex flex-col gap-2 flex-1 min-w-50">
              <span className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Check-out</span>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              />
            </div>

            {/* Search Button */}
            <div className="w-full sm:w-auto sm:ml-auto">
              <button
                onClick={handleSearch}
                className="bg-[linear-gradient(135deg,#c67c4e_0%,#b86c3d_100%)] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-[0_10px_24px_rgba(198,124,78,0.28)] border border-[#d8a07a]/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_16px_36px_rgba(198,124,78,0.4)] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { label: "Destinations", value: "500+" },
              { label: "Happy Travellers", value: "2M+" },
              { label: "Hotels Listed", value: "12K+" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white/50 px-4 py-2 text-sm text-gray-700 hover:bg-white/70 transition"
              >
                <strong className="font-semibold text-gray-900">{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Dots */}
        <div className="absolute bottom-7 right-8 flex gap-1.5 z-30">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                i === currentImage ? "w-7 bg-blue-500" : "w-1.5 bg-gray-400 hover:bg-gray-600"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}