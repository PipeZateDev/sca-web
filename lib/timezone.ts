export const ZONA_HORARIA_COLEGIO = "America/Bogota";

// Bogotá no tiene horario de verano: siempre es UTC-5. Todas las fechas de
// calendario de la app se anclan a este instante fijo (medianoche Bogotá,
// expresada en UTC) para que representen siempre el mismo instante real sin
// importar en qué zona horaria corra el proceso (servidor local vs Vercel,
// que siempre corre en UTC). Antes, varias funciones usaban `new Date(y,m,d)`
// (zona horaria "ambiente" del proceso), lo que hacía que la misma fecha de
// calendario se guardara con una hora UTC distinta según el entorno,
// generando registros duplicados/invisibles entre local y producción.
const OFFSET_BOGOTA_HORAS_UTC = 5;

/**
 * Construye el instante UTC que representa la medianoche de Bogotá para el
 * año/mes(0-indexado)/día dados. Es el "ancla" que debe usarse siempre en vez
 * de `new Date(anio, mes, dia)`.
 */
export function construirFechaBogota(anio: number, mesIndiceCero: number, dia: number): Date {

    return new Date(Date.UTC(anio, mesIndiceCero, dia, OFFSET_BOGOTA_HORAS_UTC, 0, 0));

}

/**
 * Dado cualquier instante ya anclado a una medianoche Bogotá (por ejemplo,
 * resultado de construirFechaBogota o de sumarle días), devuelve el ancla del
 * mismo día. Sirve para normalizar sin volver a depender de la zona horaria
 * del proceso.
 */
export function anclarFechaBogota(momento: Date): Date {

    return construirFechaBogota(momento.getUTCFullYear(), momento.getUTCMonth(), momento.getUTCDate());

}

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

    return construirFechaBogota(y, m - 1, d);

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

    const dia = new Date(Date.UTC(anio, mes, 0)).getUTCDate();

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
