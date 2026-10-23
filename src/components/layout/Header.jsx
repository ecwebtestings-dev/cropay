import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";

import UseTheme from "../../hooks/UseThemes";
import NotificationBell from "../../pages/admin/Notifications";

const iconBtn =
  "relative rounded-xl p-2.5 text-body transition-colors hover:bg-card hover:text-heading " +
  "focus-visible:outline-2 focus-visible:outline-highlight";

const menuItemStyle =
  "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-body transition-colors " +
  "hover:bg-card hover:text-heading focus-visible:outline-2 focus-visible:outline-highlight";

// PROFILE INITIALS
const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export default function Header({
  user,
  title = "Dashboard",
  subtitle = "Manage your workspace here",
  onMenuClick,
  onProfile,
  onSettings,
  onLogout,
}) {
  // COLOR THEME
  const { isDark, ToggleTheme } = UseTheme();

  // PROFILE MENU
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const choose = (handler) => () => {
    setMenuOpen(false);
    handler?.();
  };

  // USER DETAILS
  const fullName = user?.name?.trim() || "";
  const userEmail = user?.email?.trim().toLowerCase() || "";
  const displayName = fullName.split(/\s+/)[0] || "";
  const displayRole = user?.role || "";

  return (
    <header className="relative z-30 ml-1.5 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-bg px-3 sm:gap-4 sm:px-6">
      {/* LEFT SECTION */}
      <div className="flex min-w-0 items-center gap-1 sm:gap-3">
        {/* MOBILE SIDEBAR BUTTON */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className={`${iconBtn} shrink-0 md:hidden`}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* PAGE TITLE */}
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

      {/* RIGHT SECTION */}
      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        {/* DESKTOP THEME BUTTON */}
        <button
          type="button"
          onClick={ToggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className={`${iconBtn} hidden md:inline-flex`}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* NOTIFICATION BELL  */}
        <NotificationBell />

        {/* USER PROFILE MENU */}
        <div ref={menuRef} className="relative ml-1 pl-2 sm:ml-2 sm:pl-4">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            className="flex cursor-pointer items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-highlight sm:gap-3"
          >
            {/* MOBILE AVATAR */}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar text-xs font-semibold text-white md:hidden">
              {getInitials(fullName) || <User size={16} />}
            </span>

            {/* DESKTOP NAME AND ROLE */}
            <span className="hidden text-left leading-tight md:block">
              <span className="block max-w-40 truncate text-sm font-semibold text-heading">
                {displayName}
              </span>

              {displayRole && (
                <span className="block text-xs capitalize text-muted">
                  {displayRole.replace("_", " ")}
                </span>
              )}
            </span>

            <ChevronDown
              className={`hidden h-4 w-4 text-muted transition-transform duration-200 md:block ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* PROFILE DROPDOWN */}
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-3 w-44 max-w-[calc(100vw-1rem)] rounded-md border border-border bg-bg p-1"
            >
              {/* USER DETAILS ON MOBILE */}
              <div className="mb-1  px-3 py-2 md:hidden">
                <p className="truncate text-sm font-medium text-heading">
                  {fullName || "User"}
                </p>
                <p className="truncate text-xs text-muted">{userEmail}</p>
                {displayRole && (
                  <p className="mt-1 text-xs capitalize text-muted">
                    {displayRole.replace("_", " ")}
                  </p>
                )}
              </div>

              {/* MOBILE THEME TOGGLE */}
              <button
                type="button"
                role="menuitem"
                onClick={choose(ToggleTheme)}
                className={`${menuItemStyle} md:hidden`}
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-accent" />
                ) : (
                  <Moon className="h-4 w-4 text-accent" />
                )}
                {isDark ? "Light mode" : "Dark mode"}
              </button>

              {/* PROFILE */}
              <button
                type="button"
                role="menuitem"
                onClick={choose(onProfile)}
                className={menuItemStyle}
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
                  className={menuItemStyle}
                >
                  <Settings className="h-4 w-4 text-muted" />
                  Settings
                </button>
              )}

              {/* LOG OUT */}
              <div className="my-1" />

              <button
                type="button"
                role="menuitem"
                onClick={choose(onLogout)}
                className={`${menuItemStyle} hover:cursor-pointer`}
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
