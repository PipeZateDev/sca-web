export type OrientacionImpresion = "portrait" | "landscape";

/**
 * Inyecta una regla @page con la orientación elegida antes de llamar a
 * window.print(), y la retira después (o pasado un tiempo prudente, por si
 * el navegador no dispara el evento "afterprint" de forma confiable).
 */
export function imprimirConOrientacion(orientacion: OrientacionImpresion): void {

    const estilo = document.createElement("style");

    estilo.media = "print";
    estilo.textContent = `@page { size: letter ${orientacion}; }`;

    document.head.appendChild(estilo);

    function limpiar() {
        estilo.remove();
        window.removeEventListener("afterprint", limpiar);
    }

    window.addEventListener("afterprint", limpiar);

    setTimeout(limpiar, 5000);

    window.print();

}
