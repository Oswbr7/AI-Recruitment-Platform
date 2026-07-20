import { BrainCircuit } from "lucide-react";

type Props = {
  collapsed?: boolean;
};

export function AppLogo({ collapsed }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-6">
      <BrainCircuit className="h-8 w-8 text-primary" />

      {!collapsed && (
        <div>
          <p className="font-semibold">AI Recruitment</p>

          <p className="text-xs text-muted-foreground">
            Smart Hiring Platform
          </p>
        </div>
      )}
    </div>
  );
}