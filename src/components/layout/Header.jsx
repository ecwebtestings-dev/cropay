import { useState, useEffect, useRef } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import UseTheme from "../../hooks/UseThemes";

const iconBtn =
  "relative p-2.5 rounded-xl text-body hover:bg-bg hover:text-heading transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-highlight";

const menuItemStyle =
  "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-colors cursor-pointer " +
  "focus-visible:outline-2 focus-visible:outline-highlight";

// PROFILE INITIALS
const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "";

export default function Header({
  user,
  title = "Dashboard", 
  subtitle = "Manage your workspace here",
  onMenuClick,
  onProfile,
  onSettings,
  unreadCount = 0,
  onNotifications,
  onLogout,
}) 
{
  // COLOR THEME
  const { isDark, ToggleTheme } = UseTheme();

  // PROFILE MENU
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    // ESCAPE CLOSES THE MENU AND RETURNS FOCUS TO THE AVATAR BUTTON
    const onEscape = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

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

  // USER DETAILS
  const FullName = user?.name || "";
  const UserEmail =user?.email?.trim().toLowerCase() || "";
  const displayName = user?.name?.trim().split(/\s+/)[0] || "";
  const displayRole = user?.role || "";


  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-bg ml-1.5 px-3 sm:gap-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-1 sm:gap-3">
        {/* HAMBURGER MENU */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className={`${iconBtn} shrink-0 md:hidden`}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold leading-tight text-heading sm:text-xl">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden truncate text-sm text-muted md:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        {/* THEME */}
        <button
          type="button"
          onClick={ToggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className={`${iconBtn} hidden md:block`}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* NOTIFICATIONS */}
        <button
          type="button"
          onClick={onNotifications}
          aria-label={
            unreadCount > 0
              ? `Notifications (${unreadCount} unread)`
              : "Notifications"
          }
          className={iconBtn}
        >
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-card">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* USER PROFILE */}
        <div ref={menuRef} className="relative ml-1 pl-2 sm:ml-2 sm:pl-4">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Account menu"
            className="flex cursor-pointer items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-highlight"
          >
            
              <span
                className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-sidebar text-xs font-semibold text-white"
              >
                {getInitials(displayName)}
              </span>
           

            {/* NAME AND ROLE  */}
            <span className="hidden text-left leading-tight md:block">
              <span className="block max-w-40 truncate text-sm font-semibold text-heading">
                {displayName}
              </span>
              {displayRole && (
                <span className="block text-xs capitalize text-muted">
                  {displayRole}
                </span>
              )}
            </span>

            <ChevronDown
              className={`hidden h-4 w-4 text-muted transition-transform duration-200 md:block ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-3 w-50 max-w-[calc(100vw-1rem)] rounded-md border border-border bg-bg p-1 shadow-lg"
            >
              {/* USERNAME AND ROLE ON MOBILE */}
              <div className="mb-1 border-b border-border px-3 py-2 md:hidden">
                <p className="truncate flex md:hidden flex-col ml-5 text-xs text-muted">
                  <span>{FullName}</span>
                  <span>{UserEmail}</span>
                </p>
              </div>

              {/* THEME (MOBILE) */}
               
              <button
                type="button"
                role="menuitem"
                onClick={choose(ToggleTheme)}
                className={`${menuItemStyle} text-body hover:bg-bg hover:text-heading md:hidden`}
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-accent" />
                ) : (
                  <Moon className="h-4 w-4 text-accent" />
                )}
                {isDark ? "Light mode" : "Dark mode"}
              </button>

              {/* PROFILE */}
              <p className="hidden md:flex truncate flex-col ml-5 mt -5 text-xs text-muted">
                  <span>{FullName}</span>
                  <span>{UserEmail}</span>
                </p>
              <button
                type="button"
                role="menuitem"
                onClick={choose(onProfile)}
                className={`${menuItemStyle} text-body hover:bg-bg hover:text-heading`}
              >
                <User className="h-4 w-4 text-muted" />
                My profile
              </button>

              {/* SETTINGS */}
              {onSettings && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={choose(onSettings)}
                  className={`${menuItemStyle} text-body hover:bg-bg hover:text-heading`}
                >
                  <Settings className="h-4 w-4 text-muted" />
                  Settings
                </button>
              )}

             
              {/* LOG OUT */}
              <button
                type="button"
                role="menuitem"
                onClick={choose(onLogout)}
                className={`${menuItemStyle}text-body hover:bg-bg hover:text-heading`}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}