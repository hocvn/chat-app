import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, Sparkles, LogIn } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();
  const isLanding = location.pathname === "/" && !authUser;

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Chattap
              </span>
            </Link>

            {/* Quick Landing Anchor Links (when unauthenticated or on landing) */}
            {(!authUser || isLanding) && (
              <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-base-content/70">
                <a
                  href="/#features"
                  className="px-3 py-1.5 rounded-lg hover:bg-base-200 hover:text-base-content transition-colors"
                >
                  Features
                </a>
                <a
                  href="/#interactive-demo"
                  className="px-3 py-1.5 rounded-lg hover:bg-base-200 hover:text-base-content transition-colors"
                >
                  Live Demo
                </a>
                <a
                  href="/#themes"
                  className="px-3 py-1.5 rounded-lg hover:bg-base-200 hover:text-base-content transition-colors"
                >
                  Themes
                </a>
                <a
                  href="/#tech-stack"
                  className="px-3 py-1.5 rounded-lg hover:bg-base-200 hover:text-base-content transition-colors"
                >
                  Stack
                </a>
              </nav>
            )}
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="btn btn-sm btn-ghost gap-1.5 flex items-center transition-colors"
              title="Theme Settings"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser ? (
              <>
                <Link to="/profile" className="btn btn-sm btn-ghost gap-1.5">
                  <User className="size-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="btn btn-sm btn-outline btn-error gap-1.5 transition-colors"
                  onClick={logout}
                  title="Logout"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-ghost gap-1.5">
                  <LogIn className="size-4" />
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/signup"
                  className="btn btn-sm btn-primary gap-1.5 shadow-sm shadow-primary/20"
                >
                  <Sparkles className="size-3.5" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;