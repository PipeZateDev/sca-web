"use client";

import MainLayout from "@/components/layout/MainLayout";
import PageTitle from "@/components/ui/PageTitle";

import ImportUploader from "@/components/importacion/ImportUploader";

import { useAttendanceImport } from "@/hooks/useAttendanceImport";

export default function ImportacionPage() {

    const { importFile, loading } = useAttendanceImport();

    return (

        <MainLayout>

            <PageTitle
                title="Importación"
                subtitle="Sube el reporte de asistencias exportado por el biométrico"
            />

            <ImportUploader loading={loading} onImport={importFile} />

        </MainLayout>

    );

}
