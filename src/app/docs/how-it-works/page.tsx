import { ArrowRight, Coins, MapPin, TrendingUp, Users, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <article className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-(--color-text-muted) mb-3">
          <Link href="/docs" className="hover:text-(--color-accent)">Docs</Link>
          <span>/</span>
          <span className="text-(--color-text-secondary)">How It Works</span>
        </div>
        <h1 className="text-3xl font-bold text-(--color-text) mb-4">
          How It Works
        </h1>
        <p className="text-lg text-(--color-text-secondary) leading-relaxed max-w-2xl">
          Aeternum operates on a simple, transparent investment cycle designed to align 
          member contributions with long-term asset growth. Capital is pooled, deployed 
          deliberately, and tracked through a unit-based Net Asset Value (NAV) system 
          that ensures fairness and clarity at every stage.
        </p>
      </div>

      {/* Process Flow */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-(--color-text) mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-accent) rounded-full" />
          The Investment Cycle
        </h2>

        <div className="space-y-6">
          <StepCard
            number={1}
            icon={<Coins className="w-5 h-5" />}
            title="Members Contribute Capital"
            description="Members contribute capital during defined subscription windows. Each contribution is converted into investment units at the prevailing NAV per unit, reflecting the current value of the fund."
            subtext="Earlier contributions typically acquire units at lower prices, while later contributions enter at higher NAVs as the fund grows—ensuring proportional ownership based on timing and amount contributed."
          />
          <StepCard
            number={2}
            icon={<MapPin className="w-5 h-5" />}
            title="Capital Is Deployed Strategically"
            description="Pooled capital is deployed into approved investment opportunities, with land banking as the primary focus. Assets are selected based on long-term growth potential, legal clarity, and alignment with the syndicate's risk framework."
            subtext="Where appropriate, capital may also be temporarily allocated to other low-to-medium risk instruments to preserve value and maintain liquidity."
          />
          <StepCard
            number={3}
            icon={<TrendingUp className="w-5 h-5" />}
            title="Assets Appreciate Over Time"
            description="As land assets appreciate—driven by market demand, infrastructure development, or strategic positioning—the total value of the fund increases. This growth is reflected directly in the Net Asset Value (NAV), increasing the value of each outstanding unit."
            subtext="No new units are created through appreciation; value growth is captured entirely through rising NAV."
          />
          <StepCard
            number={4}
            icon={<Users className="w-5 h-5" />}
            title="Value Is Realized and Distributed"
            description="Value is realized through asset sales, income generation, or structured liquidity events. Proceeds are distributed proportionally based on unit ownership, ensuring members participate fairly in gains relative to their contribution."
            subtext="Members may also redeem units during designated liquidity windows, subject to the fund's policies and available liquidity."
          />
        </div>
      </section>

      {/* Key Concepts */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-(--color-text) mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-gold) rounded-full" />
          Key Concepts
        </h2>

        <div className="space-y-4">
          <ConceptCard
            term="Net Asset Value (NAV)"
            definition="The Net Asset Value represents the total value of the syndicate's assets—land holdings and cash equivalents—minus any liabilities. NAV is recalculated periodically and reflects the current economic value of the fund."
          />
          <ConceptCard
            term="Units"
            definition="Units represent your economic ownership in Aeternum. When you contribute capital, you receive units priced at the current NAV per unit. Your percentage ownership is determined by the number of units you hold relative to the total units outstanding."
          />
          <ConceptCard
            term="Unit Price"
            definition="The unit price is the value of a single unit and is calculated as NAV ÷ Total Units Outstanding. As the value of the syndicate's assets increases or decreases, the unit price adjusts accordingly. Asset appreciation increases unit price; no new units are created through growth."
            formula="NAV ÷ Total Units Outstanding"
          />
          <ConceptCard
            term="Money Market Allocation"
            definition="Uninvested capital is held in low-risk, interest-bearing money market instruments. This allows capital to earn returns while awaiting deployment into long-term investments such as land, helping preserve value and manage liquidity."
          />
        </div>
      </section>

      {/* Example Scenario */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-(--color-text) mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-(--color-accent) rounded-full" />
          Example Scenario
        </h2>

        <div className="card p-6 space-y-6">
          <p className="text-(--color-text-secondary)">
            <strong className="text-(--color-text)">Scenario:</strong> You join Aeternum when the unit price is <strong className="text-(--color-accent)">₦100</strong>.
          </p>
          
          {/* Timeline */}
          <div className="space-y-4">
            <TimelineItem
              label="Year 0"
              title="Initial Contribution"
              details={[
                "You contribute ₦500,000",
                "You receive 5,000 units"
              ]}
            />
            <TimelineItem
              label="Year 2"
              title="First Appreciation"
              details={[
                "Land assets appreciate, unit price rises to ₦150",
                "Your units are now worth ₦750,000",
                "Gain: ₦250,000 (+50%)"
              ]}
              highlight
            />
            <TimelineItem
              label="Year 5"
              title="Continued Growth"
              details={[
                "Continued appreciation raises the unit price to ₦250",
                "Your 5,000 units are now worth ₦1,250,000"
              ]}
              highlight
            />
          </div>

          {/* What This Demonstrates */}
          <div className="pt-4 border-t border-(--color-border)">
            <h4 className="font-semibold text-(--color-text) mb-3">What This Demonstrates</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <li className="flex items-center gap-2 text-(--color-text-secondary)">
                <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent)" />
                Units remain constant once issued
              </li>
              <li className="flex items-center gap-2 text-(--color-text-secondary)">
                <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent)" />
                Growth is captured through rising unit price
              </li>
              <li className="flex items-center gap-2 text-(--color-text-secondary)">
                <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent)" />
                Returns are proportional to units held
              </li>
              <li className="flex items-center gap-2 text-(--color-text-secondary)">
                <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent)" />
                Timing and patience matter in long-term investing
              </li>
            </ul>
          </div>

          {/* Key Takeaway */}
          <div className="p-4 rounded-lg bg-(--color-gold)/10 border border-(--color-gold)/20">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-(--color-gold) shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-(--color-gold) mb-1">Key Takeaway</h4>
                <p className="text-sm text-(--color-text-secondary)">
                  You do not earn more by owning more units later—you earn more when the <strong className="text-(--color-text)">assets grow</strong>. 
                  The unit-based NAV model ensures transparency, fairness, and alignment across all members, 
                  regardless of contribution size or timing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <div className="flex items-center justify-between p-6 card bg-(--color-surface-elevated)">
        <div>
          <p className="text-sm text-(--color-text-muted) mb-1">Next</p>
          <p className="font-semibold text-(--color-text)">Fund Structure</p>
        </div>
        <Link 
          href="/docs/fund-structure" 
          className="btn-primary inline-flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}

function StepCard({ 
  number, 
  icon, 
  title, 
  description,
  subtext
}: { 
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  subtext?: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-(--color-accent) flex items-center justify-center text-(--color-primary-dark)">
          {icon}
        </div>
        {number < 4 && (
          <div className="w-0.5 h-full bg-(--color-border) my-2" />
        )}
      </div>
      <div className="flex-1 pb-6">
        <h3 className="font-semibold text-(--color-text) mb-2">
          {title}
        </h3>
        <p className="text-(--color-text-secondary) text-sm leading-relaxed mb-2">
          {description}
        </p>
        {subtext && (
          <p className="text-(--color-text-muted) text-sm leading-relaxed italic">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

function ConceptCard({ 
  term, 
  definition,
  formula
}: { 
  term: string;
  definition: string;
  formula?: string;
}) {
  return (
    <div className="p-4 rounded-lg border border-(--color-border) bg-(--color-surface)">
      <dt className="font-semibold text-(--color-accent) mb-2">{term}</dt>
      <dd className="text-sm text-(--color-text-secondary) leading-relaxed">{definition}</dd>
      {formula && (
        <div className="mt-3 px-3 py-2 rounded bg-(--color-primary-dark) inline-block">
          <code className="text-sm font-mono text-(--color-gold)">{formula}</code>
        </div>
      )}
    </div>
  );
}

function TimelineItem({
  label,
  title,
  details,
  highlight
}: {
  label: string;
  title: string;
  details: string[];
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg ${highlight ? 'bg-(--color-accent)/5 border border-(--color-accent)/20' : 'bg-(--color-primary-dark)'}`}>
      <div className="flex items-center gap-3 mb-2">
        <span className={`text-xs font-mono px-2 py-1 rounded ${highlight ? 'bg-(--color-accent)/20 text-(--color-accent)' : 'bg-(--color-surface-elevated) text-(--color-text-muted)'}`}>
          {label}
        </span>
        <span className="font-medium text-(--color-text)">{title}</span>
      </div>
      <ul className="space-y-1 ml-1">
        {details.map((detail, index) => (
          <li key={index} className="text-sm text-(--color-text-secondary) flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-(--color-text-muted)" />
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
}
