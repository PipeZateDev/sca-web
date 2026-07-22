import Link from "next/link";

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

import { getTodayCounts } from "@/services/attendanceStatus.service";
import { getSessionUser } from "@/lib/auth";

function isoToday(): string {
    return new Date().toISOString().slice(0, 10);
}

export default async function DashboardPage() {

    const user = await getSessionUser();
    const puedeVerOperativo = user?.rol !== "CONSULTA";

    const { empleados, asistenciasHoy, tardanzas, ausentes } = await getTodayCounts();

    const hora = new Date().getHours();

    let saludo = "Buenas noches";

    if (hora < 12)
        saludo = "Buenos días";

    else if (hora < 18)
        saludo = "Buenas tardes";

    const asistenciaHoyHref = `/asistencia?vista=dia&fecha=${isoToday()}`;

    return (

        <MainLayout>

            <PageTitle

                title={`${saludo} 👋`}

                subtitle="Bienvenido al Sistema de Control de Asistencia"

            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <Link href="/empleados" className="block">

                    <StatCard
                        title="Empleados"
                        value={empleados}
                        icon={Users}
                        color="#0B4F8A"
                    />

                </Link>

                {puedeVerOperativo ? (

                    <Link href={asistenciaHoyHref} className="block">

                        <StatCard
                            title="Asistencias Hoy"
                            value={asistenciasHoy}
                            icon={ClipboardCheck}
                            color="#0A8A2A"
                        />

                    </Link>

                ) : (

                    <StatCard
                        title="Asistencias Hoy"
                        value={asistenciasHoy}
                        icon={ClipboardCheck}
                        color="#0A8A2A"
                    />

                )}

                {puedeVerOperativo ? (

                    <Link href={asistenciaHoyHref} className="block">

                        <StatCard
                            title="Tardanzas"
                            value={tardanzas}
                            icon={Clock3}
                            color="#F59E0B"
                        />

                    </Link>

                ) : (

                    <StatCard
                        title="Tardanzas"
                        value={tardanzas}
                        icon={Clock3}
                        color="#F59E0B"
                    />

                )}

                {puedeVerOperativo ? (

                    <Link href={asistenciaHoyHref} className="block">

                        <StatCard
                            title="Ausencias"
                            value={ausentes}
                            icon={UserX}
                            color="#DC2626"
                        />

                    </Link>

                ) : (

                    <StatCard
                        title="Ausencias"
                        value={ausentes}
                        icon={UserX}
                        color="#DC2626"
                    />

                )}

            </div>

            <Section title="Accesos rápidos">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                    {puedeVerOperativo && (

                        <Link
                            href="/importacion"
                            className="rounded-xl border bg-white p-6 hover:shadow-lg transition text-center block"
                        >

                            <Upload className="mx-auto mb-3 text-blue-700" />

                            Importar

                        </Link>

                    )}

                    <Link
                        href="/empleados"
                        className="rounded-xl border bg-white p-6 hover:shadow-lg transition text-center block"
                    >

                        <UserPlus className="mx-auto mb-3 text-green-700" />

                        Empleados

                    </Link>

                    {puedeVerOperativo && (

                        <Link
                            href="/horarios"
                            className="rounded-xl border bg-white p-6 hover:shadow-lg transition text-center block"
                        >

                            <CalendarClock className="mx-auto mb-3 text-orange-600" />

                            Horarios

                        </Link>

                    )}

                    <Link
                        href="/reportes"
                        className="rounded-xl border bg-white p-6 hover:shadow-lg transition text-center block"
                    >

                        <FileBarChart2 className="mx-auto mb-3 text-purple-700" />

                        Reportes

                    </Link>

                </div>

            </Section>

        </MainLayout>

    );

}
