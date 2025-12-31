import { ArrowRight, Briefcase, Building2, Calculator, Coins, Scale, Search, Shield, Users } from 'lucide-react';
import Link from 'next/link';

export default function FundStructurePage() {
  return (
    <article className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-(--color-text-muted) mb-3">
          <Link href="/docs" className="hover:text-(--color-accent)">Docs</Link>
          <span>/</span>
          <span className="text-(--color-text-secondary)">Fund Structure</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--color-accent) to-(--color-gold) flex items-center justify-center">
            <Scale className="w-6 h-6 text-(--color-primary-dark)" />
          </div>
          <h1 className="text-3xl font-bold text-(--color-text)">
            Fund Structure
          </h1>
        </div>
        <p className="text-lg text-(--color-text-secondary) leading-relaxed max-w-3xl">
          Aeternum is structured to clearly separate <strong className="text-(--color-text)">ownership, governance, and economic participation</strong>. 
          This separation is intentional and ensures the syndicate can scale, accept variable contributions, 
          and operate over long time horizons without governance or equity disputes.
        </p>
        <p className="text-(--color-text-secondary) mt-4 leading-relaxed max-w-3xl">
          At a high level, Aeternum operates through a <strong className="text-(--color-text)">single legal entity</strong> with two distinct layers:
        </p>
        <ul className="mt-3 space-y-2 text-(--color-text-secondary)">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent)" />
            a <strong className="text-(--color-accent)">shareholding layer</strong> for control and governance, and
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-(--color-gold)" />
            b <strong className="text-(--color-gold)">unit-based layer</strong> for tracking economic ownership and returns.
          </li>
        </ul>
      </div>

      {/* Legal Entity */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-accent) rounded-full" />
          Legal Entity
        </h2>
        <div className="prose-custom">
          <p>
            Aeternum operates as a <strong className="text-(--color-text)">private limited company</strong>, 
            incorporated under applicable company law. The company serves as the legal owner of all assets, 
            including land, cash holdings, and investment instruments.
          </p>
          <p className="mt-3">
            All acquisitions, contracts, and titles are held <strong className="text-(--color-accent)">in the name of the company</strong>, 
            not individual members.
          </p>
        </div>
      </section>

      {/* Shares (Governance Layer) */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-accent) rounded-full" />
          Shares (Governance Layer)
        </h2>
        <div className="prose-custom mb-6">
          <p>
            Shares represent <strong className="text-(--color-text)">legal ownership and control</strong>, not economic contribution.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="card p-5">
            <h3 className="font-semibold text-(--color-text) mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-(--color-accent)" />
              Purpose of Shares
            </h3>
            <ul className="space-y-2 text-sm text-(--color-text-secondary)">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-(--color-text-muted)" />
                Define voting rights
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-(--color-text-muted)" />
                Appoint directors and officers
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-(--color-text-muted)" />
                Approve major decisions (e.g. asset sales, amendments, dissolution)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-(--color-text-muted)" />
                Provide legal authority to act on behalf of the syndicate
              </li>
            </ul>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-(--color-text) mb-3">Key Characteristics</h3>
            <ul className="space-y-2 text-sm text-(--color-text-secondary)">
              <li className="flex items-center gap-2">
                <span className="text-(--color-error)">✗</span>
                Shares are <strong className="text-(--color-text)">fixed and limited</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-(--color-error)">✗</span>
                Shareholding does <strong className="text-(--color-text)">not change</strong> with contributions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-(--color-error)">✗</span>
                Shares do <strong className="text-(--color-text)">not track</strong> profits or losses
              </li>
              <li className="flex items-center gap-2">
                <span className="text-(--color-error)">✗</span>
                Shares are <strong className="text-(--color-text)">not issued</strong> monthly
              </li>
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-(--color-accent)/5 border border-(--color-accent)/20">
          <p className="text-sm text-(--color-text-secondary) italic">
            In simple terms: <strong className="text-(--color-text)">shares decide how the fund is run, not who earns more.</strong>
          </p>
        </div>
      </section>

      {/* Units (Economic Layer) */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-gold) rounded-full" />
          Units (Economic Layer)
        </h2>
        <div className="prose-custom mb-6">
          <p>
            Units represent <strong className="text-(--color-text)">economic participation</strong> in the fund.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="card p-5">
            <h3 className="font-semibold text-(--color-text) mb-3 flex items-center gap-2">
              <Coins className="w-4 h-4 text-(--color-gold)" />
              Purpose of Units
            </h3>
            <ul className="space-y-2 text-sm text-(--color-text-secondary)">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-(--color-text-muted)" />
                Track how much capital each member has contributed
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-(--color-text-muted)" />
                Determine proportional entitlement to gains and distributions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-(--color-text-muted)" />
                Reflect changes in value through the Net Asset Value (NAV)
              </li>
            </ul>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-(--color-text) mb-3">How Units Work</h3>
            <ul className="space-y-2 text-sm text-(--color-text-secondary)">
              <li className="flex items-center gap-2">
                <span className="text-(--color-success)">✓</span>
                Members receive units when they contribute capital
              </li>
              <li className="flex items-center gap-2">
                <span className="text-(--color-success)">✓</span>
                Units are issued at the prevailing <strong className="text-(--color-text)">NAV per unit</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-(--color-success)">✓</span>
                Units are cumulative and may vary by member
              </li>
              <li className="flex items-center gap-2">
                <span className="text-(--color-error)">✗</span>
                Units do <strong className="text-(--color-text)">not</strong> grant voting or management power
              </li>
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-(--color-gold)/5 border border-(--color-gold)/20">
          <p className="text-sm text-(--color-text-secondary) italic">
            In simple terms: <strong className="text-(--color-text)">units decide how value is shared, not who is in charge.</strong>
          </p>
        </div>
      </section>

      {/* Relationship Table */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-accent) rounded-full" />
          Relationship Between Shares and Units
        </h2>

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-(--color-surface-elevated)">
              <tr>
                <th className="text-left p-4 font-semibold text-(--color-text)">Aspect</th>
                <th className="text-left p-4 font-semibold text-(--color-accent)">Shares</th>
                <th className="text-left p-4 font-semibold text-(--color-gold)">Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--color-border)">
              <tr>
                <td className="p-4 text-(--color-text-secondary)">Purpose</td>
                <td className="p-4 text-(--color-text)">Control & governance</td>
                <td className="p-4 text-(--color-text)">Economic ownership</td>
              </tr>
              <tr>
                <td className="p-4 text-(--color-text-secondary)">Changes with contributions</td>
                <td className="p-4"><span className="text-(--color-error)">✗ No</span></td>
                <td className="p-4"><span className="text-(--color-success)">✓ Yes</span></td>
              </tr>
              <tr>
                <td className="p-4 text-(--color-text-secondary)">Affects voting</td>
                <td className="p-4"><span className="text-(--color-success)">✓ Yes</span></td>
                <td className="p-4"><span className="text-(--color-error)">✗ No</span></td>
              </tr>
              <tr>
                <td className="p-4 text-(--color-text-secondary)">Affects payouts</td>
                <td className="p-4"><span className="text-(--color-error)">✗ No</span></td>
                <td className="p-4"><span className="text-(--color-success)">✓ Yes</span></td>
              </tr>
              <tr>
                <td className="p-4 text-(--color-text-secondary)">Issued frequency</td>
                <td className="p-4 text-(--color-text)">Rare</td>
                <td className="p-4 text-(--color-text)">Ongoing</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-(--color-text-secondary)">
          This dual-layer structure allows Aeternum to accept variable contributions over time{' '}
          <strong className="text-(--color-text)">without diluting governance or exhausting share capital</strong>.
        </p>
      </section>

      {/* Visual Structure Diagram */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-gold) rounded-full" />
          Visual Fund Structure
        </h2>
        <p className="text-sm text-(--color-text-muted) mb-6">
          Understand Aeternum in 30 seconds.
        </p>

        <div className="card p-6">
          {/* Top: Company */}
          <div className="flex justify-center mb-6">
            <div className="px-6 py-4 rounded-xl bg-linear-to-br from-(--color-accent) to-(--color-gold) text-center">
              <Building2 className="w-6 h-6 text-(--color-primary-dark) mx-auto mb-1" />
              <p className="font-bold text-(--color-primary-dark)">AETERNUM</p>
              <p className="text-xs text-(--color-primary-dark)/70">Legal Company</p>
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center mb-6">
            <div className="w-0.5 h-8 bg-(--color-border)" />
          </div>

          {/* Two Branches */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Shares Branch */}
            <div className="text-center">
              <div className="inline-block px-6 py-4 rounded-xl bg-(--color-accent)/10 border border-(--color-accent)/30 mb-4">
                <Shield className="w-6 h-6 text-(--color-accent) mx-auto mb-1" />
                <p className="font-bold text-(--color-accent)">SHARES</p>
                <p className="text-xs text-(--color-text-muted)">(CONTROL)</p>
              </div>
              <ul className="text-sm text-(--color-text-secondary) space-y-1 text-left max-w-48 mx-auto">
                <li>• Voting rights</li>
                <li>• Directors</li>
                <li>• Major decisions</li>
                <li>• Rules & amendments</li>
              </ul>
            </div>

            {/* Units Branch */}
            <div className="text-center">
              <div className="inline-block px-6 py-4 rounded-xl bg-(--color-gold)/10 border border-(--color-gold)/30 mb-4">
                <Coins className="w-6 h-6 text-(--color-gold) mx-auto mb-1" />
                <p className="font-bold text-(--color-gold)">UNITS</p>
                <p className="text-xs text-(--color-text-muted)">(MONEY)</p>
              </div>
              <ul className="text-sm text-(--color-text-secondary) space-y-1 text-left max-w-48 mx-auto">
                <li>• Capital contributions</li>
                <li>• Ownership percentage</li>
                <li>• Profit & distributions</li>
                <li>• NAV-based value growth</li>
              </ul>
            </div>
          </div>

          {/* Plain English */}
          <div className="mt-8 pt-6 border-t border-(--color-border) grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-(--color-accent)/5">
              <h4 className="font-semibold text-(--color-accent) mb-2">Shares</h4>
              <ul className="text-sm text-(--color-text-secondary) space-y-1">
                <li>• Decide <strong className="text-(--color-text)">who runs the fund</strong></li>
                <li>• Do <strong className="text-(--color-text)">not</strong> decide who earns more</li>
                <li>• Change rarely</li>
                <li>• Are limited and stable</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-(--color-gold)/5">
              <h4 className="font-semibold text-(--color-gold) mb-2">Units</h4>
              <ul className="text-sm text-(--color-text-secondary) space-y-1">
                <li>• Decide <strong className="text-(--color-text)">who gets how much money</strong></li>
                <li>• Grow or shrink in value with NAV</li>
                <li>• Increase when you contribute</li>
                <li>• Never affect control</li>
              </ul>
            </div>
          </div>

          {/* Key Insight */}
          <div className="mt-6 p-4 rounded-lg bg-(--color-surface-elevated) text-center">
            <p className="text-sm text-(--color-text-secondary)">
              <strong className="text-(--color-text)">Money does not buy power.</strong>{' '}
              <strong className="text-(--color-text)">Power does not distort money.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-accent) rounded-full" />
          Organizational Structure
        </h2>
        <p className="text-sm text-(--color-text-muted) mb-6">
          The functional structure of Aeternum.
        </p>

        <div className="card p-6 space-y-6">
          {/* Org Chart */}
          <div className="flex flex-col items-center gap-4">
            <OrgBox title="Members (Unit Holders)" icon={<Users className="w-4 h-4" />} color="gold" />
            <div className="w-0.5 h-4 bg-(--color-border)" />
            <OrgBox title="Shareholders (Governance)" icon={<Shield className="w-4 h-4" />} color="accent" />
            <div className="w-0.5 h-4 bg-(--color-border)" />
            <OrgBox title="Board of Directors" icon={<Scale className="w-4 h-4" />} color="accent" />
            <div className="w-0.5 h-4 bg-(--color-border)" />
            
            {/* Three branches */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-xl">
              <OrgBox title="Managing Director" icon={<Briefcase className="w-4 h-4" />} color="muted" small />
              <OrgBox title="Finance Director" icon={<Calculator className="w-4 h-4" />} color="muted" small />
              <OrgBox title="Investment Committee" icon={<Search className="w-4 h-4" />} color="muted" small />
            </div>
          </div>

          {/* Roles Grid */}
          <div className="pt-6 border-t border-(--color-border)">
            <h3 className="font-semibold text-(--color-text) mb-4">Roles Explained</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <RoleCard
                title="Members (Unit Holders)"
                items={[
                  "Contribute capital",
                  "Hold investment units",
                  "Participate economically in gains and distributions",
                  "Do not manage day-to-day operations"
                ]}
              />
              <RoleCard
                title="Shareholders"
                items={[
                  "Hold shares in the company",
                  "Vote on major decisions",
                  "Appoint and remove directors",
                  "Approve structural changes"
                ]}
              />
              <RoleCard
                title="Board of Directors"
                items={[
                  "Provides strategic oversight",
                  "Approves major investments and asset disposals",
                  "Ensures compliance with rules and policies",
                  "Acts in the best interest of the syndicate"
                ]}
              />
              <RoleCard
                title="Management"
                items={[
                  "Oversees execution of strategy",
                  "Manages NAV calculation and reporting",
                  "Handles cash, money market allocations, and liquidity",
                  "Evaluates investment opportunities"
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Decision Matrix */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-gold) rounded-full" />
          Decision-Making Matrix
        </h2>
        <p className="text-sm text-(--color-text-muted) mb-6">
          Who decides what — explicit, not implied.
        </p>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-(--color-surface-elevated)">
              <tr>
                <th className="text-left p-3 font-semibold text-(--color-text)">Decision Area</th>
                <th className="text-center p-3 font-semibold text-(--color-gold)">Members</th>
                <th className="text-center p-3 font-semibold text-(--color-accent)">Shareholders</th>
                <th className="text-center p-3 font-semibold text-(--color-text-secondary)">Board</th>
                <th className="text-center p-3 font-semibold text-(--color-text-muted)">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--color-border)">
              <DecisionRow area="Contribute capital" members="✓" />
              <DecisionRow area="Withdraw / redeem units" members="✓" />
              <DecisionRow area="Receive distributions" members="✓" />
              <DecisionRow area="Change fund structure" shareholders="✓" />
              <DecisionRow area="Amend rules & policies" shareholders="✓" board="recommend" />
              <DecisionRow area="Appoint / remove directors" shareholders="✓" />
              <DecisionRow area="Approve large acquisitions" board="✓" />
              <DecisionRow area="Approve asset sales" board="✓" />
              <DecisionRow area="Day-to-day operations" management="✓" />
              <DecisionRow area="NAV calculation & reporting" management="✓" />
              <DecisionRow area="Due diligence & screening" board="committee" />
              <DecisionRow area="Company dissolution" shareholders="super" />
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-(--color-surface-elevated)">
            <p className="text-(--color-text-secondary)">
              If it&apos;s about <strong className="text-(--color-gold)">money you put in</strong>, units matter.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-(--color-surface-elevated)">
            <p className="text-(--color-text-secondary)">
              If it&apos;s about <strong className="text-(--color-accent)">how the fund is run</strong>, shares and the board matter.
            </p>
          </div>
        </div>
      </section>

      {/* Why This Works */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-accent) rounded-full" />
          Why This Structure Works
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "Prevents governance capture by large contributors",
            "Supports variable and long-term contributions",
            "Protects the syndicate from share exhaustion",
            "Enables clear accountability",
            "Scales cleanly over decades",
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg border border-(--color-border) bg-(--color-surface)">
              <p className="text-sm text-(--color-text-secondary) flex items-center gap-2">
                <span className="text-(--color-success)">✓</span>
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* One-Line Summary */}
      <section className="mb-10">
        <div className="p-6 rounded-xl bg-(--color-gold)/10 border border-(--color-gold)/30 text-center">
          <p className="text-(--color-text) font-medium">
            <span className="text-(--color-gold)">We earn through units.</span>{' '}
            <span className="text-(--color-accent)">We govern through shares.</span>{' '}
            <span className="text-(--color-text-secondary)">We protect the fund through structure.</span>
          </p>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between p-6 card bg-(--color-surface-elevated)">
        <Link 
          href="/docs/how-it-works"
          className="text-(--color-text-secondary) hover:text-(--color-accent) transition-colors"
        >
          ← How It Works
        </Link>
        <div className="text-right">
          <p className="text-sm text-(--color-text-muted) mb-1">Next</p>
          <Link 
            href="/docs/rules" 
            className="font-semibold text-(--color-accent) hover:underline inline-flex items-center gap-1"
          >
            Rules & Policies
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function OrgBox({ 
  title, 
  icon, 
  color,
  small
}: { 
  title: string;
  icon: React.ReactNode;
  color: 'accent' | 'gold' | 'muted';
  small?: boolean;
}) {
  const colorClasses = {
    accent: 'bg-(--color-accent)/10 border-(--color-accent)/30 text-(--color-accent)',
    gold: 'bg-(--color-gold)/10 border-(--color-gold)/30 text-(--color-gold)',
    muted: 'bg-(--color-surface-elevated) border-(--color-border) text-(--color-text-secondary)',
  };

  return (
    <div className={`px-4 py-3 rounded-lg border ${colorClasses[color]} flex items-center gap-2 ${small ? 'text-xs' : 'text-sm'}`}>
      {icon}
      <span className="font-medium">{title}</span>
    </div>
  );
}

function RoleCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="p-4 rounded-lg bg-(--color-surface-elevated)">
      <h4 className="font-semibold text-(--color-text) mb-2 text-sm">{title}</h4>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-(--color-text-secondary) flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-(--color-text-muted) mt-1.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DecisionRow({ 
  area, 
  members, 
  shareholders, 
  board, 
  management 
}: { 
  area: string;
  members?: string;
  shareholders?: string;
  board?: string;
  management?: string;
}) {
  const renderCell = (value?: string) => {
    if (!value) return <span className="text-(--color-text-muted)">—</span>;
    if (value === '✓') return <span className="text-(--color-success) font-bold">✓</span>;
    if (value === 'recommend') return <span className="text-(--color-text-muted) text-xs">recommend</span>;
    if (value === 'committee') return <span className="text-(--color-text-muted) text-xs">via committee</span>;
    if (value === 'super') return <span className="text-(--color-warning) text-xs">supermajority</span>;
    return <span>{value}</span>;
  };

  return (
    <tr className="hover:bg-(--color-surface-elevated)/50">
      <td className="p-3 text-(--color-text-secondary)">{area}</td>
      <td className="p-3 text-center">{renderCell(members)}</td>
      <td className="p-3 text-center">{renderCell(shareholders)}</td>
      <td className="p-3 text-center">{renderCell(board)}</td>
      <td className="p-3 text-center">{renderCell(management)}</td>
    </tr>
  );
}
