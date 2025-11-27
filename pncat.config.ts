import { defineConfig, mergeCatalogRules } from "pncat";

export default defineConfig({
  catalogRules: mergeCatalogRules([
    {
      name: "xiaohe",
      match: [
        /^@xiaohe01/
      ],
      priority: 1
    },
    {
      name: "types",
      match: [
        /\btypes\b/,
        /\btypings\b/
      ],
      priority: 10
    },
    {
      name: "cli",
      match: [
        "@antfu/ni"
      ],
      priority: 20
    }
  ])
});