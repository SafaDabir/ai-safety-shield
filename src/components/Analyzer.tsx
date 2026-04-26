import { useState, useEffect, useRef } from "react";
import { ShieldCheck, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RiskCard, type AnalysisResult } from "@/components/RiskCard";
import { HistoryPanel, type HistoryEntry } from "@/components/HistoryPanel";

const SAMPLES = [
  "Hey! Want to grab coffee tomorrow?",
  "If you don't send me money I will share your photos with everyone.",
  "Mujhe apna address bhejo, main aaj raat aa raha hoon. Akela rehna.",
  "Can you share your OTP, I just need it to verify quickly.",
];

const SESSION_KEY = "shieldai_session_id";
const HISTORY_KEY = "shieldai_history";

const getSessionId = () => {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

export const Analyzer = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const currentIdRef = useRef<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      try {
        setHistory(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
  }, []);

  const persist = (next: HistoryEntry[]) => {
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next.slice(0, 30)));
  };

  const analyze = async () => {
    const text = message.trim();
    if (!text) {
      toast.error("Please enter a message to analyze");
      return;
    }
    if (text.length > 4000) {
      toast.error("Message is too long (max 4000 characters)");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-message", {
        body: { message: text },
      });

      if (error) {
        const msg = (error as any)?.context?.error || error.message || "Analysis failed";
        if (msg.toLowerCase().includes("rate")) {
          toast.error("Rate limit reached. Try again in a moment.");
        } else if (msg.toLowerCase().includes("credit")) {
          toast.error("AI credits exhausted. Add credits to continue.");
        } else {
          toast.error(msg);
        }
        return;
      }

      if (!data || data.error) {
        toast.error(data?.error || "Analysis failed");
        return;
      }

      const r = data as AnalysisResult;
      const entry: HistoryEntry = {
        ...r,
        id: crypto.randomUUID(),
        message: text,
        timestamp: Date.now(),
      };
      currentIdRef.current = entry.id;
      setResult({ ...r, message: text });
      persist([entry, ...history]);

      if (r.risk_level === "dangerous") {
        toast.error("Dangerous content detected", { description: "Take protective action immediately." });
      } else if (r.risk_level === "suspicious") {
        toast.warning("Suspicious content flagged");
      } else {
        toast.success("Message looks safe");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveEvidence = async () => {
    if (!result || !currentIdRef.current) return;
    const id = currentIdRef.current;
    if (savedIds.has(id)) return;

    try {
      const { error } = await supabase.from("evidence").insert({
        session_id: getSessionId(),
        message: result.message ?? message,
        risk_level: result.risk_level,
        confidence: result.confidence,
        explanation: result.explanation,
        suggestion: result.suggestion,
      });
      if (error) throw error;
      setSavedIds((s) => new Set(s).add(id));
      toast.success("Saved as evidence");
    } catch (e) {
      console.error(e);
      toast.error("Could not save evidence");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-6">
        {/* Input */}
        <div className="glass rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-accent" />
            <span>Enter a message to analyze for safety</span>
          </div>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) analyze();
            }}
            placeholder="Paste a chat message, DM, comment, or anything you're unsure about…"
            className="min-h-[140px] resize-none bg-input/60 border-border/60 focus-visible:ring-primary/50 text-base"
            maxLength={4000}
          />

          <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
            <div className="text-xs text-muted-foreground">
              {message.length}/4000 · Press <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border/60 text-[10px]">⌘ Enter</kbd> to analyze
            </div>
            <Button
              onClick={analyze}
              disabled={loading || !message.trim()}
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity border-0 text-primary-foreground font-medium shadow-[0_0_30px_hsl(var(--primary)/0.4)]"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Analyzing…
                </>
              ) : (
                <>
                  <Send className="size-4" /> Analyze Message
                </>
              )}
            </Button>
          </div>

          {/* Sample chips */}
          <div className="mt-4 flex items-start gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Sparkles className="size-3" /> Try:
            </span>
            {SAMPLES.map((s, i) => (
              <button
                key={i}
                onClick={() => setMessage(s)}
                className="text-xs px-2.5 py-1.5 rounded-full border border-border/60 bg-secondary/60 hover:bg-secondary hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all"
              >
                {s.length > 50 ? s.slice(0, 50) + "…" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        {loading && <LoadingCard />}
        {!loading && result && (
          <RiskCard
            result={result}
            onSave={saveEvidence}
            saved={currentIdRef.current ? savedIds.has(currentIdRef.current) : false}
          />
        )}
        {!loading && !result && <EmptyState />}
      </div>

      <HistoryPanel
        entries={history}
        onSelect={(e) => {
          setMessage(e.message);
          setResult({
            risk_level: e.risk_level,
            confidence: e.confidence,
            explanation: e.explanation,
            suggestion: e.suggestion,
            flagged_terms: e.flagged_terms,
            message: e.message,
          });
          currentIdRef.current = e.id;
        }}
        onClear={() => {
          persist([]);
          toast.success("History cleared");
        }}
      />
    </div>
  );
};

const LoadingCard = () => (
  <div className="glass rounded-2xl p-8 animate-fade-in">
    <div className="flex items-center gap-3 mb-6">
      <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center">
        <Loader2 className="size-5 animate-spin text-primary" />
      </div>
      <div>
        <div className="text-sm font-medium">Analyzing your message…</div>
        <div className="text-xs text-muted-foreground">ShieldAI is reviewing context, intent, and risk signals.</div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-3 w-2/3 rounded shimmer bg-secondary" />
      <div className="h-3 w-full rounded shimmer bg-secondary" />
      <div className="h-3 w-4/5 rounded shimmer bg-secondary" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="glass rounded-2xl p-10 text-center animate-fade-in">
    <div className="mx-auto size-14 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-4">
      <ShieldCheck className="size-7 text-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-1">Real-time message analysis</h3>
    <p className="text-sm text-muted-foreground max-w-md mx-auto">
      Paste a message above and ShieldAI will classify it as safe, suspicious, or dangerous —
      with a confidence score, explanation, and concrete safety guidance.
    </p>
  </div>
);
