import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  RefreshCcw,
  Search,
  Wallet
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPendingPayouts, markPayoutDone } from "../../../features/user/bookingSlice";

const PAGE_SIZE = 6;

const PayoutDashboard = () => {
  const dispatch = useDispatch();
  const { bookings, loading, actionLoading } = useSelector(
    (state) => state.booking
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getPendingPayouts());
  }, [dispatch]);

  // 🔍 Filter + Search
  const filteredData = useMemo(() => {
    let data = bookings || [];

    if (statusFilter !== "all") {
      data = data.filter((b) => b.payoutStatus === statusFilter);
    }

    if (search.trim()) {
      data = data.filter(
        (b) =>
          b.refNo.toLowerCase().includes(search.toLowerCase()) ||
          (b.name && b.name.toLowerCase().includes(search.toLowerCase()))
      );
    }

    return data;
  }, [bookings, search, statusFilter]);

  // 📄 Pagination
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // 💰 Stats
  const totalPending = bookings
    .filter((b) => b.payoutStatus === "pending")
    .reduce((acc, b) => acc + (b.hotelAmount || 0), 0);

  const totalCommission = bookings.reduce(
    (acc, b) => acc + (b.commission || 0),
    0
  );

  const totalProcessed = bookings
    .filter((b) => b.payoutStatus === "processed")
    .reduce((acc, b) => acc + (b.hotelAmount || 0), 0);

  const handlePayout = (refNo) => {
    dispatch(markPayoutDone({ refNo }));
  };

  const handleRefresh = () => {
    dispatch(getPendingPayouts());
  };

  // 📥 Export CSV
  const exportCSV = () => {
    const headers = [
      "RefNo",
      "Customer",
      "Total",
      "Commission",
      "VendorAmount",
      "Status",
    ];

    const rows = filteredData.map((b) => [
      b.refNo,
      b.name,
      b.payment?.finalAmount,
      b.commission,
      b.hotelAmount,
      b.payoutStatus,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `payouts_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 md:p-8 min-h-screen bg-slate-50/50"
    >
      {/* ─── Header ───────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
            <span>Finance</span>
            <span className="h-1 w-1 bg-slate-300 rounded-full" />
            <span className="text-indigo-600">Payouts Dashboard</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Settlements & Revenue
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Monitor vendor payouts and track platform commission across all bookings.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm group"
            title="Refresh Data"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? "animate-spin" : "group-active:rotate-180 transition-transform duration-500"}`} />
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* ─── Stats Cards ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Pending Settlement"
          value={totalPending}
          icon={<Clock className="w-6 h-6 text-amber-600" />}
          trend="Action Required"
          color="amber"
        />
        <StatsCard
          title="Platform Revenue"
          value={totalCommission}
          icon={<ArrowUpRight className="w-6 h-6 text-indigo-600" />}
          trend="Total Earnings"
          color="indigo"
        />
        <StatsCard
          title="Processed Payouts"
          value={totalProcessed}
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
          trend="Successfully Paid"
          color="emerald"
        />
      </div>

      {/* ─── Filter Bar ───────────────── */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <label htmlFor="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-4 h-4" />
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search Reference or Name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="items-center gap-2 text-sm text-slate-500 mr-2 hidden sm:flex">
            <Filter className="w-4 h-4" />
            <span>Filter:</span>
          </div>
          <select
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer w-full md:w-auto min-w-35"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Payouts</option>
            <option value="pending">Pending Only</option>
            <option value="processed">Processed Only</option>
          </select>
        </div>
      </div>

      {/* ─── Table ───────────────── */}
      <div className="bg-white shadow-xl shadow-slate-200/60 rounded-2xl overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          {loading && bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-slate-500 font-medium">Fetching settlement data...</p>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <AlertCircle className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-medium">No payouts found matching your criteria</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Ref Number</th>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Amount Summary</th>
                  <th className="px-6 py-4">Payout Split</th>
                  <th className="px-6 py-4">Settlement Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {paginatedData.map((b) => (
                    <motion.tr
                      key={b.refNo}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-slate-900 font-medium bg-slate-100 px-2 py-1 rounded text-[13px]">
                          #{b.refNo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">{b.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-bold">
                            ₹{(b.payment?.finalAmount || 0).toLocaleString("en-IN")}
                          </span>
                          <span className="text-[11px] text-slate-500">Gross Total</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 justify-between max-w-35">
                            <span className="text-[11px] text-slate-400 uppercase font-black">Admin</span>
                            <span className="text-[13px] text-indigo-600 font-bold">
                              ₹{(b.commission || 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 justify-between max-w-35">
                            <span className="text-[11px] text-slate-400 uppercase font-black">Vendor</span>
                            <span className="text-[13px] text-emerald-600 font-bold">
                              ₹{(b.hotelAmount || 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[13px] text-slate-600 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(b.confirmedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={b.payoutStatus} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {b.payoutStatus === "pending" ? (
                            <button
                              onClick={() => handlePayout(b.refNo)}
                              disabled={actionLoading}
                              className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-105"
                            >
                              <Wallet className="w-3 h-3" />
                              Pay Now
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                              <CheckCircle2 className="w-3 h-3" />
                              <span className="text-[11px] font-bold">Settled</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>

        {/* ─── Footer / Pagination ───────────────── */}
        <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{paginatedData.length}</span> of{" "}
            <span className="font-semibold text-slate-700">{filteredData.length}</span> entries
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:hover:shadow-none transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1 mx-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`min-w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "text-slate-600 hover:bg-white border border-transparent hover:border-slate-200"
                    }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:hover:shadow-none transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 🔹 Small Components
const StatsCard = ({ title, value, icon, trend, color }) => {
  const colorMap = {
    amber: "from-amber-50 to-orange-50 text-amber-900 border-amber-100 shadow-amber-100/50",
    indigo: "from-indigo-50 to-blue-50 text-indigo-900 border-indigo-100 shadow-indigo-100/50",
    emerald: "from-emerald-50 to-teal-50 text-emerald-900 border-emerald-100 shadow-emerald-100/50",
  };

  return (
    <div className={`bg-linear-to-br ${colorMap[color]} shadow-lg rounded-3xl p-6 border flex flex-col justify-between relative overflow-hidden group`}>
      <div className="absolute right-[-10%] top-[-10%] opacity-5 group-hover:scale-125 transition-transform duration-700">
        {icon}
      </div>

      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100/20 ring-4 ring-white/30">
          {icon}
        </div>
        <div className="px-2.5 py-1 bg-white/60 backdrop-blur-md border border-white/50 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm">
          {trend}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-black mb-1 tracking-tight">
          ₹{value.toLocaleString("en-IN")}
        </h2>
        <p className="text-xs font-bold uppercase opacity-60 tracking-wider">
          {title}
        </p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  if (status === "pending")
    return (
      <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 w-fit">
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-[11px] font-bold uppercase tracking-wide">Processing</span>
      </div>
    );

  return (
    <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 w-fit">
      <div className="w-2 h-2 rounded-full bg-emerald-500" />
      <span className="text-[11px] font-bold uppercase tracking-wide">Settled</span>
    </div>
  );
};

export default PayoutDashboard;