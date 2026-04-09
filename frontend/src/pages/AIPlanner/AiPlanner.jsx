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

/* ── Only pseudo-elements, keyframes & font import stay here ── */
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

  /* Left accent bar on history item — needs ::before */
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

  /* Shine overlay on submit button — needs ::after */
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
`;

function AiPlanner() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [form, setForm] = useState({ cityId: "", budget: "", days: "" });

  const { cities = [] } = useSelector((state) => state.city);
  const { planHistory = [] } = useSelector((state) => state.place);

  useEffect(() => {
    dispatch(getActiveCities());
    dispatch(loadPlanHistory());
    let history = JSON.parse(localStorage.getItem("planHistory")) || [];
    const now = Date.now();
    history = history.filter((item) => now - item.id < 24 * 60 * 60 * 1000);
    localStorage.setItem("planHistory", JSON.stringify(history));
  }, [dispatch]);

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
  };

  const handleDelete = (id) => {
    let history = JSON.parse(localStorage.getItem("planHistory")) || [];
    history = history.filter((item) => item.id !== id);
    localStorage.setItem("planHistory", JSON.stringify(history));
    dispatch(loadPlanHistory());
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ROOT */}
      <div className="aip-root h-screen flex overflow-hidden bg-[#f5f5f5] text-[#1f1f1f]">
  {/* ── SIDEBAR ── */}
  <aside
    className={`bg-white shadow-[4px_0_10px_rgba(0,0,0,0.05)] border-r border-black/10 overflow-hidden shrink-0 flex flex-col transition-all duration-350 ease-in-out ${
      sidebarOpen ? "w-75" : "w-0"
    }`}
  >
    {/* Header */}
    <div className="px-6 pt-7 pb-5 border-b border-black/10">
      <div className="text-[10px] tracking-[.18em] uppercase text-[#f59e0b] font-semibold mb-1">
        AI Planner
      </div>
      <div className="font-cormorant text-[22px] font-semibold text-[#1f1f1f]">
        Trip History
      </div>
    </div>

    {/* Scroll area */}
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 [scrollbar-width:thin] [scrollbar-color:#e0e0e0_transparent]">
      {planHistory.length === 0 ? (
        <div className="mt-6 border border-dashed border-black/10 rounded-[14px] p-6 text-center">
          <div className="text-[28px] mb-2.5 opacity-50 animate-pulse">🗺️</div>
          <p className="text-[13px] text-[#6b7280] leading-relaxed">
            No history yet.
            <br />
            Generate your first plan and it will appear here.
          </p>
        </div>
      ) : (
        planHistory.map((item) => (
          <div
            key={item.id}
            className="aip-history-item flex items-center gap-2.5 px-3.5 py-3.5 mb-2 rounded-[14px] border border-black/10 cursor-pointer relative overflow-hidden transition-all duration-200 hover:bg-[#fef3c7] hover:border-[#f59e0b]/30 hover:translate-x-0.5"
          >
            <div className="w-8.5 h-8.5 rounded-[10px] bg-[#f59e0b]/12 grid place-items-center shrink-0 text-[14px]">
              ✈️
            </div>
            <div
              className="flex-1 min-w-0"
              onClick={() => handleHistoryClick(item.plan)}
            >
              <div className="text-[13px] font-medium text-[#1f1f1f] whitespace-nowrap overflow-hidden text-ellipsis max-w-37.5">
                {item.plan[0]?.places?.[0]?.name || "Trip Plan"}
              </div>
              <div className="text-[11px] text-[#6b7280] mt-0.5">
                {item.plan.length} Day{item.plan.length !== 1 ? "s" : ""}
              </div>
            </div>

            <button
              className="ml-auto w-12 h-11 grid place-items-center rounded-[10px] border border-white/[0.07] bg-transparent text-[#f5efe6] cursor-pointer transition-all duration-200 hover:border-[#c9922a] hover:bg-[#c9922a]/8"
              onClick={() => navigate("/assistantChat")}
              aria-label="Open AI Assistant"
              title="Chat with AI Assistant"
            >
              <img
                src="/robot.png"
                alt="AI Assistant"
                className="w-20 h-8 object-contain"
              />
            </button>
          </div>
        ))
      )}
    </div>
  </aside>

  {/* ── MAIN ── */}
  <main className="flex-1 flex flex-col overflow-hidden">
    {/* TOPBAR */}
    <div className="flex items-center gap-4.5 px-8 max-[900px]:px-5 py-4.5 border-b border-black/10 bg-white/70 backdrop-blur-md shrink-0">
      <button
        className="w-10 h-10 grid place-items-center rounded-[10px] border border-black/10 bg-white text-[#1f1f1f] cursor-pointer transition-all duration-200 hover:border-[#f59e0b] hover:bg-[#f59e0b]/10"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <FaBars size={14} />
      </button>

      <div>
        <div className="font-cormorant text-[24px] font-semibold text-[#1f1f1f] leading-[1.1]">
          AI Travel Planner
        </div>
        <div className="text-[12px] text-[#6b7280] mt-0.5 font-light tracking-[.02em]">
          Day-by-day itineraries crafted for your city, budget & pace
        </div>
      </div>

      <span className="ml-auto text-[10px] tracking-[.12em] uppercase font-semibold text-[#b45309] bg-[#fcd34d]/12 border border-[#f59e0b]/25 px-3 py-1.25 rounded-full animate-pulse">
        ✦ Powered by AI
      </span>
    </div>

    {/* CONTENT */}
    <div className="flex-1 overflow-y-auto p-8 max-[900px]:p-5 [scrollbar-width:thin] [scrollbar-color:#e0e0e0_transparent] bg-linear-to-b from-[#fefce8] to-[#fdfaf6]">
      <div className="max-w-275 mx-auto grid grid-cols-2 max-[900px]:grid-cols-1 gap-6 items-start">
        {/* FORM CARD */}
        <form
          className="animate-fade-up bg-white border border-black/10 rounded-[20px] px-8 py-9 shadow-[0_0_40px_rgba(245,158,11,0.15)] transition-transform hover:-translate-y-1"
          onSubmit={handleSubmit}
        >
          <div className="text-[10px] tracking-[.18em] uppercase text-[#f59e0b] font-semibold mb-2">
            ✦ New Itinerary
          </div>
          <div className="font-cormorant text-[32px] font-semibold text-[#1f1f1f] leading-[1.15] mb-1.5">
            Plan your
            <br />
            next journey
          </div>
          <div className="text-[13px] text-[#6b7280] mb-8 leading-relaxed">
            Share your destination, budget, and trip length —
            <br />
            we'll handle the rest.
          </div>

          {/* City */}
          <div className="mb-5">
            <label className="block text-[11px] tracking-widest uppercase font-semibold text-[#6b7280] mb-2">
              Destination City
            </label>
            <select
              className="w-full bg-[#f9fafb] border border-black/10 text-[#1f1f1f] px-4 py-3.5 rounded-xl text-[14px] outline-none cursor-pointer appearance-none transition-all duration-200 focus:border-[#f59e0b] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.12)] [&>option]:bg-white"
              value={form.cityId}
              onChange={(e) => setForm({ ...form, cityId: e.target.value })}
            >
              <option value="">Choose a city…</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Budget + Days */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="mb-5">
              <label className="block text-[11px] tracking-widest uppercase font-semibold text-[#6b7280] mb-2">
                Budget (₹)
              </label>
              <input
                className="w-full bg-[#f9fafb] border border-black/10 text-[#1f1f1f] px-4 py-3.5 rounded-xl text-[14px] outline-none transition-all duration-200 placeholder:text-[#9ca3af]/60 focus:border-[#f59e0b] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.12)]"
                type="number"
                placeholder="e.g. 15000"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                min={0}
              />
            </div>
            <div className="mb-5">
              <label className="block text-[11px] tracking-widest uppercase font-semibold text-[#6b7280] mb-2">
                Trip Duration
              </label>
              <input
                className="w-full bg-[#f9fafb] border border-black/10 text-[#1f1f1f] px-4 py-3.5 rounded-xl text-[14px] outline-none transition-all duration-200 placeholder:text-[#9ca3af]/60 focus:border-[#f59e0b] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.12)]"
                type="number"
                placeholder="Days"
                value={form.days}
                onChange={(e) => setForm({ ...form, days: e.target.value })}
                min={1}
              />
            </div>
          </div>

          <button
            type="submit"
            className="aip-submit w-full mt-7 px-6 py-3.75 border-none rounded-xl bg-linear-to-br from-[#f59e0b] to-[#fcd34d] text-[#1f1f1f] text-[14px] font-semibold tracking-[.04em] cursor-pointer shadow-[0_4px_24px_rgba(245,158,11,0.3)] relative overflow-hidden transition-all duration-200 hover:scale-[1.02]"
          >
            Generate My Itinerary →
          </button>

          <div className="mt-4 text-[12px] text-[#6b7280] flex items-center gap-1.5">
            <span className="w-1.25 h-1.25 rounded-full bg-[#f59e0b] shrink-0" />
            Plans are saved for 24 hours in your History panel.
          </div>
        </form>

        {/* PREVIEW PANEL */}
        <div className="animate-fade-up-delay bg-white border border-black/10 rounded-[20px] overflow-hidden h-[78vh] flex flex-col shadow-[0_0_40px_rgba(245,158,11,0.08)]">
          <div className="px-6 pt-5 pb-4 border-b border-black/10 flex items-center gap-2.5">
            <div className="animate-pulse-amber w-2 h-2 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]" />
            <span className="text-[13px] font-medium text-[#1f1f1f] tracking-[.04em]">
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
