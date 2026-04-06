import { useMemo, useState } from "react";
import { CipherLayout } from "./components/CipherLayout";
import { Sidebar } from "./components/Sidebar";
import { AdditiveCipher } from "./components/ciphers/AdditiveCipher";
import { AffineCipher } from "./components/ciphers/AffineCipher";
import { AutokeyCipher } from "./components/ciphers/AutokeyCipher";
import { HillCipher } from "./components/ciphers/HillCipher";
import { MultiplicativeCipher } from "./components/ciphers/MultiplicativeCipher";
import { VigenereCipher } from "./components/ciphers/VigenereCipher";

const pages = [
	"Additive Cipher",
	"Multiplicative Cipher",
	"Affine Cipher",
	"Autokey Cipher",
	"Vigenere Cipher",
	"Hill Cipher",
] as const;

function App() {
	const [active, setActive] =
		useState<(typeof pages)[number]>("Additive Cipher");

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
			case "Hill Cipher":
				return {
					title: "Hill Cipher",
					description:
						"Transform plaintext vectors using a 2x2 matrix under modulo 26 arithmetic.",
					node: <HillCipher />,
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
				<Sidebar items={pages} active={active} onSelect={setActive} />
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
