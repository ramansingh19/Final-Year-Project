import { useEffect, useState } from "react";
import { FaBars, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getActiveCities } from "../../features/user/citySlice";
import {
  generatePlan,
  loadAiPlan,
  loadPlanHistory,
} from "../../features/user/placeSlice";
import AiPlannerDetails from "./AiPlannerDetails";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

  .aip-root * { font-family: 'Outfit', sans-serif; }
  .font-cormorant { font-family: 'Cormorant Garamond', serif !important; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseAmber {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }

  .animate-fade-up       { animation: fadeUp .5s ease both; }
  .animate-fade-up-delay { animation: fadeUp .5s .1s ease both; }
  .animate-pulse-amber   { animation: pulseAmber 2s infinite; }

  .aip-history-item::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: #c9922a;
    border-radius: 0 3px 3px 0;
    transform: scaleY(0);
    transition: transform .2s;
  }
  .aip-history-item:hover::before { transform: scaleY(1); }

  .aip-submit::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0);
    transition: background .2s;
  }
  .aip-submit:hover        { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(201,146,42,0.45); }
  .aip-submit:hover::after { background: rgba(255,255,255,0.08); }
  .aip-submit:active       { transform: translateY(0); }

  /* Sidebar overlay backdrop */
  .aip-backdrop {
    display: none;
  }
  @media (max-width: 767px) {
    .aip-sidebar-mobile-open {
      position: fixed !important;
      left: 0; top: 0; bottom: 0;
      z-index: 50;
      width: 280px !important;
    }
    .aip-backdrop {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.35);
      z-index: 40;
    }
  }
`;

function AiPlanner() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Start closed on mobile, open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  );
  const [form, setForm] = useState({ cityId: "", budget: "", days: "" });

  const { cities = [] } = useSelector((state) => state.city);
  const { planHistory = [] } = useSelector((state) => state.place);

  // Close sidebar when resizing to mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getActiveCities());
    dispatch(loadPlanHistory());
    let history = JSON.parse(localStorage.getItem("planHistory")) || [];
    const now = Date.now();
    history = history.filter((item) => now - item.id < 24 * 60 * 60 * 1000);
    localStorage.setItem("planHistory", JSON.stringify(history));
  }, [dispatch]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.cityId || !form.budget || !form.days) {
      alert("Please fill all fields");
      return;
    }
    dispatch(
      generatePlan({
        cityId: form.cityId,
        budget: Number(form.budget),
        days: Number(form.days),
      }),
    ).then((res) => {
      if (res.payload)
        navigate("/AiPlanner-details", { state: { plan: res.payload } });
    });
  };

  const handleHistoryClick = (plan) => {
    dispatch(loadAiPlan(plan));
    navigate("/AiPlanner-details", { state: { plan } });
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleDelete = (id) => {
    let history = JSON.parse(localStorage.getItem("planHistory")) || [];
    history = history.filter((item) => item.id !== id);
    localStorage.setItem("planHistory", JSON.stringify(history));
    dispatch(loadPlanHistory());
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ROOT */}
      <div className="aip-root h-screen flex overflow-hidden bg-[#f5f5f5] text-[#1f1f1f]">
        {/* Mobile backdrop — closes sidebar on tap */}
        {sidebarOpen && <div className="aip-backdrop" onClick={closeSidebar} />}

        {/* ── SIDEBAR ── */}
        <aside
          className={`
            bg-white shadow-[4px_0_10px_rgba(0,0,0,0.05)] border-r border-black/10
            shrink-0 flex flex-col transition-all duration-300 ease-in-out
            overflow-hidden
            ${
              sidebarOpen
                ? "w-70 md:w-75 aip-sidebar-mobile-open"
                : "w-0"
            }
          `}
        >
          {/* Header */}
          <div className="px-5 pt-6 pb-4 border-b border-black/10">
            <div className="text-[10px] tracking-[.18em] uppercase text-[#f59e0b] font-semibold mb-1">
              AI Planner
            </div>
            <div className="font-cormorant text-[20px] font-semibold text-[#1f1f1f]">
              Trip History
            </div>
          </div>

          {/* Scroll area */}
          <div className="flex-1 overflow-y-auto px-3 pt-4 pb-6 [scrollbar-width:thin] [scrollbar-color:#e0e0e0_transparent]">
            {planHistory.length === 0 ? (
              <div className="mt-6 border border-dashed border-black/10 rounded-[14px] p-5 text-center">
                <div className="text-[26px] mb-2 opacity-50 animate-pulse">
                  🗺️
                </div>
                <p className="text-[12px] text-[#6b7280] leading-relaxed">
                  No history yet.
                  <br />
                  Generate your first plan and it will appear here.
                </p>
              </div>
            ) : (
              planHistory.map((item) => (
                <div
                  key={item.id}
                  className="aip-history-item flex items-center gap-2 px-3 py-3 mb-2 rounded-[14px] border border-black/10 cursor-pointer relative overflow-hidden transition-all duration-200 hover:bg-[#fef3c7] hover:border-[#f59e0b]/30"
                >
                  <div className="w-8 h-8 rounded-[10px] bg-[#f59e0b]/12 grid place-items-center shrink-0 text-[13px]">
                    ✈️
                  </div>
                  <div
                    className="flex-1 min-w-0"
                    onClick={() => handleHistoryClick(item.plan)}
                  >
                    <div className="text-[12px] font-medium text-[#1f1f1f] truncate">
                      {item.plan[0]?.places?.[0]?.name || "Trip Plan"}
                    </div>
                    <div className="text-[11px] text-[#6b7280] mt-0.5">
                      {item.plan.length} Day{item.plan.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="shrink-0 p-1.5 text-[#9ca3af] hover:text-red-400 transition-colors"
                    aria-label="Delete"
                  >
                    <FaTrash size={11} />
                  </button>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* TOPBAR */}
          <div className="flex items-center gap-3 px-4 sm:px-6 md:px-8 py-3.5 border-b border-black/10 bg-white/70 backdrop-blur-md shrink-0">
            <button
              className="w-9 h-9 grid place-items-center rounded-[10px] border border-black/10 bg-white text-[#1f1f1f] cursor-pointer transition-all duration-200 hover:border-[#f59e0b] hover:bg-[#f59e0b]/10 shrink-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <FaBars size={13} />
            </button>

            <div className="min-w-0">
              <div className="font-cormorant text-[20px] sm:text-[24px] font-semibold text-[#1f1f1f] leading-[1.1] truncate">
                AI Travel Planner
              </div>
              <div className="hidden sm:block text-[11px] text-[#6b7280] mt-0.5 font-light tracking-[.02em]">
                Day-by-day itineraries crafted for your city, budget & pace
              </div>
            </div>

            <button
              className="ml-auto w-10 h-9 grid place-items-center rounded-[10px] border border-black/10 bg-transparent text-[#f5efe6] cursor-pointer transition-all duration-200 hover:border-[#c9922a] hover:bg-[#c9922a]/8 shrink-0"
              onClick={() => navigate("/assistantChat")}
              aria-label="Open AI Assistant"
              title="Chat with AI Assistant"
            >
              <img
                src="/robot.png"
                alt="AI Assistant"
                className="w-8 h-7 object-contain"
              />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 [scrollbar-width:thin] [scrollbar-color:#e0e0e0_transparent] bg-linear-to-b from-[#fefce8] to-[#fdfaf6]">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              {/* FORM CARD */}
              <form
                className="animate-fade-up bg-white border border-black/10 rounded-[20px] px-5 sm:px-7 md:px-8 py-6 sm:py-8 shadow-[0_0_40px_rgba(245,158,11,0.15)] transition-transform hover:-translate-y-0.5"
                onSubmit={handleSubmit}
              >
                <div className="text-[10px] tracking-[.18em] uppercase text-[#f59e0b] font-semibold mb-2">
                  ✦ New Itinerary
                </div>
                <div className="font-cormorant text-[26px] sm:text-[30px] md:text-[32px] font-semibold text-[#1f1f1f] leading-[1.15] mb-1.5">
                  Plan your
                  <br />
                  next journey
                </div>
                <div className="text-[12px] sm:text-[13px] text-[#6b7280] mb-6 leading-relaxed">
                  Share your destination, budget, and trip length — we'll handle
                  the rest.
                </div>

                {/* City */}
                <div className="mb-4">
                  <label className="block text-[11px] tracking-widest uppercase font-semibold text-[#6b7280] mb-2">
                    Destination City
                  </label>
                  <select
                    className="w-full bg-[#f9fafb] border border-black/10 text-[#1f1f1f] px-4 py-3 rounded-xl text-[14px] outline-none cursor-pointer appearance-none transition-all duration-200 focus:border-[#f59e0b] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.12)] [&>option]:bg-white"
                    value={form.cityId}
                    onChange={(e) =>
                      setForm({ ...form, cityId: e.target.value })
                    }
                  >
                    <option value="">Choose a city…</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget + Days — 2 cols on all sizes, just adjust gap */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="mb-4">
                    <label className="block text-[11px] tracking-widest uppercase font-semibold text-[#6b7280] mb-2">
                      Budget (₹)
                    </label>
                    <input
                      className="w-full bg-[#f9fafb] border border-black/10 text-[#1f1f1f] px-3 py-3 rounded-xl text-[13px] outline-none transition-all duration-200 placeholder:text-[#9ca3af]/60 focus:border-[#f59e0b] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.12)]"
                      type="number"
                      placeholder="e.g. 15000"
                      value={form.budget}
                      onChange={(e) =>
                        setForm({ ...form, budget: e.target.value })
                      }
                      min={0}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-[11px] tracking-widest uppercase font-semibold text-[#6b7280] mb-2">
                      Duration
                    </label>
                    <input
                      className="w-full bg-[#f9fafb] border border-black/10 text-[#1f1f1f] px-3 py-3 rounded-xl text-[13px] outline-none transition-all duration-200 placeholder:text-[#9ca3af]/60 focus:border-[#f59e0b] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.12)]"
                      type="number"
                      placeholder="Days"
                      value={form.days}
                      onChange={(e) =>
                        setForm({ ...form, days: e.target.value })
                      }
                      min={1}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="aip-submit w-full mt-5 px-6 py-3.5 border-none rounded-xl bg-linear-to-br from-[#f59e0b] to-[#fcd34d] text-[#1f1f1f] text-[14px] font-semibold tracking-[.04em] cursor-pointer shadow-[0_4px_24px_rgba(245,158,11,0.3)] relative overflow-hidden transition-all duration-200 hover:scale-[1.02]"
                >
                  Generate My Itinerary →
                </button>

                <div className="mt-3.5 text-[11px] text-[#6b7280] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shrink-0" />
                  Plans are saved for 24 hours in your History panel.
                </div>
              </form>

              {/* PREVIEW PANEL */}
              <div className="animate-fade-up-delay bg-white border border-black/10 rounded-[20px] overflow-hidden h-[50vh] sm:h-[60vh] lg:h-[78vh] flex flex-col shadow-[0_0_40px_rgba(245,158,11,0.08)]">
                <div className="px-5 pt-4 pb-3.5 border-b border-black/10 flex items-center gap-2.5">
                  <div className="animate-pulse-amber w-2 h-2 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]" />
                  <span className="text-[12px] sm:text-[13px] font-medium text-[#1f1f1f] tracking-[.04em]">
                    Live Itinerary Preview
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#e0e0e0_transparent]">
                  <AiPlannerDetails embedded />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default AiPlanner;
