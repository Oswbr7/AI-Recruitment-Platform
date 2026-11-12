import { BrowserRouter, Routes, Route } from "react-router-dom";

import { lazy, Suspense } from "react";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { CandidatesPage } from "@/features/candidates/pages/CandidatesPage";
import { CandidateDetailPage } from "@/features/candidates/pages/CandidateDetailPage";
import { CandidatePipelinePage } from "@/features/candidates/pages/CandidatePipelinePage";
import { JobsPage } from "@/features/jobs/pages/JobsPage";
import { JobDetailPage } from "@/features/jobs/pages/JobDetailPage";
import { CompaniesPage } from "@/features/companies/pages/CompaniesPage";
import { CompanyDetailPage } from "@/features/companies/pages/CompanyDetailPage";
import { InterviewsPage } from "@/features/interviews/pages/InterviewsPage";
import { InterviewDetailPage } from "@/features/interviews/pages/InterviewDetailPage";
import { InterviewCalendarPage } from "@/features/interviews/pages/InterviewCalendarPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { MatchingPage } from "@/features/matching/pages/MatchingPage";
import { UsersAdminPage } from "@/features/users/pages/UsersAdminPage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";

// Showcase interno de componentes: SOLO disponible en desarrollo.
// Lazy-loaded para que no entre en el bundle de producción, y la ruta se
// elimina por completo en builds de prod (import.meta.env.DEV === false).
const UiShowcasePage = lazy(() =>
    import("@/features/ui/pages/UiShowcasePage").then((m) => ({
        default: m.UiShowcasePage,
    })),
);

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/register" element={<RegisterPage />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardPage />} />

                    <Route path="candidates" element={<CandidatesPage />} />

                    <Route path="candidates/pipeline" element={<CandidatePipelinePage />} />

                    <Route path="candidates/:id" element={<CandidateDetailPage />} />

                    <Route path="jobs" element={<JobsPage />} />

                    <Route path="jobs/:id" element={<JobDetailPage />} />

                    <Route path="companies" element={<CompaniesPage />} />

                    <Route path="company/:id" element={<CompanyDetailPage />} />

                    <Route path="interviews" element={<InterviewsPage />} />

                    <Route path="interviews/calendar" element={<InterviewCalendarPage />} />

                    <Route path="interviews/:id" element={<InterviewDetailPage />} />

                    {/* Dev-only: showcase interno de la librería de componentes */}
                    {import.meta.env.DEV && (
                        <Route
                            path="/ui"
                            element={
                                <Suspense fallback={null}>
                                    <UiShowcasePage />
                                </Suspense>
                            }
                        />
                    )}

                    <Route
                        path="matching"
                        element={
                            <ProtectedRoute roles={["Admin", "Recruiter"]}>
                                <MatchingPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="admin/users"
                        element={
                            <ProtectedRoute roles={["Admin"]}>
                                <UsersAdminPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
