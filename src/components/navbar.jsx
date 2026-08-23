import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>

          <span className="text-xl font-bold text-slate-900">
            News<span className="text-blue-600">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium">
          <Link
            to="/"
            className="text-slate-600 transition hover:text-slate-900"
          >
            Home
          </Link>

          <Link
            to="/analyze"
            className="text-slate-600 transition hover:text-slate-900"
          >
            Analyze
          </Link>

          <Link
            to="/history"
            className="text-slate-600 transition hover:text-slate-900"
          >
            History
          </Link>

          <Link
            to="/about"
            className="text-slate-600 transition hover:text-slate-900"
          >
            About
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;