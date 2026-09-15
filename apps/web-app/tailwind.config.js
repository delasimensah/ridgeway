// Register ts-node to enable TypeScript support in Tailwind config
try {
  require("ts-node").register({
    transpileOnly: true,
    compilerOptions: {
      module: "commonjs",
      esModuleInterop: true,
      moduleResolution: "node",
      target: "es2020",
      skipLibCheck: true,
      baseUrl: ".",
      paths: {
        "@/*": ["./*"],
        shared: ["../../packages/shared/src/index.ts"],
        "shared/*": ["../../packages/shared/src/*"],
      },
    },
    skipProject: true,
  });

  try {
    require("tsconfig-paths").register({
      baseUrl: ".",
      paths: {
        "@/*": ["./*"],
        shared: ["../../packages/shared/src/index.ts"],
        "shared/*": ["../../packages/shared/src/*"],
      },
    });
  } catch (error) {
    // tsconfig-paths not available, continue without it
    console.error("tsconfig-paths not available, continue without it", error);
  }
} catch (error) {
  console.error(
    "ts-node not available, ensure constants are compiled to JS",
    error
  );
}

/** @type {import('tailwindcss').Config} */
const { COLORS } = require("./constants/colors.ts");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: COLORS.white,
        black: COLORS.black,
        primary: COLORS.primary,
        primaryHover: COLORS.primaryHover,
        accent: COLORS.accent,
        grey: COLORS.grey,
        lightGrey: COLORS.lightGrey,
        darkGrey: COLORS.darkGrey,
        border: COLORS.border,
        sidebar: COLORS.sidebar,
        shimmerLight: COLORS.shimmerLight,
        overdue: COLORS.overdue,
        danger: COLORS.danger,
        dangerHover: COLORS.dangerHover,
      },
      boxShadow: {
        card: `0 8px 24px color-mix(in srgb, ${COLORS.darkGrey} 14%, transparent), 0 2px 6px color-mix(in srgb, ${COLORS.darkGrey} 8%, transparent)`,
      },
      fontFamily: {
        appFont: ["var(--app-font)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
