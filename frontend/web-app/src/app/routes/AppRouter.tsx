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
                path="/ui"
                element={<UiShowcasePage/>}
            />

          {/* <Route
              path="matching"
              element={<MatchingPage />}
          /> */}

          {/* <Route
              path="interviews"
              element={<InterviewsPage />}
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