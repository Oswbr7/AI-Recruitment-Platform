import { useAuthStore } from "@/features/auth/store/authStore";

export function DashboardPage() {
    const user = useAuthStore((state) => state.user);
    
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-muted-foreground">Welcome {user?.fullName || 'User'}</p>
        </div>
    );
}