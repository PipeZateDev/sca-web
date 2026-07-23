import { construirFechaBogota } from "@/lib/timezone";

export function parseFechaISO(valor: string): Date {

    const [anio, mes, dia] = valor.split("-").map(Number);

    return construirFechaBogota(anio, mes - 1, dia);

}
