export const DEPENDENCIA_ESTUDIANTE = "ESTUDIANTE";

export type Poblacion = "EMPLEADOS" | "ESTUDIANTES";

export function esEstudiante(dependencia: string | undefined): boolean {

    const normalizada = (dependencia ?? "").trim().toUpperCase();

    return normalizada === "ESTUDIANTE" || normalizada === "ESTUDIANTES";

}
