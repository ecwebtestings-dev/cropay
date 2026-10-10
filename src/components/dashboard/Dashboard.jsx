import { useState } from "react";
import Header from "../../components/layout/Header";
import SideBar from "../../components/layout/SibeBar";
import StatCards from "./StatCades";

export default function Dashboard() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <div className="flex h-screen overflow-hidden bg-bodyBg">
      <SideBar
        collapsed={sideBarCollapsed}
        onToogle={() => setSideBarCollapsed((c) => !c)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Header
          onMenuClick={() => setMobileOpen(true)}
          onProfile={() => setCurrentPage("profile")}
          onSettings={() => setCurrentPage("settings")}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="space-y-4 p-4 sm:p-6 lg:p-10">
            <StatCards />
          </div>
        </main>
      </div>
    </div>
  );
}