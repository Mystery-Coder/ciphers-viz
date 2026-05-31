/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				bp: {
					bg: "var(--bp-bg)",
					panel: "var(--bp-panel)",
					border: "var(--bp-border)",
					accent: "var(--bp-accent)",
					pale: "var(--bp-pale)",
					dim: "var(--bp-dim)",
					glow: "var(--bp-glow)",
				},
			},
			fontFamily: {
				ui: ["var(--font-ui)"],
				mono: ["var(--font-mono)"],
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
