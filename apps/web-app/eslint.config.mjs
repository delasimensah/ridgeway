import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";
import jestPlugin from "eslint-plugin-jest";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const barrelOnlyPatterns = [
  {
    group: ["@/constants/**"],
    message:
      "Import from @/constants barrel only, not @/constants/... subpaths.",
  },
  {
    group: ["@/hooks/*", "@/hooks/*/**"],
    message: "Import from @/hooks barrel only.",
  },
  {
    group: ["@/services/**"],
    message:
      "Import from @/services barrel only — not deep @/services/... paths.",
  },
  {
    group: ["@/utils/*", "@/utils/*/**"],
    message: "Import from @/utils barrel only.",
  },
  {
    group: ["@/assets/*", "@/assets/*/**"],
    message: "Import from @/assets barrel only (or @/constants for ASSETS).",
  },
  {
    group: ["shared/*", "shared/**/*"],
    message: 'Import from "shared" only, not shared/... subpaths.',
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      import: importPlugin,
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      "prefer-const": "error",
      "no-console": ["error", { allow: ["error"] }],
      "simple-import-sort/imports": "error",
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"],
            ["internal", "parent", "sibling", "index"],
          ],
        },
      ],
      "max-lines": [
        "warn",
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  {
    files: ["components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components", "@/components/**"],
              message:
                "Inside components/, import other components via relative paths, not @/components.",
            },
            ...barrelOnlyPatterns,
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["components/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [...barrelOnlyPatterns],
        },
      ],
    },
  },
  {
    files: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*layout.tsx",
      "services/**/*.ts",
      "hooks/**/*.ts",
    ],
    rules: {
      "max-lines": "off",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "import/order": "off",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    ...jestPlugin.configs["flat/recommended"],
  },
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
