import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getActiveCities } from "../../features/user/citySlice";
import {
  generatePlan,
  loadAiPlan,
  loadPlanHistory,
  setAiPlan,
} from "../../features/user/placeSlice";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTrash } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";

function AiPlanner() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [form, setForm] = useState({
    cityId: "",
    budget: "",
    days: "",
  });

  const { cities = [] } = useSelector((state) => state.city);
  const { planHistory = [] } = useSelector((state) => state.place);

  useEffect(() => {
    dispatch(getActiveCities());
    dispatch(loadPlanHistory());

    // ✅ AUTO DELETE OLD HISTORY (24 HOURS)
    let history = JSON.parse(localStorage.getItem("planHistory")) || [];

    const now = Date.now();
    history = history.filter((item) => now - item.id < 24 * 60 * 60 * 1000);

    localStorage.setItem("planHistory", JSON.stringify(history));
  }, [dispatch]);

  // ✅ SEARCH
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
      })
    ).then((res) => {
      if (res.payload) {
        dispatch(setAiPlan(res.payload));

        navigate("/AiPlanner-details", {
          state: { plan: res.payload },
        });
      }
    });
  };

  // ✅ HISTORY CLICK
  const handleHistoryClick = (plan) => {
    dispatch(loadAiPlan(plan));

    navigate("/AiPlanner-details", {
      state: { plan },
    });
  };

  // ✅ DELETE SINGLE HISTORY
  const handleDelete = (id) => {
    let history = JSON.parse(localStorage.getItem("planHistory")) || [];
    history = history.filter((item) => item.id !== id);

    localStorage.setItem("planHistory", JSON.stringify(history));
    dispatch(loadPlanHistory());
  };

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">

      {/* ================= SIDEBAR ================= */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 
        ${sidebarOpen ? "w-72" : "w-0"} overflow-hidden`}
      >
        <div className="h-full flex flex-col">

          {/* Sidebar Header */}
          <div className="p-4 border-b font-bold text-lg">
            History
          </div>

          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-3">
            {planHistory.length === 0 && (
              <p className="text-sm text-gray-500">No history yet</p>
            )}

            <div className="w-full  flex items-center justify-end">
              <button onClick={() => setSidebarOpen(false)} className="text-3xl mb-3 hover:bg-red-300 rounded-full duration-300 hover:text-white cursor-pointer"><IoIosCloseCircleOutline /></button>
            </div>

            {planHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 mb-3 border rounded-lg hover:bg-blue-50 transition flex justify-between items-center"
              >
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => handleHistoryClick(item.plan)}
                >
                  <p className="font-semibold text-sm">
                    {item.plan[0]?.places?.[0]?.name || "Trip Plan"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.plan.length} Days
                  </p>
                </div>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between bg-white shadow px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-xl"
            >
              {sidebarOpen === false ? <FaBars /> : null}
            </button>

            <h1 className="text-xl font-bold">
              AI Travel Planner 🤖
            </h1>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-6">

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg space-y-5"
          >
            <h2 className="text-2xl font-bold text-center">
              Plan Your Trip
            </h2>

            <select
              value={form.cityId}
              onChange={(e) =>
                setForm({ ...form, cityId: e.target.value })
              }
              className="w-full border p-3 rounded-md"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Enter Budget ₹"
              value={form.budget}
              onChange={(e) =>
                setForm({ ...form, budget: e.target.value })
              }
              className="w-full border p-3 rounded-md"
            />

            <input
              type="number"
              placeholder="Number of Days"
              value={form.days}
              onChange={(e) =>
                setForm({ ...form, days: e.target.value })
              }
              className="w-full border p-3 rounded-md"
            />

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Generate Plan
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default AiPlanner;