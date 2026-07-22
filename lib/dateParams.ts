export function parseFechaISO(valor: string): Date {

    const [anio, mes, dia] = valor.split("-").map(Number);

    return new Date(anio, mes - 1, dia);

}
