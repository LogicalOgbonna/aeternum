import type { Metadata } from "next";
import { DocsHeader } from "@/components/docs/DocsHeader";
import { DocsSidebar } from "@/components/docs/DocsSidebar";

export const metadata: Metadata = {
  title: "Documentation | Aeternum Limited",
  description: "Rules, constitution, and guidelines for Aeternum Investment Syndicate",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-(--color-bg)">
      <DocsHeader />
      <div className="flex">
        <DocsSidebar />
        <main className="flex-1 ml-64 pt-16">
          <div className="max-w-4xl mx-auto px-8 py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

