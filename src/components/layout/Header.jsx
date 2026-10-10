import { useState, useEffect, useRef } from "react";
import { Bell, ChevronDown, LogOut, Menu, Moon, Settings, Sun, User } from "lucide-react";

const iconBtn =
  "relative p-2.5 rounded-xl text-body hover:bg-bg hover:text-heading transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-highlight";

const menuItemStyle =
  "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-highlight";

const user = {
  name: "Joel Econi",
  role: "Administrator",
  avatar: "https://images.unsplash.com/photo-1457449940276-e8deed18bfff?w=200&auto=format&fit=crop&q=60",
};

export default function Header({ onMenuClick, onProfile, onSettings, onLogout }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [isDark]);

  // PROFILE MENU
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onEscape = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("touchstart", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("touchstart", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen]);

  const choose = (handler) => () => {
    setMenuOpen(false);
    handler?.();
  };

  return (
    <header className="relative z-20 h-16 shrink-0 flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 bg-card border-b border-border">
      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-1 sm:gap-3">
        {/* Hamburger: opens the sidebar drawer on mobile */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className={`${iconBtn} md:hidden shrink-0`}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold leading-tight text-heading truncate">
            Dashboard
          </h1>
          <p className="hidden md:block text-sm text-muted truncate">
            Manage your workspace here
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        <button
          onClick={() => setIsDark((d) => !d)}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className={iconBtn}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* NOTIFICATIONS */}
        <button aria-label="Notifications (2)" className={iconBtn}>
          <Bell className="w-5 h-5" />
          <span
            className="absolute top-1 right-1 min-w-4 h-4 px-1 flex items-center justify-center
              rounded-full bg-red-500 text-white text-[10px] font-semibold leading-none ring-2 ring-card"
          >
            2
          </span>
        </button>

        {/* USER PROFILE */}
        <div ref={menuRef} className="relative ml-1 sm:ml-2 pl-2 sm:pl-4">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Open profile menu"
            className="flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-highlight"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="hidden md:block text-left">
              <span className="block text-sm font-semibold leading-tight text-heading">{user.name}</span>
              <span className="block text-xs text-muted">{user.role}</span>
            </span>
            <ChevronDown
              className={`hidden md:block w-4 h-4 text-muted transition-transform duration-200 ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-3 w-56 max-w-[calc(100vw-1.5rem)] p-1.5 rounded-xl bg-card border border-border shadow-lg"
            >
              {/* Name + role: hidden on desktop where they sit next to the avatar */}
              <div className="md:hidden px-3 py-2 mb-1 border-b border-border">
                <p className="truncate text-sm font-semibold text-heading">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.role}</p>
              </div>

              <button
                role="menuitem"
                onClick={choose(onProfile)}
                className={`${menuItemStyle} text-body hover:bg-bg hover:text-heading`}
              >
                <User className="w-4 h-4 text-accent" />
                My profile
              </button>
              <button
                role="menuitem"
                onClick={choose(onSettings)}
                className={`${menuItemStyle} text-body hover:bg-bg hover:text-heading`}
              >
                <Settings className="w-4 h-4 text-accent" />
                Settings
              </button>

              <div className="my-1" />

              <button
                role="menuitem"
                onClick={choose(onLogout)}
                className={`${menuItemStyle} text-slate-500 hover:bg-slate-500/10`}
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}