import { useAuth } from "../../../context/AuthContext";
import useDashboardData from "../../../hooks/Usedashboarddata";
import Card from '../../../components/common/Card';
import StatCards from "../../../components/dashboard/Statcards";
import SavingsProgress from "../../../components/dashboard/SavingsProgress";
import QuickActions from "../../../components/dashboard/QuickActions";
import RecentActivity from "../../../components/dashboard/ReactActivity";
import RecentTransactions from "../../../components/dashboard/ReactTransactions";

function getGreetings(){
    const hour = new Date().getHours();
    if(hour<12) return 'Good Morning';
    if(hour>12) return "Good Afternoon";
    return "Good Evening";
}

export default function Dashboard() {

    const {user}=useAuth()
    const {data,loading,error,reload}=useDashboardData();

    const firstName =user?.name?.split(" ")[0]??"";

  return (
    <div className="space-y-6">
      {/* GREETING */}
      <div>
        <h2 className="text-xl font-bold text-heading sm:text-2xl">
          {getGreetings()}
          {firstName && `, ${firstName}`} <span aria-hidden="true">👋</span>
        </h2>
        <p className="mt-1 text-sm text-muted">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>
 
      {error ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-heading">Couldn&apos;t load your dashboard.</p>
            <button
              type="button"
              onClick={reload}
              className="rounded-lg bg-sidebar px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-500"
            >
              Try again
            </button>
          </div>
        </Card>
      ) : (
        <>
          <StatCards stats={data?.stats} loading={loading} />
 
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="min-w-0 space-y-6">
              <SavingsProgress goals={data?.goals} loading={loading} />
              <RecentActivity activity={data?.activity} loading={loading} />
            </div>
 
            <div className="min-w-0 space-y-6">
              <QuickActions />
              <RecentTransactions transactions={data?.transactions} loading={loading} />
            </div>
          </div>
        </>
      )}
    </div>
  );
  
}
