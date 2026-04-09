import React from 'react'
export default function Page404({
  type = navigator.onLine ? '404' : 'offline',
}) {
  const isOffline = type === 'offline';

  return (
<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-white to-blue-100 px-6">

{/* Background Glow */}
<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_35%)] animate-fadeIn"></div>

{/* Floating Blur Orbs */}
<div className="absolute -top-20 left-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl animate-pulseSlow"></div>
<div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl animate-pulseSlow"></div>

{/* Main Card */}
<div className="relative z-10 w-full max-w-xl rounded-3xl border border-gray-200/20 bg-white/90 p-8 md:p-12 backdrop-blur-xl shadow-2xl text-center animate-fadeIn">

  {/* Icon */}
  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-gray-200/20 bg-white/30 shadow-lg">
    {isOffline ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-12 w-12 text-red-400 animate-bounce"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.364 5.636a9 9 0 10-12.728 12.728M15 12a3 3 0 11-6 0m10.5-4.5L4.5 19.5"
        />
      </svg>
    ) : (
      <div className="text-5xl font-extrabold text-indigo-600 animate-bounce">404</div>
    )}
  </div>

  {/* Title */}
  <h1 className="mt-8 text-3xl md:text-4xl font-bold text-gray-800">
    {isOffline ? 'No Internet Connection' : 'Page Not Found'}
  </h1>

  {/* Subtitle */}
  <p className="mt-4 text-sm md:text-base leading-7 text-gray-600">
    {isOffline
      ? 'It looks like your network is disconnected. Please check your internet connection and try again.'
      : "The page you're looking for doesn't exist, may have been moved, or the URL is incorrect."}
  </p>

  {/* Buttons */}
  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
    <button
      onClick={() => window.location.reload()}
      className="w-full sm:w-auto rounded-2xl bg-linear-to-r from-blue-500 via-cyan-400 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200/40 transition-all duration-300 hover:scale-105 hover:shadow-cyan-300/50 animate-fadeIn"
    >
      {isOffline ? 'Retry Connection' : 'Reload Page'}
    </button>

    <button
      onClick={() => (window.location.href = '/')}
      className="w-full sm:w-auto rounded-2xl border border-gray-300 bg-white/50 px-6 py-3 text-sm font-medium text-gray-800 transition-all duration-300 hover:border-gray-400 hover:bg-white/70 animate-fadeIn"
    >
      Go To Home
    </button>
  </div>
</div>

{/* Animations */}
<style>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn { animation: fadeIn 0.6s ease forwards; }

  @keyframes pulseSlow {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.1); opacity: 0.5; }
  }
  .animate-pulseSlow { animation: pulseSlow 4s ease-in-out infinite; }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .animate-bounce { animation: bounce 1.5s infinite; }
`}</style>
</div>
  );
}