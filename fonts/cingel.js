import localFont from "next/font/local";

export const cinzel = localFont({
    src: [
        {
            path: "../public/fonts/Cinzel/Cinzel-VariableFont_wght.ttf",
            weight: "300 700",
            style: "normal",
        }
    ],
    variable: "--font-cinzel",
    display: "swap",
});
