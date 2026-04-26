import { History, Trash2, ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";
import type { AnalysisResult, RiskLevel } from "./RiskCard";
import { cn } from "@/lib/utils";

export interface HistoryEntry extends AnalysisResult {
  id: string;
  message: string;
  timestamp: number;
}

interface Props {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

const iconFor = (r: RiskLevel) =>
  r === "safe" ? ShieldCheck : r === "suspicious" ? AlertTriangle : ShieldAlert;

const colorFor = (r: RiskLevel) =>
  r === "safe" ? "text-success" : r === "suspicious" ? "text-warning" : "text-destructive";

export const HistoryPanel = ({ entries, onSelect, onClear }: Props) => {
  return (
    <aside className="glass rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold tracking-tight">History</h2>
        </div>
        {entries.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
          >
            <Trash2 className="size-3" /> Clear
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-10 text-sm text-muted-foreground">
          No analyses yet.
          <br />
          Your recent checks will appear here.
        </div>
      ) : (
        <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {entries.map((e) => {
            const Icon = iconFor(e.risk_level);
            return (
              <li key={e.id}>
                <button
                  onClick={() => onSelect(e)}
                  className="w-full text-left rounded-xl border border-border/60 bg-card/40 hover:bg-card/80 hover:border-primary/40 transition-all p-3 group"
                >
                  <div className="flex items-start gap-3">
                    <Icon className={cn("size-4 mt-0.5 shrink-0", colorFor(e.risk_level))} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm line-clamp-2 break-words">{e.message}</div>
                      <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-2">
                        <span className={cn("uppercase font-medium tracking-wide", colorFor(e.risk_level))}>
                          {e.risk_level}
                        </span>
                        <span>·</span>
                        <span>{Math.round(e.confidence * 100)}%</span>
                        <span>·</span>
                        <span>{new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
};
