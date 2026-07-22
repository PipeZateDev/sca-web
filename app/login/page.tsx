import Image from "next/image";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {

    return (

        <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] p-6">

            <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border bg-white p-8 shadow-lg">

                <Image
                    src="/logo/logo-horizontal.png"
                    alt="Colegio Nuevo San Luis Gonzaga"
                    width={200}
                    height={80}
                    priority
                    className="h-auto w-auto"
                />

                <div className="text-center">

                    <h1 className="text-xl font-bold text-[#0B4F8A]">
                        Sistema de Control de Asistencia
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Inicia sesión para continuar
                    </p>

                </div>

                <LoginForm />

            </div>

        </div>

    );

}
