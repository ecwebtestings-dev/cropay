
import { useAuth } from "../../context/AuthContext";
import {
  Leaf,
  Wallet,
  Target,
  ArrowDownToLine,
  LogOut,
} from "lucide-react";

const sampleStats = [
  {
    label: "Total savings",
    value: "UGX 1,250,000",
    description: "Illustrative balance",
    icon: Wallet,
  },
  {
    label: "Active goals",
    value: "3",
    description: "Sample goal count",
    icon: Target,
  },
  {
    label: "Total deposits",
    value: "12",
    description: "Sample deposit count",
    icon: ArrowDownToLine,
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-emerald-800 p-2 text-white">
              <Leaf size={24} />
            </span>
            <div>
              <p className="text-xl font-bold text-emerald-950">
                CropPay
              </p>
              <p className="text-xs text-stone-500">
                Farmer dashboard
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            <LogOut size={17} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <section className="rounded-2xl bg-emerald-950 p-6 text-white sm:p-8">
          <p className="text-sm text-emerald-200">
            YOUR FARMING JOURNEY
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Welcome, {user?.name || "Farmer"}!
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100/80">
            Your CropPay workspace is ready. Track your
            savings and work toward your next farming goal.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-stone-900">
            Your overview
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Illustrative placeholder figures for development.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sampleStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.label}
                  className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-stone-500">
                      {stat.label}
                    </p>
                    <span className="rounded-xl bg-emerald-50 p-2 text-emerald-800">
                      <Icon size={20} />
                    </span>
                  </div>

                  <p className="mt-5 text-2xl font-bold text-stone-900">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs text-stone-400">
                    {stat.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-950">
            Development mode
          </p>
          <p className="mt-1 text-sm leading-6 text-amber-900">
            Authentication and dashboard values are simulated.
            No real account or financial transaction has been created.
          </p>
        </section>
      </div>
    </main>
  );
}