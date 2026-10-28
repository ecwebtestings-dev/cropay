import { useAuth } from "../../../context/AuthContext";
import QuickActions from "./QuickActions";
import RecentActivity from "./ReactActivity";
import RecentTransactions from "./ReactTransactions";
import SavingsProgress from "./SavingsProgress";
import StatCards from "./Statcards";
import OverviewSkeleton from "./StatsSkeletion";

 function getGreetings(){
    const hour = new Date().getHours();
    if(hour > 12){
        return "Good Morning"
    }
    if(hour<12){
        return "Good afternoon"
    }
    return "Good evening";
}

export default function Dashboard({loading,stats,goals,activities,transactions}) {
    const {user}=useAuth();
    //PRELOADER
    if(loading){
        return <OverviewSkeleton/>;
    }

  return (
    <main className="min-w-0 space-y-6">
      <section>
        <h1>
            {getGreetings()},{user?.name?.trim().split(/\s+/)[0] || ""}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Here's what's happening with your account today.
        </p>
      </section>

        <StatCards stats={stats}/>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
            <div className="min-w-0 xl:col-span-3">
                <SavingsProgress goals={goals}/>
            </div>

            <div className="min-w-0 xl:col-span-2">
                <QuickActions/>
            </div>
        </section>  


        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <RecentActivity activities={activities}/>
            <RecentTransactions transactions={transactions}/>
        </section>
    </main>
  )
}
