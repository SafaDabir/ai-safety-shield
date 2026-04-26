import { Shield } from "lucide-react";
import logo from "@/assets/shieldai-logo.png";

interface ShieldAILogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export const ShieldAILogo = ({ size = 32, showWordmark = true, className = "" }: ShieldAILogoProps) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative">
        <div
          className="absolute inset-0 rounded-xl blur-lg opacity-60"
          style={{ background: "var(--gradient-primary)" }}
          aria-hidden
        />
        <img
          src={logo}
          alt="ShieldAI logo"
          width={size}
          height={size}
          className="relative rounded-xl"
          onError={(e) => {
            // Fallback if image fails
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight">
          Shield<span className="text-gradient">AI</span>
        </span>
      )}
    </div>
  );
};

export const ShieldIcon = ({ className = "" }: { className?: string }) => (
  <Shield className={className} strokeWidth={2} />
);
