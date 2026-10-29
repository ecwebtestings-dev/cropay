import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import OverviewStats from "../../components/admindashboard/Overviewstats";
import BusinessSummary from "../../components/admindashboard/Summary";
import { getDashboardstatistics } from "../../api/statistics";

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

    useEffect(() => {
      let ignore = false;

      async function fetchStatistics() {

        try {

          const response = await getDashboardstatistics();
          if (ignore) return;
          setStats(response.data?.data ?? response.data?.stats ?? response.data,);

        } catch (error) {
          
          if (!ignore) {
            toast.error(error.response?.data?.message || "Failed to load statistics",);
          }
        } 
        finally {
          if (!ignore) setLoading(false);
        }
      }

      fetchStatistics();
      return () => {ignore = true;};

    }, []);


  // SKELETON LOADER
  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 animate-pulse rounded-sm bg-border/5" />
        <div className="h-4 w-72 animate-pulse rounded-sm bg-border/5" />
        
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-md bg-border"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ml-2">
      <div>
        <h1 className="text-heading">Executive Overview</h1>
        <p className="text-sm text-muted">Real-time information, Users, Accounts & financial metrics.</p>
      </div>

      {stats ? (
        <>
          <OverviewStats
            users={stats.users}
            deposits={stats.deposits}
            savingGoals={stats.saving_goals}
            productSales={stats.product_sales}
          />

          <BusinessSummary
            goals={stats.saving_goals}
            sales={stats.product_sales}
          />

         
        </>
      ) : (
        <p className="text-sm text-muted">
          Unable to load dashboard statistics.
        </p>
      )}
    </div>
  );
}
