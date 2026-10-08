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
        accentInk: COLORS.accentInk,
        grey: COLORS.grey,
        lightGrey: COLORS.lightGrey,
        darkGrey: COLORS.darkGrey,
        border: COLORS.border,
        sidebar: COLORS.sidebar,
        shimmerLight: COLORS.shimmerLight,
        overdue: COLORS.overdue,
        danger: COLORS.danger,
        dangerHover: COLORS.dangerHover,
        dotGreen: COLORS.dotGreen,
        dotBlue: COLORS.dotBlue,
        dotGold: COLORS.dotGold,
        dotRed: COLORS.dotRed,
        dotTeal: COLORS.dotTeal,
      },
      boxShadow: {
        card: `0 1px 2px color-mix(in srgb, ${COLORS.darkGrey} 6%, transparent), 0 8px 20px color-mix(in srgb, ${COLORS.darkGrey} 5%, transparent)`,
        cardHover: `0 2px 6px color-mix(in srgb, ${COLORS.darkGrey} 8%, transparent), 0 12px 28px color-mix(in srgb, ${COLORS.darkGrey} 8%, transparent)`,
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 180ms ease-out",
      },
      fontFamily: {
        appFont: ["var(--app-font)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
