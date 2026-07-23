export const ZONA_HORARIA_COLEGIO = "America/Bogota";

/**
 * Colombia no tiene horario de verano, así que Bogotá siempre es UTC-5,
 * pero de todos modos se resuelve vía Intl (no con un offset fijo) para
 * no depender de la zona horaria del servidor/navegador donde corra el código.
 */
export function isoFechaBogota(momento: Date = new Date()): string {

    return new Intl.DateTimeFormat("en-CA", {
        timeZone: ZONA_HORARIA_COLEGIO,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(momento);

}

export function fechaBogota(momento: Date = new Date()): Date {

    const [y, m, d] = isoFechaBogota(momento).split("-").map(Number);

    return new Date(y, m - 1, d);

}

export function horaBogota(momento: Date = new Date()): string {

    return new Intl.DateTimeFormat("en-GB", {
        timeZone: ZONA_HORARIA_COLEGIO,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).format(momento);

}

export function horaNumericaBogota(momento: Date = new Date()): number {

    return Number(
        new Intl.DateTimeFormat("en-GB", {
            timeZone: ZONA_HORARIA_COLEGIO,
            hour: "2-digit",
            hour12: false
        }).format(momento)
    );

}

export function fechaHoraBogotaTexto(momento: Date = new Date()): string {

    return new Intl.DateTimeFormat("es-CO", {
        timeZone: ZONA_HORARIA_COLEGIO,
        dateStyle: "long",
        timeStyle: "short"
    }).format(momento);

}

export function mesActualBogota(): string {

    return isoFechaBogota().slice(0, 7);

}

export function primerDiaDelMes(mesISO: string): string {

    return `${mesISO}-01`;

}

export function ultimoDiaDelMes(mesISO: string): string {

    const [anio, mes] = mesISO.split("-").map(Number);

    const dia = new Date(anio, mes, 0).getDate();

    return `${mesISO}-${String(dia).padStart(2, "0")}`;

}

/**
 * Rango de fechas de un mes completo. Si el mes elegido es el mes en curso
 * (en Bogotá), el rango se corta hasta hoy en vez de llegar al fin de mes,
 * para no incluir días que todavía no han pasado.
 */
export function rangoDelMes(mesISO: string): { desde: string; hasta: string } {

    const desde = primerDiaDelMes(mesISO);
    const esMesActual = mesISO === mesActualBogota();
    const hasta = esMesActual ? isoFechaBogota() : ultimoDiaDelMes(mesISO);

    return { desde, hasta };

}
