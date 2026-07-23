import {
    LayoutDashboard,
    Users,
    FileBarChart2,
    Settings,
    CalendarDays,
    GraduationCap
} from "lucide-react";

import { MenuItem } from "@/types/menu";

export const menu: MenuItem[] = [

    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },

    {
        title: "Personal",
        icon: Users,
        children: [
            { title: "Empleados", href: "/empleados" },
            { title: "Asistencia", href: "/asistencia", roles: ["ADMINISTRADOR", "COORDINADOR"] },
            { title: "Horarios", href: "/horarios", roles: ["ADMINISTRADOR", "COORDINADOR"] },
            { title: "Importación", href: "/importacion", roles: ["ADMINISTRADOR", "COORDINADOR"] },
        ],
    },

    {
        title: "Estudiantes",
        href: "/estudiantes",
        icon: GraduationCap,
    },

    {
        title: "Festivos",
        href: "/festivos",
        icon: CalendarDays,
        roles: ["ADMINISTRADOR", "COORDINADOR"],
    },

    {
        title: "Reportes",
        href: "/reportes",
        icon: FileBarChart2,
    },

    {
        title: "Configuración",
        href: "/configuracion",
        icon: Settings,
        roles: ["ADMINISTRADOR"],
    },

];
