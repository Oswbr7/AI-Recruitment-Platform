import { PanelLeft, LogOut, Sun, Moon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useLayoutStore } from "@/shared/store/layoutStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useNavigate } from "react-router-dom";

export function Navbar() {

    const toggle =
        useLayoutStore(
            state => state.toggleSidebar
        );
    
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (

        <header className="flex h-16 items-center border-b px-6 justify-between">
            
            <Sun/>

            <Moon/>

            <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
            >

                <PanelLeft className="h-5 w-5" />

            </Button>
            
            {user && (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" className="cursor-pointer">
                            {user.fullName}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled>
                            {user.email}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

        </header>

    );
}