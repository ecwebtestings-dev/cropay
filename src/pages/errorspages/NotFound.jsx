import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
        <p className="text-3xl font-bold text-sidebar">404 Not found</p>

        <h1 className="mt-4 text-2xl font-bold text-heading">Oops! We coundn't find that page.</h1>

        <p className="mt-2 max-w-sm text-sm text-muted">
            We cant find that page that youre lopoking for probably the link is broken
        </p>

        <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sidebar px-5 py-3 text-sm font-semibold text-white">
            <ArrowRight size={18}/>BACK TO HOME
        </Link>
    </div>
  )
}
