import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ShieldAILogo } from "@/components/ShieldAILogo";
import { ParticleField } from "@/components/ParticleField";
import { Analyzer } from "@/components/Analyzer";

const AppPage = () => {
  return (
    <div className="relative min-h-screen bg-hero">
      <ParticleField />
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />

      <header className="relative z-10 mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <ShieldAILogo />
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> Home
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-8 max-w-2xl animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Analyze a message
          </h1>
          <p className="mt-2 text-muted-foreground">
            Paste any text — chat message, DM, comment, or email — and get an instant safety assessment.
          </p>
        </div>

        <Analyzer />
      </main>
    </div>
  );
};

export default AppPage;
