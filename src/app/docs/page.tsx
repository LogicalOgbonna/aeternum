import {
  ArrowRight,
  BookOpen,
  Coins,
  Scale,
  Users,
  Workflow
} from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <article className='animate-fade-in'>
      {/* Hero Section */}
      <div className='mb-12'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-12 h-12 rounded-xl bg-linear-to-br from-(--color-accent) to-(--color-gold) flex items-center justify-center'>
            <BookOpen className='w-6 h-6 text-(--color-primary-dark)' />
          </div>
          <div>
            <p className='text-sm text-(--color-accent) font-medium'>
              Documentation
            </p>
            <h1 className='text-3xl font-bold text-(--color-text)'>
              Welcome to Aeternum
            </h1>
          </div>
        </div>
        <p className='text-md text-(--color-text-secondary) leading-relaxed max-w-full text-justify'>
          Aeternum is a member-owned investment syndicate built for long-term
          capital growth. Capital is pooled and invested across selected asset
          classes, with land banking as the foundational strategy. The syndicate
          also allocates capital to other low-to-medium risk investments where
          appropriate. Ownership is tracked through a unit-based Net Asset Value
          (NAV) model, ensuring fair participation and transparent valuation as
          assets appreciate over time.
        </p>
      </div>

      {/* Overview Section */}
      <section className='mb-10'>
        <h2 className='text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2'>
          <span className='w-1 h-6 bg-(--color-accent) rounded-full' />
          Overview
        </h2>
        <div className='prose-custom text-justify'>
          <p>
            Aeternum is a member-owned investment syndicate established to
            enable long-term capital growth through disciplined, transparent,
            and collectively governed investing. The syndicate brings together
            aligned members to pool capital and deploy it across carefully
            selected asset classes, guided by a long-term outlook rather than
            short-term speculation.
          </p>
          <p>
            While land banking serves as Aeternum’s foundational
            strategy—reflecting our belief in the long-term value of
            strategically acquired land—the syndicate is not limited to land
            alone. Capital may also be allocated to other low-to-medium risk
            investments such as money market instruments, income-generating real
            estate, and select alternative assets, where such opportunities
            align with the syndicate’s risk framework, liquidity needs, and
            long-term objectives. This flexibility allows Aeternum to preserve
            capital, manage cash efficiently, and deploy funds opportunistically
            while maintaining a conservative risk posture.
          </p>
          <p>
            Aeternum operates using a unit-based Net Asset Value (NAV) model.
            Members do not own fixed percentages of the syndicate; instead, each
            member’s economic stake is represented by units acquired through
            capital contributions. Units are priced based on the prevailing NAV
            per unit at the time of contribution, ensuring fair and proportional
            participation regardless of when or how much a member contributes.
            As the value of the syndicate’s underlying assets appreciates or
            generates income, the NAV increases, and so does the value of each
            unit held.
          </p>
          <p>
            Governance within Aeternum is deliberately separated from capital
            contribution size. Decision-making authority, voting rights, and
            operational oversight are governed by defined rules and structures
            designed to protect the collective interest of the syndicate and
            prevent concentration of control. This separation ensures that
            financial contribution does not translate into unchecked influence,
            preserving fairness, accountability, and long-term alignment among
            members.
          </p>
          <p>
            This documentation serves as the authoritative reference for how
            Aeternum operates. It outlines the syndicate’s structure, membership
            rules, contribution mechanics, investment processes, valuation
            methodology, governance framework, and distribution principles.
            Together, these guidelines are designed to protect capital, manage
            risk, and sustain trust among members over the long term.
          </p>
        </div>
      </section>

      {/* Key Principles */}
      <section className='mb-10'>
        <h2 className='text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2'>
          <span className='w-1 h-6 bg-(--color-gold) rounded-full' />
          Key Principles
        </h2>
        <div className='space-y-4'>
          <PrincipleCard
            number='01'
            title='Transparency'
            description='All transactions, valuations, and decisions are recorded and accessible to members. The NAV is updated in real-time based on auditable metrics.'
          />
          <PrincipleCard
            number='02'
            title='Equity'
            description='Each unit represents equal ownership in the fund. No member receives preferential treatment regardless of their contribution size.'
          />
          <PrincipleCard
            number='03'
            title='Collective Governance'
            description='Major decisions are made through member voting. Constitutional amendments require supermajority approval.'
          />
          <PrincipleCard
            number='04'
            title='Long-term Focus'
            description='Land banking is a patient strategy. Members commit to multi-year horizons and understand that value appreciation takes time.'
          />
        </div>
      </section>

      {/* Getting Started */}
      <section className='mb-10'>
        <h2 className='text-xl font-semibold text-(--color-text) mb-4 flex items-center gap-2'>
          <span className='w-1 h-6 bg-(--color-accent) rounded-full' />
          Getting Started
        </h2>
        <div className='prose-custom'>
          <p>
            If you&apos;re new to the syndicate, we recommend reading through
            the following sections in order:
          </p>
          {/* Quick Navigation Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-12'>
            <QuickCard
              href='/docs/how-it-works'
              icon={<Workflow className='w-5 h-5' />}
              title='How It Works'
              description='Understanding the basic mechanics of the syndicate.'
            />
            <QuickCard
              href='/docs/fund-structure'
              icon={<Scale className='w-5 h-5' />}
              title='Fund Structure'
              description='Learn about our unit-based NAV model and how ownership is calculated.'
            />
            <QuickCard
              href='/docs/membership'
              icon={<Users className='w-5 h-5' />}
              title='Membership'
              description='Understand member rights, responsibilities, and participation rules.'
            />
            <QuickCard
              href='/docs/contributions'
              icon={<Coins className='w-5 h-5' />}
              title='Contributions'
              description='How contributions work, unit pricing, and subscription windows.'
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className='card p-6 bg-linear-to-br from-(--color-accent)/10 to-(--color-gold)/10 border-(--color-accent)/20'>
        <h3 className='text-lg font-semibold text-(--color-text) mb-2'>
          Ready to explore the simulation?
        </h3>
        <p className='text-(--color-text-secondary) mb-4'>
          Use our interactive simulator to see how the fund operates with sample
          data.
        </p>
        <Link
          href='/dashboard'
          className='btn-primary inline-flex items-center gap-2'
        >
          Go to Dashboard
          <ArrowRight className='w-4 h-4' />
        </Link>
      </div>
    </article>
  );
}

function QuickCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className='card p-5 group hover:border-(--color-accent)/50 transition-all duration-200'
    >
      <div className='flex items-start gap-4'>
        <div className='w-10 h-10 rounded-lg bg-(--color-surface-elevated) flex items-center justify-center text-(--color-accent) group-hover:bg-(--color-accent)/10 transition-colors'>
          {icon}
        </div>
        <div className='flex-1'>
          <h3 className='font-semibold text-(--color-text) mb-1 group-hover:text-(--color-accent) transition-colors'>
            {title}
          </h3>
          <p className='text-sm text-(--color-text-secondary)'>{description}</p>
        </div>
        <ArrowRight className='w-4 h-4 text-(--color-text-muted) group-hover:text-(--color-accent) group-hover:translate-x-1 transition-all' />
      </div>
    </Link>
  );
}

function PrincipleCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className='flex gap-4 p-4 rounded-lg bg-(--color-surface-elevated)/50 border border-(--color-border)'>
      <div className='text-2xl font-bold text-(--color-accent)/30 font-mono'>
        {number}
      </div>
      <div>
        <h3 className='font-semibold text-(--color-text) mb-1'>{title}</h3>
        <p className='text-sm text-(--color-text-secondary)'>{description}</p>
      </div>
    </div>
  );
}
