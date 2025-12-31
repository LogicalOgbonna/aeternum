import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function RulesPage() {
  return (
    <article className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-(--color-text-muted) mb-3">
          <Link href="/docs" className="hover:text-(--color-accent)">Docs</Link>
          <span>/</span>
          <span className="text-(--color-text-secondary)">Rules & Policies</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--color-accent) to-(--color-gold) flex items-center justify-center">
            <Shield className="w-6 h-6 text-(--color-primary-dark)" />
          </div>
          <h1 className="text-3xl font-bold text-(--color-text)">
            Rules & Policies
          </h1>
        </div>
        <p className="text-lg text-(--color-text-secondary) leading-relaxed max-w-2xl">
          The operational rules and policies that govern Aeternum Syndicate. 
          All members are bound by these rules upon joining.
        </p>
      </div>

      {/* Important Notice */}
      <div className="mb-10 p-4 rounded-lg border border-(--color-warning)/30 bg-(--color-warning)/10">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-(--color-warning) flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-(--color-warning) mb-1">Important</h3>
            <p className="text-sm text-(--color-text-secondary)">
              These rules are binding. Violation may result in penalties or removal from the syndicate. 
              Please read carefully before making any contributions.
            </p>
          </div>
        </div>
      </div>

      {/* Membership Rules */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-accent) rounded-full" />
          Membership Rules
        </h2>
        <div className="space-y-4">
          <RuleCard
            number="1.1"
            title="Eligibility"
            description="Membership is open to individuals aged 18 and above who can provide valid identification and meet KYC requirements."
          />
          <RuleCard
            number="1.2"
            title="Minimum Contribution"
            description="The minimum initial contribution is ₦100,000. Subsequent contributions must be at least ₦50,000."
          />
          <RuleCard
            number="1.3"
            title="Member Obligations"
            description="Members must keep their contact information current, respond to official communications within 14 days, and participate in voting when required."
          />
          <RuleCard
            number="1.4"
            title="Confidentiality"
            description="Members shall not disclose fund strategies, asset locations, or other proprietary information to non-members without prior written consent."
          />
        </div>
      </section>

      {/* Contribution Rules */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-gold) rounded-full" />
          Contribution Rules
        </h2>
        <div className="space-y-4">
          <RuleCard
            number="2.1"
            title="Subscription Windows"
            description="Contributions are accepted during quarterly subscription windows (January, April, July, October). The window is open for the first 14 days of each quarter."
          />
          <RuleCard
            number="2.2"
            title="Unit Pricing"
            description="Units are priced at the NAV per unit calculated at market close on the last business day before the subscription window opens."
          />
          <RuleCard
            number="2.3"
            title="Payment Terms"
            description="Contributions must be received within 7 days of subscription. Failed or reversed payments will result in cancellation of the subscription."
          />
          <RuleCard
            number="2.4"
            title="No Refunds"
            description="Once units are issued, contributions cannot be refunded. Members wishing to exit must use the redemption process."
          />
        </div>
      </section>

      {/* Redemption Rules */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-accent) rounded-full" />
          Redemption Rules
        </h2>
        <div className="space-y-4">
          <RuleCard
            number="3.1"
            title="Lock-up Period"
            description="Members cannot redeem units within the first 24 months of their initial contribution (the lock-up period)."
          />
          <RuleCard
            number="3.2"
            title="Redemption Windows"
            description="After the lock-up period, redemptions are processed during semi-annual liquidity windows (June and December)."
          />
          <RuleCard
            number="3.3"
            title="Notice Requirement"
            description="Members must provide 60 days written notice before a redemption window to be included in that cycle."
          />
          <RuleCard
            number="3.4"
            title="Redemption Limits"
            description="The fund may limit total redemptions to 10% of NAV per window if liquidity is constrained. Excess requests are queued for the next window."
          />
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-gold) rounded-full" />
          Do&apos;s and Don&apos;ts
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="font-semibold text-(--color-success) mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Do
            </h3>
            <ul className="space-y-3 text-sm text-(--color-text-secondary)">
              <li className="flex gap-2">
                <span className="text-(--color-success)">✓</span>
                Keep your contact information updated
              </li>
              <li className="flex gap-2">
                <span className="text-(--color-success)">✓</span>
                Participate in member votes and decisions
              </li>
              <li className="flex gap-2">
                <span className="text-(--color-success)">✓</span>
                Review quarterly reports and statements
              </li>
              <li className="flex gap-2">
                <span className="text-(--color-success)">✓</span>
                Report suspicious activity to administrators
              </li>
              <li className="flex gap-2">
                <span className="text-(--color-success)">✓</span>
                Plan contributions around subscription windows
              </li>
            </ul>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-(--color-danger) mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Don&apos;t
            </h3>
            <ul className="space-y-3 text-sm text-(--color-text-secondary)">
              <li className="flex gap-2">
                <span className="text-(--color-danger)">✗</span>
                Share fund information with non-members
              </li>
              <li className="flex gap-2">
                <span className="text-(--color-danger)">✗</span>
                Transfer units without proper authorization
              </li>
              <li className="flex gap-2">
                <span className="text-(--color-danger)">✗</span>
                Use fund assets as collateral for personal loans
              </li>
              <li className="flex gap-2">
                <span className="text-(--color-danger)">✗</span>
                Misrepresent your ownership stake to third parties
              </li>
              <li className="flex gap-2">
                <span className="text-(--color-danger)">✗</span>
                Expect guaranteed returns (all investments carry risk)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Enforcement */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-danger) rounded-full" />
          Enforcement & Penalties
        </h2>
        <div className="prose-custom">
          <p>
            Violations of these rules are handled by the Governance Committee. 
            Depending on severity, penalties may include:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li><strong>Warning:</strong> First-time minor violations</li>
            <li><strong>Suspension:</strong> Temporary loss of voting rights</li>
            <li><strong>Forced Redemption:</strong> Mandatory exit from the fund at current NAV</li>
            <li><strong>Legal Action:</strong> For fraud, theft, or material breach</li>
          </ul>
          <p className="mt-4">
            Members have the right to appeal decisions within 30 days. Appeals are 
            heard by an independent arbitration panel.
          </p>
        </div>
      </section>

      {/* Footer */}
      <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface-elevated)">
        <p className="text-sm text-(--color-text-muted)">
          Last updated: December 2024 • Version 1.0.0
        </p>
        <p className="text-sm text-(--color-text-secondary) mt-2">
          Questions about these rules? Contact the Governance Committee at{' '}
          <a href="mailto:governance@aeternum.fund" className="text-(--color-accent) hover:underline">
            governance@aeternum.fund
          </a>
        </p>
      </div>
    </article>
  );
}

function RuleCard({ 
  number, 
  title, 
  description 
}: { 
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-lg border border-(--color-border) bg-(--color-surface)">
      <div className="text-sm font-mono text-(--color-accent) font-medium">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-(--color-text) mb-1">{title}</h3>
        <p className="text-sm text-(--color-text-secondary)">{description}</p>
      </div>
    </div>
  );
}



