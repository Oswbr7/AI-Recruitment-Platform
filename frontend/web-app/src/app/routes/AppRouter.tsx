import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { CandidatesPage } from '@/features/candidates/pages/CandidatesPage';
import { JobsPage } from '@/features/jobs/pages/JobsPage';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route element={<ProtectedRoute />}>

            <Route
                path="/"
                element={<DashboardPage />}
            />

            <Route
                path="/candidates"
                element={<CandidatesPage />}
            />

            <Route
                path="/jobs"
                element={<JobsPage />}
            />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}