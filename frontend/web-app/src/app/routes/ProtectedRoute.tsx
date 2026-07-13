import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({
  children
}: Props) {
  const token =
    useAuthStore((s) => s.accessToken);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}