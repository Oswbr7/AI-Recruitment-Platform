import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Props = {
    collapsed: boolean;
};

export function UserSection({
    collapsed
}: Props) {

    return (

        <div className="border-t p-4">

            <div className="flex items-center gap-3">

                <Avatar>

                    <AvatarFallback>

                        OR

                    </AvatarFallback>

                </Avatar>

                {!collapsed && (

                    <div>

                        <p className="font-medium">

                            Oswaldo

                        </p>

                        <p className="text-xs text-muted-foreground">

                            Software Engineer

                        </p>

                    </div>

                )}

            </div>

        </div>

    );

}