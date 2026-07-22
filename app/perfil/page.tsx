import MainLayout from "@/components/layout/MainLayout";
import PageTitle from "@/components/ui/PageTitle";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

import ChangePasswordForm from "@/components/auth/ChangePasswordForm";

import { getSessionUser } from "@/lib/auth";

const ROL_LABEL: Record<string, string> = {
    ADMINISTRADOR: "Administrador",
    COORDINADOR: "Coordinador",
    CONSULTA: "Consulta"
};

export default async function PerfilPage() {

    const user = await getSessionUser();

    return (

        <MainLayout>

            <PageTitle
                title="Mi Perfil"
                subtitle="Información de tu cuenta y seguridad"
            />

            <Card className="max-w-md">

                <p className="text-sm text-gray-500">Usuario</p>
                <p className="mb-3 font-medium">{user?.usuario}</p>

                <p className="text-sm text-gray-500">Nombre</p>
                <p className="mb-3 font-medium">{user?.nombre}</p>

                <p className="text-sm text-gray-500">Rol</p>
                <p className="font-medium">
                    {user ? (ROL_LABEL[user.rol] ?? user.rol) : ""}
                </p>

            </Card>

            <Section title="Cambiar contraseña">

                <div className="max-w-md">

                    <ChangePasswordForm />

                </div>

            </Section>

        </MainLayout>

    );

}
