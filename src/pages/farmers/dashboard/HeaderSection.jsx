function Greetings() {
  const hours = new Date().getHours();

  if (hours < 12) return "Good morning";
  if (hours < 17) return "Good afternoon";

  return "Good evening";
}

export default function DashboardHeader({ user }) {
  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "Farmer";

  return (
    <header className="mb-6 p-2">
      <h1 className="text-xl font-semibold tracking-tight text-heading sm:text-2xl">
        {Greetings()}, {firstName}!
      </h1>

      <p className="mt-1 text-sm text-muted sm:text-base">
        Save and Grow with your CropPay today.
      </p>
    </header>
  );
}
