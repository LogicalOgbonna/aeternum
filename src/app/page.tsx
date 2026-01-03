import Link from 'next/link';
import { Building2, LayoutDashboard, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-(--color-bg) flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-(--color-accent) to-(--color-gold) flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-(--color-primary-dark)" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--color-text) mb-3 sm:mb-4">
            Aeternum
          </h1>
          <p className="text-lg sm:text-xl text-(--color-text-secondary) mb-2">
            Investment Syndicate
          </p>
          <p className="text-sm sm:text-base text-(--color-text-muted) max-w-xl mx-auto mb-8 sm:mb-12 px-4">
            A member-owned collective focused on strategic land banking. 
            Pool capital, share ownership, and grow wealth together.
          </p>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {/* Dashboard Card */}
            <Link 
              href="/dashboard"
              className="group card p-6 sm:p-8 text-left hover:border-(--color-accent)/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-(--color-accent)/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-(--color-accent)/20 transition-colors">
                <LayoutDashboard className="w-6 h-6 sm:w-7 sm:h-7 text-(--color-accent)" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-(--color-text) mb-2 flex items-center gap-2">
                Dashboard
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-(--color-accent)" />
              </h2>
              <p className="text-(--color-text-secondary) text-sm mb-4">
                View fund performance, member balances, and run investment simulations.
              </p>
              <div className="flex items-center gap-2">
                <span className="badge badge-success">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Simulation Mode
                </span>
              </div>
            </Link>

            {/* Documentation Card */}
            <Link 
              href="/docs"
              className="group card p-6 sm:p-8 text-left hover:border-(--color-gold)/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-(--color-gold)/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-(--color-gold)/20 transition-colors">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-(--color-gold)" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-(--color-text) mb-2 flex items-center gap-2">
                Documentation
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-(--color-gold)" />
              </h2>
              <p className="text-(--color-text-secondary) text-sm mb-4">
                Read our constitution, rules, and learn how the syndicate operates.
              </p>
              <div className="flex items-center gap-2">
                <span className="badge badge-neutral">
                  v1.0.0
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 sm:py-6 text-center border-t border-(--color-border) px-4">
        <p className="text-xs sm:text-sm text-(--color-text-muted)">
          © 2024 Aeternum Limited. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
