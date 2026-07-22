"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { menu } from "@/config/menu";
import { MenuChildItem, MenuItem } from "@/types/menu";
import { SessionPayload } from "@/lib/auth";
import { Role } from "@/types/user";

interface Props {
    user: SessionPayload | null;
    open: boolean;
    onNavigate: () => void;
}

function childVisible(child: MenuChildItem, rol?: Role) {
    return !child.roles || (!!rol && child.roles.includes(rol));
}

function itemVisible(item: MenuItem, rol?: Role) {

    if (item.children) {
        return item.children.some((child) => childVisible(child, rol));
    }

    return !item.roles || (!!rol && item.roles.includes(rol));

}

export default function Sidebar({ user, open, onNavigate }: Props) {

    const pathname = usePathname();

    const itemsVisibles = menu.filter((item) => itemVisible(item, user?.rol));

    const [grupoAbierto, setGrupoAbierto] = useState<string | null>(() => {

        const activo = itemsVisibles.find((item) =>
            item.children?.some((child) => pathname.startsWith(child.href))
        );

        return activo?.title ?? null;

    });

    return (

        <>

            {open && (

                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={onNavigate}
                />

            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col
                    bg-[#0B4F8A] text-white shadow-xl transition-transform duration-300
                    md:static md:translate-x-0
                    ${open ? "translate-x-0" : "-translate-x-full"}
                `}
            >

                <div className="flex items-center justify-center border-b border-blue-700 p-6">
                    <Image
                        src="/logo/logo-horizontal.png"
                        alt="Colegio Nuevo San Luis Gonzaga"
                        width={180}
                        height={70}
                        priority
                        className="h-auto w-auto"
                    />
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-5">

                    {itemsVisibles.map((item) => {

                        const Icon = item.icon;

                        if (item.children) {

                            const hijosVisibles = item.children.filter((child) =>
                                childVisible(child, user?.rol)
                            );

                            const abierto = grupoAbierto === item.title;

                            const contieneActivo = hijosVisibles.some((child) =>
                                pathname.startsWith(child.href)
                            );

                            return (

                                <div key={item.title} className="mb-2">

                                    <button
                                        type="button"
                                        onClick={() => setGrupoAbierto(abierto ? null : item.title)}
                                        className={`
                                            flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3
                                            transition-all duration-200
                                            ${contieneActivo ? "bg-[#1565A9]" : "hover:bg-[#1565A9]"}
                                        `}
                                    >

                                        <span className="flex items-center gap-4">
                                            <Icon size={22} />
                                            <span className="font-medium">{item.title}</span>
                                        </span>

                                        <ChevronDown
                                            size={18}
                                            className={`transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}
                                        />

                                    </button>

                                    {abierto && (

                                        <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-blue-700 pl-4">

                                            {hijosVisibles.map((child) => {

                                                const active = pathname === child.href;

                                                return (

                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        onClick={onNavigate}
                                                        className={`
                                                            rounded-lg px-3 py-2 text-sm transition-all duration-200
                                                            ${active ? "bg-white text-[#0B4F8A] shadow" : "hover:bg-[#1565A9]"}
                                                        `}
                                                    >
                                                        {child.title}
                                                    </Link>

                                                );

                                            })}

                                        </div>

                                    )}

                                </div>

                            );

                        }

                        const active = pathname === item.href;

                        return (

                            <Link
                                key={item.href}
                                href={item.href!}
                                onClick={onNavigate}
                                className={`
                                    mb-2 flex items-center gap-4 rounded-xl px-4 py-3
                                    transition-all duration-200
                                    ${active ? "bg-white text-[#0B4F8A] shadow-lg" : "hover:bg-[#1565A9]"}
                                `}
                            >

                                <Icon size={22} />
                                <span className="font-medium">{item.title}</span>

                            </Link>

                        );

                    })}

                </nav>

                <div className="border-t border-blue-700 p-5 text-center">
                    <p className="text-sm opacity-80">SCA WEB</p>
                    <p className="text-xs opacity-60">Versión 0.2.0</p>
                </div>

            </aside>

        </>

    );

}
