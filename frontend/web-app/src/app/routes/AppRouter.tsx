import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { CandidatesPage } from '@/features/candidates/pages/CandidatesPage';
import { CandidateDetailPage } from '@/features/candidates/pages/CandidateDetailPage';
import { CandidatePipelinePage } from '@/features/candidates/pages/CandidatePipelinePage';
import { JobsPage } from '@/features/jobs/pages/JobsPage';
import { JobDetailPage } from '@/features/jobs/pages/JobDetailPage';
import { CompaniesPage } from '@/features/companies/pages/CompaniesPage';
import { CompanyDetailPage } from '@/features/companies/pages/CompanyDetailPage';
import { InterviewsPage } from '@/features/interviews/pages/InterviewsPage';
import { InterviewDetailPage } from '@/features/interviews/pages/InterviewDetailPage';
import { InterviewCalendarPage } from '@/features/interviews/pages/InterviewCalendarPage';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '@/shared/layouts/DashboardLayout';
import { UiShowcasePage } from '@/features/ui/pages/UiShowcasePage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />
        
        <Route
          element={
              <ProtectedRoute>
                  <DashboardLayout />
              </ProtectedRoute>
          }
      >
          <Route
              index
              element={<DashboardPage />}
          />

          <Route
              path="candidates"
              element={<CandidatesPage />}
          />

          <Route
              path="candidates/pipeline"
              element={<CandidatePipelinePage />}
          />

          <Route
              path="candidates/:id"
              element={<CandidateDetailPage />}
          />

          <Route
              path="jobs"
              element={<JobsPage />}
          />

          <Route
              path="jobs/:id"
              element={<JobDetailPage />}
          />

          <Route
              path="companies"
              element={<CompaniesPage />}
          />

          <Route
              path="company/:id"
              element={<CompanyDetailPage />}
          />

          <Route
              path="interviews"
              element={<InterviewsPage />}
          />

          <Route
              path="interviews/calendar"
              element={<InterviewCalendarPage />}
          />

          <Route
              path="interviews/:id"
              element={<InterviewDetailPage />}
          />

          <Route
                path="/ui"
                element={<UiShowcasePage/>}
            />

          {/* <Route
              path="matching"
              element={<MatchingPage />}
          /> */}

          {/* <Route
              path="settings"
              element={<SettingsPage />}
          /> */}
      </Route>
      </Routes>
    </BrowserRouter>
  );
}