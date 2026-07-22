"use client";

import { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { SessionPayload } from "@/lib/auth";

interface Props {
    user: SessionPayload | null;
    children: React.ReactNode;
}

export default function AppShell({ user, children }: Props) {

    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#F5F7FA]">

            <Sidebar
                user={user}
                open={mobileOpen}
                onNavigate={() => setMobileOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col">

                <Header user={user} onMenuClick={() => setMobileOpen((v) => !v)} />

                <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>

                <Footer />

            </div>

        </div>
    );

}
