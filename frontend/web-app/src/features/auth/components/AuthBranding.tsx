import { BrainCircuit, Sparkles } from "lucide-react";

export function AuthBranding() {
    return (
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-12 text-white">

            <div className="flex items-center gap-3">
                <BrainCircuit className="h-10 w-10" />

                <div>
                    <h1 className="text-2xl font-bold">
                        AI Recruitment
                    </h1>

                    <p className="text-slate-300">
                        Smart Hiring Platform
                    </p>
                </div>
            </div>

            <div className="space-y-6">

                <Sparkles className="h-12 w-12 text-blue-300" />

                <h2 className="text-5xl font-bold leading-tight">
                    Hire Smarter.
                    <br />
                    Hire Faster.
                </h2>

                <p className="max-w-md text-lg text-slate-300 leading-relaxed">
                    Manage candidates, evaluate resumes with AI,
                    schedule interviews and streamline your hiring
                    process from one modern platform.
                </p>

            </div>

            <div className="text-sm text-slate-400">
                AI Recruitment Platform © 2026
            </div>

        </div>
    );
}