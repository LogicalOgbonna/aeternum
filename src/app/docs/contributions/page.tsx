import { AlertTriangle, ArrowRight, Ban, CheckCircle, Clock, Coins, Lightbulb, Scale, Shield, ShoppingCart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ContributionsPage() {
  return (
    <article className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-(--color-text-muted) mb-3">
          <Link href="/docs" className="hover:text-(--color-accent)">Docs</Link>
          <span>/</span>
          <span className="text-(--color-text-secondary)">Contributions</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--color-accent) to-(--color-gold) flex items-center justify-center">
            <Coins className="w-6 h-6 text-(--color-primary-dark)" />
          </div>
          <h1 className="text-3xl font-bold text-(--color-text)">
            Contributions
          </h1>
        </div>
        <p className="text-lg text-(--color-text-secondary) leading-relaxed max-w-3xl">
          This section explains how capital contributions work in Aeternum, including the current 
          contribution structure, how flexibility is handled over time, and the consequences of 
          failing to meet contribution obligations.
        </p>
      </div>

      {/* ⚠️ Important Notice */}
      <section className="mb-10">
        <div className="card p-6 border-(--color-warning)/50 bg-(--color-warning)/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-(--color-warning)/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-(--color-warning)" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-(--color-warning) mb-3">
                Important Notice on Contribution Readiness
              </h2>
              <p className="text-(--color-text) font-medium mb-4">
                All members are expected to maintain a minimum runway of <strong className="text-(--color-warning)">one (1) to two (2) months</strong> of contributions at all times.
              </p>
              <p className="text-(--color-text-secondary) mb-4">
                This syndicate is designed for long-term discipline. Members should only participate if they are 
                confident in their ability to meet recurring contribution obligations.
              </p>
              <p className="text-sm text-(--color-text-muted) pt-4 border-t border-(--color-warning)/20">
                Failure to plan for contribution continuity introduces risk to the collective and will trigger 
                predefined consequences as outlined below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contribution Structure */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-accent) rounded-full" />
          Contribution Structure
        </h2>

        {/* Monthly Contribution */}
        <div className="card p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-(--color-gold)/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-(--color-gold)" />
            </div>
            <div>
              <h3 className="font-semibold text-(--color-text) mb-2">Monthly Contribution (Current Policy)</h3>
              <p className="text-(--color-text-secondary) mb-4">
                At present, members are expected to contribute a <strong className="text-(--color-gold)">fixed amount of ₦1,000,000 per month</strong> during open contribution periods.
              </p>
              <p className="text-sm text-(--color-text-secondary) mb-4">
                This baseline contribution:
              </p>
              <ul className="space-y-2 text-sm text-(--color-text-secondary)">
                <li className="flex items-center gap-2">
                  <span className="text-(--color-success)">✓</span>
                  Ensures predictable capital inflow
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-(--color-success)">✓</span>
                  Enables disciplined long-term planning
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-(--color-success)">✓</span>
                  Keeps participation fair and consistent across members
                </li>
              </ul>
              <p className="text-sm text-(--color-text-muted) mt-4 pt-4 border-t border-(--color-border)">
                Contributions are made into the syndicate&apos;s designated account and are converted into <strong className="text-(--color-text)">investment units</strong> at the prevailing Net Asset Value (NAV) per unit.
              </p>
            </div>
          </div>
        </div>

        {/* Future-Proof Design */}
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-(--color-accent)/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-(--color-accent)" />
            </div>
            <div>
              <h3 className="font-semibold text-(--color-text) mb-2">Built for Variable Contributions (Future-Proof Design)</h3>
              <p className="text-(--color-text-secondary) mb-4">
                While the current contribution amount is fixed, Aeternum is <strong className="text-(--color-text)">structurally designed to support variable contributions</strong> in the future.
              </p>
              <p className="text-sm text-(--color-text-secondary) mb-3">
                This means:
              </p>
              <ul className="space-y-2 text-sm text-(--color-text-secondary) mb-4">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent)" />
                  Members may contribute <strong className="text-(--color-text)">more or less than ₦1,000,000</strong>, subject to policy changes
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent)" />
                  Contributions do not need to be equal across members
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent)" />
                  Ownership remains fair because contributions are converted into units at the current unit price
                </li>
              </ul>
              <p className="text-sm text-(--color-text-muted)">
                No redesign of the fund structure is required to support this flexibility.
              </p>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="mt-6 p-4 rounded-lg bg-(--color-accent)/5 border border-(--color-accent)/20">
          <p className="text-sm text-(--color-text-secondary) italic">
            The system rewards consistency and early participation, but does not penalize members who contribute at different levels over time.
          </p>
        </div>
      </section>

      {/* How Contributions Translate */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-gold) rounded-full" />
          How Contributions Translate Into Ownership
        </h2>

        <div className="card p-6">
          <p className="text-(--color-text-secondary) mb-4">
            When you contribute capital:
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-(--color-primary-dark)">
              <span className="w-6 h-6 rounded-full bg-(--color-accent) text-(--color-primary-dark) flex items-center justify-center text-sm font-bold">1</span>
              <span className="text-sm text-(--color-text-secondary)">The current <strong className="text-(--color-text)">unit price</strong> is determined using NAV</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-(--color-primary-dark)">
              <span className="w-6 h-6 rounded-full bg-(--color-accent) text-(--color-primary-dark) flex items-center justify-center text-sm font-bold">2</span>
              <span className="text-sm text-(--color-text-secondary)">Your contribution is divided by the unit price</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-(--color-primary-dark)">
              <span className="w-6 h-6 rounded-full bg-(--color-accent) text-(--color-primary-dark) flex items-center justify-center text-sm font-bold">3</span>
              <span className="text-sm text-(--color-text-secondary)">You receive units representing your economic stake</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-(--color-surface-elevated)">
            <p className="text-sm text-(--color-text-muted) mb-2">Ownership is always calculated as:</p>
            <code className="text-lg font-mono text-(--color-gold)">Your Units ÷ Total Units Outstanding</code>
          </div>
        </div>
      </section>

      {/* Default, Penalties & Escalation Framework */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-error) rounded-full" />
          Default, Penalties & Escalation Framework
        </h2>

        <p className="text-(--color-text-secondary) mb-6">
          Aeternum applies a <strong className="text-(--color-text)">graduated enforcement model</strong> designed 
          to balance flexibility with accountability. The intent is not punishment, but protection of the syndicate 
          and its active members.
        </p>

        {/* Penalty Timeline Table */}
        <div className="card overflow-hidden mb-6">
          <div className="p-4 bg-(--color-surface-elevated) border-b border-(--color-border)">
            <h3 className="font-semibold text-(--color-text)">Penalty & Escalation Timeline</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-(--color-primary-dark)">
                <tr>
                  <th className="text-left p-4 font-semibold text-(--color-text)">Duration</th>
                  <th className="text-left p-4 font-semibold text-(--color-warning)">Status</th>
                  <th className="text-left p-4 font-semibold text-(--color-text-secondary)">Consequence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--color-border)">
                <PenaltyRow
                  duration="1 month missed"
                  status="Initial Default"
                  statusColor="warning"
                  consequences={[
                    "No units issued for the month",
                    "5% fine applied to the missed monthly contribution",
                    "Contribution must be settled before participation resumes"
                  ]}
                />
                <PenaltyRow
                  duration="2 consecutive months"
                  status="Warning"
                  statusColor="warning"
                  consequences={[
                    "No units issued for missed months",
                    "Fines continue to accrue on unpaid contributions",
                    "Formal notice issued"
                  ]}
                />
                <PenaltyRow
                  duration="3 consecutive months"
                  status="Restricted"
                  statusColor="error"
                  consequences={[
                    "Cumulative penalties remain payable",
                    "Suspension of decision-making and voting rights",
                    "Member may not participate in governance or approvals"
                  ]}
                />
                <PenaltyRow
                  duration="4–5 consecutive months"
                  status="Probation"
                  statusColor="error"
                  consequences={[
                    "Continued loss of governance rights",
                    "Excluded from discretionary investment rounds",
                    "Exit preparation may be initiated"
                  ]}
                />
                <PenaltyRow
                  duration="6 consecutive months"
                  status="Forced Exit"
                  statusColor="error"
                  consequences={[
                    "Member's position is put up for sale",
                    "Company has first right of purchase at NAV-based valuation",
                    "If declined, other members may purchase the position"
                  ]}
                  highlight
                />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Forced Sale Mechanics */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-error) rounded-full" />
          Forced Sale Mechanics (6-Month Default)
        </h2>

        <div className="card p-6 border-(--color-error)/30">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-(--color-error)/10 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5 text-(--color-error)" />
            </div>
            <div>
              <p className="text-(--color-text-secondary)">
                Where a member fails to contribute for <strong className="text-(--color-text)">six (6) consecutive months</strong>:
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {[
              "The member's position becomes eligible for sale",
              "The company has the first right of purchase",
              "If the company declines, existing members may purchase the position",
              "Valuation is based on the prevailing NAV per unit",
              "Settlement occurs through defined liquidity windows or structured instalments"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-(--color-primary-dark)">
                <span className="w-6 h-6 rounded-full bg-(--color-error)/20 text-(--color-error) flex items-center justify-center text-sm font-bold">{i + 1}</span>
                <span className="text-sm text-(--color-text-secondary)">{item}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-(--color-surface-elevated)">
            <p className="text-sm text-(--color-text-secondary)">
              This process is <strong className="text-(--color-text)">structured, transparent, and rule-based</strong> — not discretionary.
            </p>
          </div>
        </div>
      </section>

      {/* Key Principles */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-gold) rounded-full" />
          Key Principles
        </h2>

        <div className="grid md:grid-cols-2 gap-3 mb-6">
          {[
            { text: "No units are ever confiscated without compensation", icon: <Shield className="w-4 h-4" /> },
            { text: "Existing units retain economic value until exit", icon: <Coins className="w-4 h-4" /> },
            { text: "Governance rights are tied to active participation", icon: <Scale className="w-4 h-4" /> },
            { text: "Enforcement is automatic, not personal", icon: <CheckCircle className="w-4 h-4" /> },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-lg border border-(--color-border) bg-(--color-surface) flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-(--color-accent)/10 flex items-center justify-center text-(--color-accent)">
                {item.icon}
              </div>
              <p className="text-sm text-(--color-text-secondary)">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="p-4 rounded-lg bg-(--color-gold)/10 border border-(--color-gold)/30 text-center">
          <p className="text-(--color-text) font-medium">
            <span className="text-(--color-gold)">Capital is flexible.</span>{' '}
            <span className="text-(--color-text-secondary)">Commitment is not.</span>
          </p>
        </div>
      </section>

      {/* Example Breakdown */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-accent) rounded-full" />
          Example Contribution Breakdown
        </h2>

        <div className="card p-6">
          {/* Scenario */}
          <div className="p-4 rounded-lg bg-(--color-surface-elevated) mb-6">
            <h3 className="font-semibold text-(--color-text) mb-2">Scenario</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-(--color-text-muted)">Monthly contribution:</span>
                <span className="ml-2 font-mono text-(--color-gold)">₦1,000,000</span>
              </div>
              <div>
                <span className="text-(--color-text-muted)">Initial unit price:</span>
                <span className="ml-2 font-mono text-(--color-accent)">₦1,000</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4 mb-6">
            <ExampleMonth
              month="Month 1"
              description="You contribute ₦1,000,000"
              calculation="₦1,000,000 ÷ ₦1,000"
              result="1,000 units"
            />
            <ExampleMonth
              month="Month 6"
              description="Fund has grown, unit price increases to ₦1,200. You contribute another ₦1,000,000"
              calculation="₦1,000,000 ÷ ₦1,200"
              result="≈ 833 units"
              highlight
            />
          </div>

          {/* Outcome */}
          <div className="p-4 rounded-lg bg-(--color-accent)/5 border border-(--color-accent)/20">
            <h4 className="font-semibold text-(--color-accent) mb-3">Outcome</h4>
            <ul className="space-y-2 text-sm text-(--color-text-secondary)">
              <li className="flex items-center gap-2">
                <span className="text-(--color-success)">✓</span>
                Total units held: <strong className="text-(--color-text)">1,833 units</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-(--color-success)">✓</span>
                Early contribution earned more units
              </li>
              <li className="flex items-center gap-2">
                <span className="text-(--color-success)">✓</span>
                Later contribution entered at a higher valuation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-(--color-success)">✓</span>
                Ownership remains fair and proportional
              </li>
            </ul>
          </div>

          {/* Skip Warning */}
          <div className="mt-6 p-4 rounded-lg bg-(--color-warning)/5 border border-(--color-warning)/20">
            <div className="flex gap-3">
              <Ban className="w-5 h-5 text-(--color-warning) shrink-0" />
              <div>
                <h4 className="font-semibold text-(--color-warning) mb-2">If You Skip a Month</h4>
                <ul className="space-y-1 text-sm text-(--color-text-secondary)">
                  <li>• No units are issued for that month</li>
                  <li>• Your total units stay the same</li>
                  <li>• A 5% fine is applied to the missed contribution</li>
                  <li>• Future contributions resume at the prevailing unit price</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mb-10">
        <div className="card p-6 bg-linear-to-br from-(--color-accent)/10 to-(--color-gold)/10 border-(--color-accent)/20">
          <div className="flex gap-3">
            <Lightbulb className="w-6 h-6 text-(--color-gold) shrink-0" />
            <div>
              <h3 className="font-semibold text-(--color-text) mb-2">Summary</h3>
              <p className="text-(--color-text-secondary) leading-relaxed mb-4">
                Members are expected to join Aeternum with sufficient financial runway and a long-term mindset. 
                While the structure allows for flexibility, persistent defaulting undermines the collective and 
                is addressed decisively through predefined penalties and exit mechanisms.
              </p>
              <p className="text-sm text-(--color-text-muted)">
                This policy exists to protect: <strong className="text-(--color-text)">active contributors</strong>, 
                <strong className="text-(--color-text)"> long-term capital strategy</strong>, and 
                <strong className="text-(--color-text)"> trust within the syndicate</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between p-6 card bg-(--color-surface-elevated)">
        <Link 
          href="/docs/membership"
          className="text-(--color-text-secondary) hover:text-(--color-accent) transition-colors"
        >
          ← Membership
        </Link>
        <div className="text-right">
          <p className="text-sm text-(--color-text-muted) mb-1">Next</p>
          <Link 
            href="/docs/land-acquisition" 
            className="font-semibold text-(--color-accent) hover:underline inline-flex items-center gap-1"
          >
            Land Acquisition
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function PenaltyRow({
  duration,
  status,
  statusColor,
  consequences,
  highlight
}: {
  duration: string;
  status: string;
  statusColor: 'warning' | 'error';
  consequences: string[];
  highlight?: boolean;
}) {
  const statusClasses = {
    warning: 'bg-(--color-warning)/10 text-(--color-warning)',
    error: 'bg-(--color-error)/10 text-(--color-error)',
  };

  return (
    <tr className={highlight ? 'bg-(--color-error)/5' : 'hover:bg-(--color-surface-elevated)/50'}>
      <td className="p-4 text-(--color-text) font-medium align-top">
        {duration}
      </td>
      <td className="p-4 align-top">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${statusClasses[statusColor]}`}>
          {status}
        </span>
      </td>
      <td className="p-4 align-top">
        <ul className="space-y-1">
          {consequences.map((c, i) => (
            <li key={i} className="text-sm text-(--color-text-secondary) flex items-start gap-2">
              <span className="text-(--color-text-muted) mt-1">•</span>
              {c}
            </li>
          ))}
        </ul>
      </td>
    </tr>
  );
}

function ExampleMonth({
  month,
  description,
  calculation,
  result,
  highlight
}: {
  month: string;
  description: string;
  calculation: string;
  result: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg ${highlight ? 'bg-(--color-accent)/5 border border-(--color-accent)/20' : 'bg-(--color-primary-dark)'}`}>
      <div className="flex items-center gap-3 mb-2">
        <span className={`text-xs font-mono px-2 py-1 rounded ${highlight ? 'bg-(--color-accent)/20 text-(--color-accent)' : 'bg-(--color-surface-elevated) text-(--color-text-muted)'}`}>
          {month}
        </span>
      </div>
      <p className="text-sm text-(--color-text-secondary) mb-2">{description}</p>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-(--color-text-muted)">Units received:</span>
        <code className="px-2 py-1 rounded bg-(--color-surface-elevated) text-(--color-gold) font-mono text-xs">
          {calculation} = <strong>{result}</strong>
        </code>
      </div>
    </div>
  );
}
