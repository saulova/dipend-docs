// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import mdx from "@astrojs/mdx";
import { mermaid } from "./src/plugins/mermaid";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [mermaid],
  },
  integrations: [
    react(),
    starlight({
      title: "My Docs",
      favicon: "/favicon.svg",
      logo: {
        light: "./src/assets/logo-light.png",
        dark: "./src/assets/logo-dark.png",
        replacesTitle: true,
      },
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/withastro/starlight" }],
      customCss: [
        "./src/styles/color-theme.css",
        "./src/styles/mermaid.css",
        "./src/styles/sponsor-banner.css",
        "./src/styles/sponsors-list.css",
      ],
      sidebar: [
        {
          label: "Overview",
          items: [{ label: "Dipend Overview", slug: "" }],
        },
        {
          label: "TypeScript",
          autogenerate: { directory: "typescript" },
        },
        {
          label: "Core Concepts",
          autogenerate: { directory: "core-concepts" },
        },
        {
          label: "Community",
          autogenerate: { directory: "community" },
        },
      ],
      components: {
        MarkdownContent: "./src/components/markdown-content-overriding.astro",
        Search: "./src/components/search-overriding.astro",
        MobileTableOfContents: "./src/components/mobile-table-of-contents-overriding.astro",
      },
    }),
  ],
});
