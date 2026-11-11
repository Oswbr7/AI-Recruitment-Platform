import { toast } from "sonner";

import { PageContainer } from "@/shared/components/page/PageContainer";
import { PageHeader } from "@/shared/components/page/PageHeader";
import { LoadingSpinner } from "@/shared/components/loading/LoadingSpinner";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useAuthStore } from "@/features/auth/store/authStore";

import { useUsers } from "../hooks/useUsers";
import { useChangeUserRole } from "../hooks/useChangeUserRole";
import { ROLE_VALUES } from "../types/UserListItem";
import type { UserListItem } from "../types/UserListItem";

function RoleSelect({ user, currentUserId }: { user: UserListItem; currentUserId?: string }) {
    const changeRole = useChangeUserRole();

    const isSelf = user.id === currentUserId;

    function handleChange(role: string) {
        changeRole.mutate(
            { id: user.id, role },
            {
                onSuccess: () =>
                    toast.success(`${user.fullName} is now ${role}.`),
                onError: () =>
                    toast.error("Could not change the role. Are you an Admin?"),
            }
        );
    }

    return (
        <select
            className="rounded-md border bg-background px-3 py-1.5 text-sm disabled:opacity-50"
            value={user.role}
            disabled={isSelf || changeRole.isPending}
            title={isSelf ? "You can't change your own role." : undefined}
            onChange={(e) => handleChange(e.target.value)}
        >
            {ROLE_VALUES.map((role) => (
                <option key={role} value={role}>
                    {role}
                </option>
            ))}
        </select>
    );
}

export function UsersAdminPage() {
    const { data, isLoading } = useUsers();
    const currentUserId = useAuthStore((s) => s.user?.id);

    return (
        <PageContainer>

            <PageHeader
                title="Users"
                description="Administer platform roles: promote recruiters or grant admin access. Role changes apply immediately."
            />

            {isLoading ? (
                <LoadingSpinner />
            ) : !data || data.length === 0 ? (
                <EmptyState
                    title="No users yet"
                    description="Registered users will appear here."
                />
            ) : (
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.fullName}
                                        {user.id === currentUserId && (
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                (you)
                                            </span>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-muted-foreground">
                                        {user.email}
                                    </TableCell>

                                    <TableCell>
                                        <RoleSelect
                                            user={user}
                                            currentUserId={currentUserId}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

        </PageContainer>
    );
}
