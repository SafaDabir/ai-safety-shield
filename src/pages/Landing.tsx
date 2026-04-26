import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, Globe2, Lock, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShieldAILogo } from "@/components/ShieldAILogo";
import { ParticleField } from "@/components/ParticleField";

const Landing = () => {
  return (
    <div className="relative min-h-screen bg-hero overflow-hidden">
      <ParticleField />
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />

      {/* Nav */}
      <header className="relative z-10 mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <ShieldAILogo />
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#safety" className="hover:text-foreground transition-colors">Safety</a>
        </nav>
        <Link to="/app">
          <Button size="sm" variant="ghost" className="gap-1.5">
            Open app <ArrowRight className="size-4" />
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-16 md:pt-24 pb-24">
        <section className="text-center max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/20 text-xs text-muted-foreground mb-6">
            <Sparkles className="size-3 text-accent" />
            <span>AI-powered · Multilingual · Real-time</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]">
            Your real-time
            <br />
            <span className="text-gradient">digital safety</span> companion
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            ShieldAI analyzes any message in seconds — detecting threats, harassment,
            and manipulation across English, Hindi, and Hinglish. Stay safe with clear
            explanations and instant guidance.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
            <Link to="/app">
              <Button
                size="lg"
                className="gap-2 h-12 px-7 bg-gradient-to-r from-primary to-accent hover:opacity-90 border-0 text-primary-foreground font-medium animate-pulse-glow"
              >
                Try Now <ArrowRight className="size-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="h-12 px-7 border-border/70">
                Learn more
              </Button>
            </a>
          </div>

          {/* Visual demo card */}
          <div className="mt-16 mx-auto max-w-2xl animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="glass rounded-2xl p-5 text-left shadow-[0_30px_80px_-20px_hsl(262_83%_30%/0.5)]">
              <div className="text-xs text-muted-foreground mb-2">Example</div>
              <div className="rounded-lg bg-secondary/60 border border-border/60 p-3 text-sm">
                "If you don't send me money I will share your photos…"
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-destructive animate-pulse" />
                  <span className="text-sm font-medium text-destructive">Dangerous</span>
                  <span className="text-xs text-muted-foreground">· 96% confidence</span>
                </div>
                <span className="text-xs text-muted-foreground">Block · Report · Seek help</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 hover:border-primary/30 transition-colors group"
            >
              <div className="size-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="size-5" />
              </div>
              <h3 className="text-base font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          ))}
        </section>

        {/* How */}
        <section id="how" className="mt-32 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">How ShieldAI works</h2>
          <p className="mt-3 text-muted-foreground">Three steps. Seconds. Crystal clear guidance.</p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((s, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-left">
                <div className="text-xs text-accent font-mono mb-2">STEP 0{i + 1}</div>
                <h3 className="text-lg font-semibold mb-1.5">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Safety CTA */}
        <section id="safety" className="mt-32">
          <div className="glass rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{ background: "var(--gradient-primary)", filter: "blur(80px)" }}
              aria-hidden
            />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Built for everyone who chats online
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Free to try. No signup required. Your messages stay on your device unless
                you choose to save them as evidence.
              </p>
              <Link to="/app" className="inline-block mt-8">
                <Button
                  size="lg"
                  className="gap-2 h-12 px-7 bg-gradient-to-r from-primary to-accent hover:opacity-90 border-0 text-primary-foreground font-medium"
                >
                  Open ShieldAI <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/60 mt-10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <ShieldAILogo size={24} />
          <span>© {new Date().getFullYear()} ShieldAI. Stay safe out there.</span>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: Brain,
    title: "Context-aware AI",
    body: "Goes beyond keywords — understands intent, manipulation, and coercion patterns.",
  },
  {
    icon: Zap,
    title: "Real-time results",
    body: "Classification, confidence score, and tailored guidance in under a second.",
  },
  {
    icon: Globe2,
    title: "Multilingual",
    body: "Handles English, Hindi, and Hinglish out of the box. More languages coming.",
  },
  {
    icon: ShieldCheck,
    title: "Emergency guidance",
    body: "Surfaces the right helpline (112, 1091) and protective steps when it matters.",
  },
  {
    icon: Lock,
    title: "Evidence vault",
    body: "Save flagged messages with one click — timestamped and ready to share.",
  },
  {
    icon: Sparkles,
    title: "No setup",
    body: "Open and analyze. No accounts. No installs. Works on every device.",
  },
];

const steps = [
  { title: "Paste a message", body: "Drop in a DM, comment, or chat snippet you're unsure about." },
  { title: "Instant analysis", body: "AI classifies it as safe, suspicious, or dangerous — with reasoning." },
  { title: "Act with confidence", body: "Follow tailored guidance: ignore, block, report, or seek help." },
];

export default Landing;
