import { Link } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";

import { PATHS } from "../../routes/paths";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <ShieldAlert size={38} strokeWidth={1.8} />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-heading">Access denied</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Your dont have the permission to access this resource
      </p>

      <Link
        to={PATHS.login}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sidebar px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>
    </div>
  );
}