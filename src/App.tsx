import { useEffect, useMemo, useState } from "react";
import { CipherLayout } from "./components/CipherLayout";
import { Sidebar } from "./components/Sidebar";
import { AdditiveCipher } from "./components/ciphers/AdditiveCipher";
import { AffineCipher } from "./components/ciphers/AffineCipher";
import { AutokeyCipher } from "./components/ciphers/AutokeyCipher";
import { HillCipher } from "./components/ciphers/HillCipher";
import { MultiplicativeCipher } from "./components/ciphers/MultiplicativeCipher";
import { PlayfairCipher } from "./components/ciphers/PlayfairCipher";
import { VigenereCipher } from "./components/ciphers/VigenereCipher";
import { AesCipher } from "./components/ciphers/AesCipher";
import { DesCipher } from "./components/ciphers/DesCipher";

const pages = [
	"Additive Cipher",
	"Multiplicative Cipher",
	"Affine Cipher",
	"Autokey Cipher",
	"Vigenere Cipher",
	"Playfair Cipher",
	"Hill Cipher",
	"AES Cipher",
	"DES Cipher",
] as const;

const themes = [
	{ id: "blueprint", label: "Blueprint" },
	{ id: "forge", label: "Cipher Forge" },
	{ id: "parchment", label: "Archive Parchment" },
	{ id: "hackerman", label: "Hackerman" },
] as const;

type ThemeId = (typeof themes)[number]["id"];

const getStoredTheme = (): ThemeId => {
	if (typeof window === "undefined") {
		return "blueprint";
	}

	const stored = window.localStorage.getItem("cipher-theme");
	const mapped =
		stored === "reef"
			? "hackerman"
			: stored === "verdant" || stored === "dossier"
				? "blueprint"
				: stored;
	const match = themes.find((theme) => theme.id === mapped);
	return match ? match.id : "blueprint";
};

function App() {
	const [active, setActive] =
		useState<(typeof pages)[number]>("Additive Cipher");
	const [theme, setTheme] = useState<ThemeId>(getStoredTheme);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		window.localStorage.setItem("cipher-theme", theme);
	}, [theme]);

	const content = useMemo(() => {
		switch (active) {
			case "Additive Cipher":
				return {
					title: "Additive Cipher / Caesar",
					description:
						"Shift each letter by a fixed key from 0 to 25 with direct modular translation.",
					node: <AdditiveCipher />,
				};
			case "Multiplicative Cipher":
				return {
					title: "Multiplicative Cipher",
					description:
						"Apply a multiplicative key over Z26 where the key must be coprime with 26.",
					node: <MultiplicativeCipher />,
				};
			case "Affine Cipher":
				return {
					title: "Affine Cipher",
					description:
						"Combine multiplication and additive shift in one transform: E(x) = (ax + b) mod 26.",
					node: <AffineCipher />,
				};
			case "Autokey Cipher":
				return {
					title: "Autokey Cipher",
					description:
						"Seed key starts the stream, then plaintext extends the running key tape.",
					node: <AutokeyCipher />,
				};
			case "Vigenere Cipher":
				return {
					title: "Vigenere Cipher",
					description:
						"Repeat a keyword against plaintext and index into tabula recta per character.",
					node: <VigenereCipher />,
				};
			case "Playfair Cipher":
				return {
					title: "Playfair Cipher",
					description:
						"Encrypt digraphs using a 5x5 keyword square with row, column, and rectangle rules.",
					node: <PlayfairCipher />,
				};
			case "Hill Cipher":
				return {
					title: "Hill Cipher",
					description:
						"Transform plaintext vectors using a 2x2 matrix under modulo 26 arithmetic.",
					node: <HillCipher />,
				};
			case "AES Cipher":
				return {
					title: "AES-128 Cipher",
					description:
						"Visualize AES round states and key schedule for a single 16-byte block.",
					node: <AesCipher />,
				};
			case "DES Cipher":
				return {
					title: "DES Cipher",
					description:
						"Explore the 16-round Feistel network and subkey schedule for a 64-bit block.",
					node: <DesCipher />,
				};
			default:
				return {
					title: "",
					description: "",
					node: null,
				};
		}
	}, [active]);

	return (
		<div className="min-h-screen bg-bp-bg text-bp-pale">
			<div className="mx-auto flex min-h-screen max-w-[1400px] flex-col border-x border-x-bp-border md:flex-row">
				<Sidebar
					items={pages}
					active={active}
					onSelect={setActive}
					themes={themes}
					activeTheme={theme}
					onThemeChange={setTheme}
				/>
				<main className="blueprint-grid flex-1">
					<CipherLayout
						title={content.title}
						description={content.description}
					>
						{content.node}
					</CipherLayout>
				</main>
			</div>
		</div>
	);
}

export default App;
