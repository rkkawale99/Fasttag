import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({

  base: "/Fasttag/",

  plugins: [

    react(),

    VitePWA({

      registerType: "autoUpdate",

      manifest: {

        name: "Fasttag Application",

        short_name: "Fasttag",

        description: "My Fasttag Application",

        theme_color: "#8B5CF6",

        background_color: "#ffffff",

        display: "standalone",

        start_url: "/Fasttag/",

        scope: "/Fasttag/",

      }

    })

  ]

});