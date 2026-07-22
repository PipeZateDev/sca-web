import {
    LayoutDashboard,
    Users,
    ClipboardCheck,
    Clock3,
    FileBarChart2,
    Settings,
    CalendarDays,
    UserCircle,
    Upload
} from "lucide-react";

import { MenuItem } from "@/types/menu";

export const menu: MenuItem[] = [

    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },

    {
        title: "Empleados",
        href: "/empleados",
        icon: Users,
    },

    {
        title: "Asistencia",
        href: "/asistencia",
        icon: ClipboardCheck,
    },

    {
        title: "Importación",
        href: "/importacion",
        icon: Upload,
    },

    {
        title: "Horarios",
        href: "/horarios",
        icon: Clock3,
    },

    {
        title: "Reportes",
        href: "/reportes",
        icon: FileBarChart2,
    },

    {
        title: "Festivos",
        href: "/festivos",
        icon: CalendarDays,
    },

    {
        title: "Configuración",
        href: "/configuracion",
        icon: Settings,
        roles: ["ADMINISTRADOR"],
    },

    {
        title: "Mi Perfil",
        href: "/perfil",
        icon: UserCircle,
    },

];