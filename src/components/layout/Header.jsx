import { useState, useEffect, useRef } from "react";
import { Bell, ChevronDown, Menu, Moon, Sun } from "lucide-react";
import UseTheme from "../../hooks/UseThemes";

const iconBtn =
  "relative p-2.5 rounded-xl text-body hover:bg-bg hover:text-heading transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-highlight";

const menuItemStyle =
  "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-highlight";


//PROFILE INITIALS
  const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";
 

export default function Header({ 
  user,
  onMenuClick,
  onProfile, 
  onSettings,
  unreadCount= 0,
  onNotifications,
  onLogout, 
}) {
 
 
  //COLOR THEME
  const {isDark,ToggleTheme}=UseTheme();

  // PROFILE MENU
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => { if (!menuOpen) return;
    
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

  //PLACEHOLDER
  const displayName = user?.name || "CropPay User";
  const displayRole = user?.role || "";

  return (
    <header className="relative z-20 h-16 shrink-0 flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 bg-card border-b border-border">
     
      <div className="flex min-w-0 items-center gap-1 sm:gap-3">
        
        {/*HAMBURGER MENU*/}
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
          onClick={ToggleTheme}
          aria-label={isDark ? "light mode" : "dark mode"}
          className={`${iconBtn} hidden md:block`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>


        {/* NOTIFICATIONS */}
        <button 
          onClick={onNotifications}
          aria-label={unreadCount > 0 ?`Notifications (${unreadCount} unread)` : "Notifications"} 
          className={iconBtn}>
            <Bell className="w-5 h-5" />

            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 flex items-center justify-center
              rounded-full bg-red-500 text-white text-[10px] font-semibold leading-none ring-2 ring-card">
                {unreadCount > 9 ?"9+": unreadCount}
              </span>
            )}
        </button>


        {/* USER PROFILE */}
        <div ref={menuRef} className="relative ml-1 sm:ml-2 pl-2 sm:pl-4">
      
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            className="flex items-center cursor-pointer gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-highlight"
          >
            
            {user?.avatar?(
                <img
                  src={user.avatar}
                  alt={displayName}
                  className="w-9 h-9 rounded-full"
                />
            ):
            (
             <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar text-xs font-semibold text-white">{getInitials(displayName)}</span>
            )}
            
            <ChevronDown
              className={`hidden md:block w-4 h-4 text-muted transition-transform duration-200 ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div className=" absolute right-0 top-full mt-3 w-56 max-w-[calc(100vw-1.5rem)] p-1.5 rounded-xl bg-card border border-border shadow-lg"
            >
              {/* USERNAME AND ROLE ON MOBILE */}
              <div className="md:hidden px-3 py-2 mb-1 border-b border-border">
                <p className="truncate text-sm font-semibold text-heading">{displayName}</p>
                <p className="truncate text-xs text-muted">{displayRole}</p>
              </div>

              {/**THEME MOBILE */}
                <button
                     onClick={choose(ToggleTheme)}
                      className={`${menuItemStyle} text-body hover:bg-bg hover:text-heading md:hidden`}
                    >
                      {isDark ? <Sun className="w-4 h-4 text-accent" /> : <Moon className="w-4 h-4 text-accent" />}
                      {isDark ? "Light mode" : "Dark mode"}
                </button>

                  {/**PROFILE MOBILE */}
                <button
                  onClick={choose(onProfile)}
                  className={`${menuItemStyle} text-body hover:bg-bg hover:cursor-pointer`}
                >
                  
                  My profile
                </button>

                {/**SETTINGS */}
                {onSettings && (
                  <button onClick={choose(onSettings)}
                  className={`${menuItemStyle} text-body hover:cursor-pointer`}
                  >
                   
                  Settings
                  </button>
                )}
                

              <div className="my-1" />

              <button
                role="menuitem"
                onClick={choose(onLogout)}
                className={`${menuItemStyle} text-slate-500 hover:cursor-pointer`}
              >
                
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}