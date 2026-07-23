"use client";

import { useEffect, useState } from "react";

const CONSULTA_MOVIL = "(max-width: 767px)";

export function useIsMobile(): boolean {

    const [esMovil, setEsMovil] = useState(false);

    useEffect(() => {

        const media = window.matchMedia(CONSULTA_MOVIL);

        setEsMovil(media.matches);

        function handleChange(e: MediaQueryListEvent) {
            setEsMovil(e.matches);
        }

        media.addEventListener("change", handleChange);

        return () => media.removeEventListener("change", handleChange);

    }, []);

    return esMovil;

}
