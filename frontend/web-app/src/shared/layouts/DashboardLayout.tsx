import { Outlet } from "react-router-dom";

import { Sidebar } from "@/shared/components/navigation/Sidebar";
import { Navbar } from "@/shared/components/navigation/Navbar";

export function DashboardLayout() {

    return (

        <div className="flex h-screen bg-muted/20">

            <Sidebar />

            <div className="flex flex-1 flex-col">

                <Navbar />

                <main className="flex-1 overflow-auto p-8">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}