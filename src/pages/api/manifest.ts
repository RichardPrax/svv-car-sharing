import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Setze die korrekten Headers
    res.setHeader("Content-Type", "application/manifest+json");
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Das Manifest-Objekt
    const manifest = {
        name: "SVV Team Manager",
        short_name: "SVV Manager",
        description: "Team-Management-App für SVV - Spielplan, Trainings und Fahrgemeinschaften",
        start_url: "/?source=pwa",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0070f3",
        orientation: "portrait-primary",
        icons: [
            {
                src: "/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable"
            },
            {
                src: "/icon-256x256.png",
                sizes: "256x256",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "/icon-384x384.png",
                sizes: "384x384",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable"
            }
        ],
        categories: ["sports", "productivity"],
        lang: "de-DE",
        dir: "ltr"
    };

    res.status(200).json(manifest);
}
