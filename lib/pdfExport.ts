// Margen mínimo para aprovechar el ancho de la hoja carta.
const MARGEN_PT = 14;

// Ancho/alto de una hoja carta en puntos, según orientación.
const CARTA_VERTICAL = { ancho: 612, alto: 792 };
const CARTA_HORIZONTAL = { ancho: 792, alto: 612 };

// Si el contenido capturado es notablemente más ancho que alto (tablas con muchas
// columnas, gráficas de barras con muchos empleados), se exporta en horizontal para
// que no se reduzca demasiado; de lo contrario, en vertical.
const UMBRAL_APAISADO = 1.3;

export async function exportElementToPdf(elementId: string, filename: string): Promise<void> {

    // Se usa el fork "html2canvas-pro" en vez de "html2canvas": Tailwind v4 genera
    // colores con la función oklch() en absolutamente todos los elementos (por el
    // border-border global), y la librería original no sabe interpretar oklch(),
    // lo que rompía la exportación a PDF.
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf")
    ]);

    const elemento = document.getElementById(elementId);

    if (!elemento) {
        throw new Error(`No se encontró el elemento '${elementId}' para exportar.`);
    }

    const canvas = await html2canvas(elemento, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true
    });

    const esApaisado = canvas.width / canvas.height > UMBRAL_APAISADO;
    const carta = esApaisado ? CARTA_HORIZONTAL : CARTA_VERTICAL;

    // Siempre se ajusta al ancho fijo de la hoja carta (mínimo margen a los lados).
    const anchoDisponible = carta.ancho - MARGEN_PT * 2;
    const escala = anchoDisponible / canvas.width;
    const anchoImagen = anchoDisponible;
    const altoImagenTotal = canvas.height * escala;

    const altoDisponibleUnaPagina = carta.alto - MARGEN_PT * 2;

    const imagenPng = canvas.toDataURL("image/png");

    if (altoImagenTotal <= altoDisponibleUnaPagina) {

        // Cabe en una sola página: en vez de una hoja carta completa (11in de alto)
        // dejando espacio en blanco de sobra, la página se recorta a la altura real
        // del contenido (más el margen), y el contenido queda pegado arriba, no
        // centrado.
        const altoPaginaAjustado = altoImagenTotal + MARGEN_PT * 2;

        const pdf = new jsPDF({
            unit: "pt",
            format: [carta.ancho, altoPaginaAjustado]
        });

        pdf.addImage(imagenPng, "PNG", MARGEN_PT, MARGEN_PT, anchoImagen, altoImagenTotal);

        pdf.save(filename);

        return;

    }

    // El contenido es más alto que una hoja carta completa: se usa el tamaño de
    // página estándar y se reparte en varias páginas.
    const pdf = new jsPDF({
        orientation: esApaisado ? "landscape" : "portrait",
        unit: "pt",
        format: "letter"
    });

    let alturaMostrada = 0;
    let primeraPagina = true;

    while (alturaMostrada < altoImagenTotal) {

        if (!primeraPagina) {
            pdf.addPage();
        }

        primeraPagina = false;

        const posicionY = MARGEN_PT - alturaMostrada;

        pdf.addImage(imagenPng, "PNG", MARGEN_PT, posicionY, anchoImagen, altoImagenTotal);

        alturaMostrada += altoDisponibleUnaPagina;

    }

    pdf.save(filename);

}
