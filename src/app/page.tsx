import Link from 'next/link';
import { Building2, LayoutDashboard, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-(--color-bg) flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-(--color-accent) to-(--color-gold) flex items-center justify-center shadow-lg">
              <Building2 className="w-10 h-10 text-(--color-primary-dark)" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-(--color-text) mb-4">
            Aeternum
          </h1>
          <p className="text-xl text-(--color-text-secondary) mb-2">
            Investment Syndicate
          </p>
          <p className="text-(--color-text-muted) max-w-xl mx-auto mb-12">
            A member-owned collective focused on strategic land banking. 
            Pool capital, share ownership, and grow wealth together.
          </p>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Dashboard Card */}
            <Link 
              href="/dashboard"
              className="group card p-8 text-left hover:border-(--color-accent)/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-(--color-accent)/10 flex items-center justify-center mb-6 group-hover:bg-(--color-accent)/20 transition-colors">
                <LayoutDashboard className="w-7 h-7 text-(--color-accent)" />
              </div>
              <h2 className="text-xl font-semibold text-(--color-text) mb-2 flex items-center gap-2">
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
              className="group card p-8 text-left hover:border-(--color-gold)/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-(--color-gold)/10 flex items-center justify-center mb-6 group-hover:bg-(--color-gold)/20 transition-colors">
                <BookOpen className="w-7 h-7 text-(--color-gold)" />
              </div>
              <h2 className="text-xl font-semibold text-(--color-text) mb-2 flex items-center gap-2">
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
      <footer className="py-6 text-center border-t border-(--color-border)">
        <p className="text-sm text-(--color-text-muted)">
          © 2024 Aeternum Limited. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
