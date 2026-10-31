// import DashboardHeader from "./DashboardHeader";
// import OverviewCards from "./OverviewCards";
// import PrimaryActions from "./PrimaryActions";
// import SavingsOverview from "./SavingsOverview";
// import RecentTransactions from "./RecentTransactions";

// export default function FarmerDashboard({
//   user,
//   summary,
//   goals,
//   transactions,
//   onSave,
//   onSell,
//   onTransact,
//   onCreateGoal,
//   onDeposit,
//   onViewGoal,
//   onViewAllGoals,
//   onViewAllTransactions,
// }) {
//   return (
//     <main className="min-w-0 space-y-6">
//       <DashboardHeader user={user} />

//       <OverviewCards summary={summary} />

//       <PrimaryActions onSave={onSave} onSell={onSell} onTransact={onTransact} />

//       <div className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-[1.6fr_1fr]">
//         <SavingsOverview
//           goals={goals}
//           onCreateGoal={onCreateGoal}
//           onDeposit={onDeposit}
//           onViewGoal={onViewGoal}
//           onViewAll={onViewAllGoals}
//         />

//         <RecentTransactions
//           transactions={transactions}
//           onViewAll={onViewAllTransactions}
//         />
//       </div>
//     </main>
//   );
// }
