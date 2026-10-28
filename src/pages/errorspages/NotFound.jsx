import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
        <p className="text-7xl font-bold text-muted/50">404</p>

        <h1 className="mt-4 text-2xl font-bold text-heading">Oops! We coundn't find this page.</h1>

        <p className="mt-2 max-w-sm text-sm text-muted">
            We cant find that page that youre looking for probably the link is broken
        </p>

        <Link to="/" className="mt-6 inline-flex items-center gap-2  px-5 py-3 text-sm font-semibold text-sidebar">
            <ArrowRight size={18}/>BACK TO HOME
        </Link>
    </div>
  )
}
