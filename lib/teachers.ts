export const DEPENDENCIA_DOCENTES = "DOCENTES";
export const HORARIO_DOCENTES = "PROFESORES";

const VARIANTES_DOCENTE = ["PROFES", "DOCENTE (TUTOR)", DEPENDENCIA_DOCENTES];

/**
 * El biométrico exporta a veces "PROFES" y otras "DOCENTE (TUTOR)" para el
 * mismo grupo de profesores; ambas variantes (y ya el valor normalizado
 * "DOCENTES") se reconocen como el mismo grupo.
 */
export function esVarianteDeDocente(dependencia: string | undefined): boolean {

    const normalizada = (dependencia ?? "").trim().toUpperCase();

    return VARIANTES_DOCENTE.includes(normalizada);

}
