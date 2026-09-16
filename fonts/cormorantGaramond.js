import localFont from "next/font/local";

export const cormorantGaramond = localFont({
    src: [
        {
            path: "../public/fonts/Cormorant_Garamond/CormorantGaramond-VariableFont_wght.ttf",
            weight: "300 700",
            style: "normal",
        }
    ],
    variable: "--font-cormorant-garamond",
    display: "swap",
});
