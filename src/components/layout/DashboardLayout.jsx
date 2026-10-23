import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import SideBar from "../layout/SibeBar";
import Header from "../layout/Header";
import { PAGES, getPageIdFromPath } from "../../config/Navigation";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef(null);

  const currentPage = getPageIdFromPath(pathname);
  const page = PAGES[currentPage] ?? PAGES.dashboard;

  const goTo = (id) => {
    const target = PAGES[id];
    if (target) navigate(target.path);
  };

  //LOGOUT
  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      /* already cleared locally */
    }
  };

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex h-dvh overflow-hidden bg-card">
      <SideBar
        currentPage={currentPage}
        collapsed={collapsed}
        onToogle={() => setCollapsed((c) => !c)}
        onPageChange={goTo}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          user={user}
          title={page.title}
          subtitle={page.subtitle}
          onMenuClick={() => setMobileOpen(true)}
          onProfile={() => goTo("settings")}
          onSettings={() => goTo(user?.role ==="farmer"?"user_settings":"settings")}
          onNotifications={() => goTo("notifications")}
          onLogout={handleLogout}
        />

        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-5"
        >
          {/* CURRENT PAGE */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}