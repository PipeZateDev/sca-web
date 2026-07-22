export async function exportElementToPdf(elementId: string, filename: string): Promise<void> {

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
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

    const imagenPng = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
    });

    const anchoPagina = pdf.internal.pageSize.getWidth();
    const altoPagina = pdf.internal.pageSize.getHeight();

    const anchoImagen = anchoPagina;
    const altoImagen = (canvas.height * anchoImagen) / canvas.width;

    let posicionY = 0;
    let alturaRestante = altoImagen;

    pdf.addImage(imagenPng, "PNG", 0, posicionY, anchoImagen, altoImagen);
    alturaRestante -= altoPagina;

    while (alturaRestante > 0) {

        posicionY = alturaRestante - altoImagen;

        pdf.addPage();
        pdf.addImage(imagenPng, "PNG", 0, posicionY, anchoImagen, altoImagen);

        alturaRestante -= altoPagina;

    }

    pdf.save(filename);

}
