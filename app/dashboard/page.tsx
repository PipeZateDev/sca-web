import MainLayout from "@/components/layout/MainLayout";

import PageTitle from "@/components/ui/PageTitle";
import Section from "@/components/ui/Section";
import StatCard from "@/components/ui/StatCard";

import {
    Users,
    ClipboardCheck,
    Clock3,
    UserX,
    Upload,
    FileBarChart2,
    CalendarClock,
    UserPlus
} from "lucide-react";

export default function DashboardPage() {

    const empleados = 0;
    const asistencias = 0;
    const tardanzas = 0;
    const ausencias = 0;

    const hora = new Date().getHours();

    let saludo = "Buenas noches";

    if (hora < 12)
        saludo = "Buenos días";

    else if (hora < 18)
        saludo = "Buenas tardes";

    return (

        <MainLayout>

            <PageTitle

                title={`${saludo}, Juan Felipe 👋`}

                subtitle="Bienvenido al Sistema de Control de Asistencia"

            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <StatCard
                    title="Empleados"
                    value={empleados}
                    icon={Users}
                    color="#0B4F8A"
                />

                <StatCard
                    title="Asistencias Hoy"
                    value={asistencias}
                    icon={ClipboardCheck}
                    color="#0A8A2A"
                />

                <StatCard
                    title="Tardanzas"
                    value={tardanzas}
                    icon={Clock3}
                    color="#F59E0B"
                />

                <StatCard
                    title="Ausencias"
                    value={ausencias}
                    icon={UserX}
                    color="#DC2626"
                />

            </div>

            <Section title="Accesos rápidos">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                    <button className="rounded-xl border bg-white p-6 hover:shadow-lg transition text-center">

                        <Upload className="mx-auto mb-3 text-blue-700" />

                        Importar

                    </button>

                    <button className="rounded-xl border bg-white p-6 hover:shadow-lg transition text-center">

                        <UserPlus className="mx-auto mb-3 text-green-700" />

                        Empleados

                    </button>

                    <button className="rounded-xl border bg-white p-6 hover:shadow-lg transition text-center">

                        <CalendarClock className="mx-auto mb-3 text-orange-600" />

                        Horarios

                    </button>

                    <button className="rounded-xl border bg-white p-6 hover:shadow-lg transition text-center">

                        <FileBarChart2 className="mx-auto mb-3 text-purple-700" />

                        Reportes

                    </button>

                </div>

            </Section>

        </MainLayout>

    );

}