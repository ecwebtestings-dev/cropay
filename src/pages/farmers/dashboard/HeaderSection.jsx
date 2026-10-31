

export default function DashboardHeader({ user }) {
  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "Farmer";

  return (
    <header className="mb-6">
      <h1 className="text-xl font-semibold tracking-tight text-heading sm:text-2xl">
        Good morning, {firstName}
      </h1>

      <p className="mt-1 text-sm text-muted sm:text-base">
        Here's what's happening with your savings today.
      </p>
    </header>
  );
}
