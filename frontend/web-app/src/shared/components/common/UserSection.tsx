import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useAuthStore } from "@/features/auth/store/authStore";

type Props = {
    collapsed: boolean;
};

function getInitials(fullName: string) {

    return fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase())
        .join("");

}

export function UserSection({
    collapsed
}: Props) {

    const user = useAuthStore((state) => state.user);

    if (!user) {

        return null;

    }

    return (

        <div className="border-t p-4">

            <div className="flex items-center gap-3">

                <Avatar>

                    <AvatarFallback>

                        {getInitials(user.fullName)}

                    </AvatarFallback>

                </Avatar>

                {!collapsed && (

                    <div>

                        <p className="font-medium">

                            {user.fullName}

                        </p>

                        <p className="text-xs text-muted-foreground">

                            {user.email}

                        </p>

                    </div>

                )}

            </div>

        </div>

    );

}
