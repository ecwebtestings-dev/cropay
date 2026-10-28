import { useEffect, useState } from "react";
import { ClockAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SessionExpiredModal() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleExpired = () => {
      setOpen(true);
    };

    window.addEventListener("auth:expired", handleExpired);

    return () => {
      window.removeEventListener("auth:expired", handleExpired);
    };
  }, []);

  const handleLogin = () => {
    setOpen(false);

    navigate("/login", {
      replace: true,
      state: { sessionExpired: true },
    });

    window.__cropPaySessionExpired = false;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-red-700">
          <ClockAlert size={25} />
        </div>

        <h2
          id="session-expired-title"
          className="text-lg font-semibold text-heading"
        >
          Session expired
        </h2>

        <p
          id="session-expired-description"
          className="mt-2 text-sm leading-6 text-muted"
        >
          Your session has expired. Please log in again to
          continue using CropPay.
        </p>

        <button
          type="button"
          onClick={handleLogin}
          className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-heading hover:opacity-90"
        >
          Log in
        </button>
      </div>
    </div>
  );
}
