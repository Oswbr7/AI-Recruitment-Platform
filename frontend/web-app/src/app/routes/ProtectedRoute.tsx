import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";

type Props = {
    children: React.ReactNode;
    /** Si se indica, el usuario debe tener uno de estos roles (claim "role"). */
    roles?: string[];
};

export function ProtectedRoute({ children, roles }: Props) {
    const token = useAuthStore((s) => s.accessToken);

    const role = useAuthStore((s) => s.user?.role);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (roles && (!role || !roles.includes(role))) {
        // Autenticado pero sin permiso: de vuelta al dashboard.
        return <Navigate to="/" replace />;
    }

    return children;
}
