import { Outlet } from "react-router-dom";
import { Sidebar } from "@/shared/components/Sidebar";
import { Navbar } from "@/shared/components/Navbar";

export function DashboardLayout() {
    return (
        <div className="flex h-screen">

            <Sidebar />

            <div className="flex flex-1 flex-col">

                <Navbar />

                <main className="flex-1 overflow-auto p-8 bg-slate-100">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}