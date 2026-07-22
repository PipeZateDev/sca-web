import MainLayout from "@/components/layout/MainLayout";
import EmployeesContent from "@/components/empleados/EmployeesContent";

import { getSessionUser } from "@/lib/auth";

export default async function EmployeesPage() {

    const user = await getSessionUser();

    return (

        <MainLayout>

            <EmployeesContent readOnly={user?.rol === "CONSULTA"} />

        </MainLayout>

    );

}
