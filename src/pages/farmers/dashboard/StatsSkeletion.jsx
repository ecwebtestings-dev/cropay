import Card from "../../../components/common/Card";

function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-700/70 ${className}`}/>
  );
}


{/**CARD */}
function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>

        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
}

{/*PROGRESS BAR */}
function SavingsProgressSkeleton() {
  return (
    <Card title="Savings Progress">
      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>

              <Skeleton className="h-3 w-10" />
            </div>

            <Skeleton className="h-2 w-full rounded-full" />

            <div className="flex justify-between gap-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

{/*QUICK ACTIONS */}
function QuickActionsSkeleton() {
  return (
    <Card title="Quick Actions">
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-lg border border-border bg-bg p-3"
          >
            <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />

            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-28 max-w-full" />
              <Skeleton className="h-3 w-20 max-w-full" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RecentActivitySkeleton() {
  return (
    <Card title="Recent Activity">
      <div className="space-y-5">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-36 max-w-full" />
              <Skeleton className="h-3 w-28 max-w-full" />
              <Skeleton className="h-3 w-20 max-w-full" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RecentTransactionsSkeleton() {
  return (
    <Card title="Your Recent Transactions">
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-3 border-b border-border pb-3">
          {["Type", "Amount", "Date", "Status"].map((label) => (
            <span
              key={label}
              className="text-xs font-medium text-muted"
            >
              {label}
            </span>
          ))}
        </div>

        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="grid grid-cols-4 items-center gap-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <Skeleton className="h-3 w-16 max-w-full" />
            </div>

            <Skeleton className="h-3 w-16 max-w-full" />
            <Skeleton className="h-3 w-16 max-w-full" />
            <Skeleton className="h-5 w-16 max-w-full rounded-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function OverviewSkeleton() {
  return (
    <main
      role="status"
      aria-label="Loading dashboard overview"
      className="min-w-0 space-y-6"
    >
      <span className="sr-only">Loading dashboard overview...</span>

      {/* Welcome section */}
      <section className="space-y-2">
        <Skeleton className="h-7 w-64 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </section>

      {/* Statistic cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <StatCardSkeleton key={item} />
        ))}
      </section>

      {/* Savings progress and quick actions */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="min-w-0 xl:col-span-3">
          <SavingsProgressSkeleton />
        </div>

        <div className="min-w-0 xl:col-span-2">
          <QuickActionsSkeleton />
        </div>
      </section>

      {/* Recent activity and transactions */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentActivitySkeleton />
        <RecentTransactionsSkeleton />
      </section>
    </main>
  );
}