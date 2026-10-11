import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import SideBar from "../components/layout/SideBar";
import Header from "../components/layout/Header";
import { PAGES, getPageIdFromPath } from "../config/navigation";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef(null);

 
  const currentPage = getPageIdFromPath(pathname);
  const page = PAGES[currentPage] ?? PAGES.dashboard;

  
  const goTo = (id) => {const target = PAGES[id];
    if (target) navigate(target.path);
  };

  
  useEffect(() => { mainRef.current?.scrollTo({ top: 0 });}, [pathname]);

  return (
    <div className="flex h-dvh overflow-hidden bg-bg">
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
          title={page.title}
          subtitle={page.subtitle}
          onMenuClick={() => setMobileOpen(true)}
          onProfile={() => goTo("profile")}
          onSettings={() => goTo("settings")}
          onNotifications={() => goTo("notifications")}
        />

        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          {/*CURRENT PAGE */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}