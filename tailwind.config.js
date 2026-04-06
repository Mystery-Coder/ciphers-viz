/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				bp: {
					bg: "#0d1b2e",
					panel: "#0f2039",
					border: "rgba(100,180,255,0.25)",
					accent: "#64b4ff",
					pale: "#a8d4ff",
					dim: "rgba(100,180,255,0.4)",
					glow: "rgba(100,180,255,0.15)",
				},
			},
			fontFamily: {
				ui: ["Inter", "sans-serif"],
				mono: ['"JetBrains Mono"', "monospace"],
			},
			keyframes: {
				flash: {
					"0%": { backgroundColor: "rgba(100,180,255,0.25)" },
					"100%": { backgroundColor: "transparent" },
				},
				fadeIn: {
					"0%": { opacity: "0", transform: "translateY(6px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				slideIn: {
					"0%": { opacity: "0", transform: "translateX(4px)" },
					"100%": { opacity: "1", transform: "translateX(0)" },
				},
			},
			animation: {
				flash: "flash 450ms ease-out",
				"fade-in": "fadeIn 240ms ease-out",
				"slide-in": "slideIn 220ms ease-out",
			},
		},
	},
	plugins: [],
};
