import { CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type RiskLevel = "safe" | "suspicious" | "dangerous";

export interface AnalysisResult {
  risk_level: RiskLevel;
  confidence: number;
  explanation: string;
  suggestion: string;
  flagged_terms?: string[];
  message?: string;
}

const config: Record<
  RiskLevel,
  {
    label: string;
    icon: typeof CheckCircle2;
    badge: string;
    bar: string;
    glow: string;
    border: string;
    chip: string;
  }
> = {
  safe: {
    label: "Safe",
    icon: CheckCircle2,
    badge: "bg-success/15 text-success border-success/30",
    bar: "bg-success",
    glow: "shadow-[0_0_40px_hsl(var(--success)/0.35)]",
    border: "border-success/30",
    chip: "bg-success/10 text-success border-success/20",
  },
  suspicious: {
    label: "Suspicious",
    icon: AlertTriangle,
    badge: "bg-warning/15 text-warning border-warning/30",
    bar: "bg-warning",
    glow: "shadow-[0_0_40px_hsl(var(--warning)/0.35)]",
    border: "border-warning/30",
    chip: "bg-warning/10 text-warning border-warning/20",
  },
  dangerous: {
    label: "Dangerous",
    icon: ShieldAlert,
    badge: "bg-destructive/15 text-destructive border-destructive/30",
    bar: "bg-destructive",
    glow: "shadow-[0_0_40px_hsl(var(--destructive)/0.45)]",
    border: "border-destructive/40",
    chip: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

interface Props {
  result: AnalysisResult;
  onSave?: () => void;
  saved?: boolean;
}

export const RiskCard = ({ result, onSave, saved }: Props) => {
  const c = config[result.risk_level];
  const Icon = c.icon;
  const pct = Math.round(result.confidence * 100);

  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 md:p-8 animate-scale-in",
        c.border,
        c.glow,
      )}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={cn("p-3 rounded-xl border", c.badge)}>
            <Icon className="size-6" strokeWidth={2.2} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Risk Level
            </div>
            <div className="text-2xl font-semibold mt-0.5">{c.label}</div>
          </div>
        </div>

        {onSave && (
          <Button
            onClick={onSave}
            disabled={saved}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Save className="size-4" />
            {saved ? "Saved" : "Save as evidence"}
          </Button>
        )}
      </div>

      {/* Confidence bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Confidence</span>
          <span className="font-mono text-foreground">{pct}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-[width] duration-700", c.bar)}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-6 space-y-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Sparkles className="size-3" /> AI Explanation
          </div>
          <p className="text-sm md:text-base leading-relaxed text-foreground/90">
            {result.explanation}
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
            Safety Suggestion
          </div>
          <p className="text-sm md:text-base leading-relaxed text-foreground/90">
            {result.suggestion}
          </p>
        </div>

        {result.flagged_terms && result.flagged_terms.length > 0 && (
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Flagged signals
            </div>
            <div className="flex flex-wrap gap-2">
              {result.flagged_terms.map((t, i) => (
                <span
                  key={i}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs border font-medium",
                    c.chip,
                  )}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.risk_level === "dangerous" && <EmergencyBlock />}
      </div>
    </div>
  );
};

const EmergencyBlock = () => (
  <div className="mt-2 rounded-xl border border-destructive/40 bg-destructive/5 p-4">
    <div className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2">
      <ShieldAlert className="size-4" /> Emergency Help
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
      <a
        href="tel:112"
        className="rounded-lg border border-border/60 bg-card/60 px-3 py-2 hover:border-destructive/40 transition-colors"
      >
        <div className="text-xs text-muted-foreground">Emergency (India)</div>
        <div className="font-mono font-semibold">Call 112</div>
      </a>
      <a
        href="tel:1091"
        className="rounded-lg border border-border/60 bg-card/60 px-3 py-2 hover:border-destructive/40 transition-colors"
      >
        <div className="text-xs text-muted-foreground">Women Helpline</div>
        <div className="font-mono font-semibold">Call 1091</div>
      </a>
    </div>
  </div>
);
