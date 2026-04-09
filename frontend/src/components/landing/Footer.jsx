export default function Footer() {
  const SOCIALS = [
    {
      label: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
      link: "#",
    },
    {
      label: "Twitter",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      ),
      link: "#",
    },
    {
      label: "Instagram",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      link: "#",
    },
    {
      label: "YouTube",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      link: "#",
    },
  ];

  return (
    <footer className="w-full bg-white/90 border-t border-gray-200 py-12 px-6 flex flex-col items-center justify-center gap-8 relative">
      {/* Social Icons */}
      <div className="flex flex-wrap items-center justify-center gap-5">
        {SOCIALS.map((social) => (
          <a
            key={social.label}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="w-12 h-12 rounded-full bg-gray-100 border border-gray-300 text-gray-700 flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-linear-to-tr hover:from-[#3d6ef5] hover:to-[#8b5cf6] hover:text-white shadow-sm hover:shadow-lg animate-fade-in"
          >
            {social.icon}
          </a>
        ))}
      </div>

      {/* Footer Text */}
      <p className="text-sm font-sans text-gray-600 text-center max-w-xs md:max-w-md tracking-wide">
        © {new Date().getFullYear()} Travel Guide. Connect with us and explore the world.
      </p>
    </footer>
  );
}