import { Suspense } from "react";

import MainLayout from "@/components/layout/MainLayout";
import PageTitle from "@/components/ui/PageTitle";

import AsistenciaContent from "@/components/asistencia/AsistenciaContent";

export default function AsistenciaPage() {

    return (

        <MainLayout>

            <PageTitle
                title="Asistencia"
                subtitle="Marcaciones, tardanzas y ausencias del biométrico"
            />

            <Suspense fallback={<div className="rounded-2xl border bg-white p-10 text-center shadow">Cargando...</div>}>

                <AsistenciaContent />

            </Suspense>

        </MainLayout>

    );

}
