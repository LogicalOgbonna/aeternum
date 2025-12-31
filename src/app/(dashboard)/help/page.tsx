'use client';

import { HelpCircle } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="space-y-6 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
      <div className="text-center">
        <HelpCircle className="w-16 h-16 text-(--color-accent) mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-(--color-text)">
          Help is coming your way
        </h1>
        <p className="text-(--color-text-muted) mt-2">
          We&apos;re working on comprehensive documentation and guides.
        </p>
      </div>
    </div>
  );
}

