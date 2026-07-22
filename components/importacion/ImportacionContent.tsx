"use client";

import PageTitle from "@/components/ui/PageTitle";

import ImportUploader from "@/components/importacion/ImportUploader";

import { useAttendanceImport } from "@/hooks/useAttendanceImport";

export default function ImportacionContent() {

    const { importFile, loading } = useAttendanceImport();

    return (

        <>

            <PageTitle
                title="Importación"
                subtitle="Sube el reporte de asistencias exportado por el biométrico"
            />

            <ImportUploader loading={loading} onImport={importFile} />

        </>

    );

}
