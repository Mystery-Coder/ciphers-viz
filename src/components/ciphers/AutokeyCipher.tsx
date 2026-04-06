import { useMemo, useState } from "react";
import { decrypt, encrypt } from "../../ciphers/autokey";
import type { CipherMode } from "../../ciphers/types";
import { StepTable } from "../StepTable";
import { KeyTape } from "../visualizations/KeyTape";

const alphaOnly = (text: string): string =>
	text.toUpperCase().replace(/[^A-Z]/g, "");

export const AutokeyCipher = () => {
	const [text, setText] = useState("DEFEND THE EAST WALL");
	const [seed, setSeed] = useState("QUEEN");
	const [mode, setMode] = useState<CipherMode>("encrypt");

	const data = useMemo(
		() =>
			mode === "encrypt"
				? encrypt(text, { seed })
				: decrypt(text, { seed }),
		[text, seed, mode],
	);

	const plain = alphaOnly(mode === "encrypt" ? text : data.result);
	const tapeKey = useMemo(() => {
		const cleanSeed = alphaOnly(seed);
		const source = mode === "encrypt" ? plain : alphaOnly(data.result);
		return `${cleanSeed}${source}`.slice(0, plain.length);
	}, [seed, plain, data.result, mode]);

	return (
		<div className="space-y-4">
			<div className="grid gap-3 border border-bp-border bg-bp-panel p-4 md:grid-cols-3">
				<label className="md:col-span-2">
					<span className="mb-1 block text-[10px] tracking-[0.15em] text-bp-dim">
						PLAINTEXT / CIPHERTEXT
					</span>
					<input
						value={text}
						onChange={(e) => setText(e.target.value)}
						className="w-full border border-bp-border bg-bp-bg px-3 py-2 text-bp-pale outline-none focus:border-bp-accent"
					/>
				</label>
				<label>
					<span className="mb-1 block text-[10px] tracking-[0.15em] text-bp-dim">
						SEED KEY
					</span>
					<input
						value={seed}
						onChange={(e) => setSeed(e.target.value)}
						className="w-full border border-bp-border bg-bp-bg px-3 py-2 text-bp-pale outline-none focus:border-bp-accent"
					/>
				</label>
				<div className="flex gap-2 md:col-span-3">
					<button
						type="button"
						onClick={() => setMode("encrypt")}
						className={`border px-3 py-2 text-xs tracking-[0.12em] ${mode === "encrypt" ? "border-bp-accent bg-bp-glow text-bp-pale" : "border-bp-border text-bp-dim"}`}
					>
						ENCRYPT
					</button>
					<button
						type="button"
						onClick={() => setMode("decrypt")}
						className={`border px-3 py-2 text-xs tracking-[0.12em] ${mode === "decrypt" ? "border-bp-accent bg-bp-glow text-bp-pale" : "border-bp-border text-bp-dim"}`}
					>
						DECRYPT
					</button>
				</div>
			</div>

			{data.error ? (
				<div className="border border-[#ff6b6b] bg-[rgba(255,80,80,0.1)] p-3 text-sm text-[#ff6b6b]">
					{data.error}
				</div>
			) : null}
			<KeyTape
				plain={plain}
				runningKey={tapeKey}
				cipher={alphaOnly(data.result)}
			/>

			<div className="border border-bp-border bg-bp-panel p-4">
				<p className="mb-2 text-[10px] tracking-[0.15em] text-bp-dim">
					OUTPUT
				</p>
				<div className="flex flex-wrap items-center gap-2">
					<div className="flex-1 border border-bp-border bg-bp-bg px-3 py-2 font-mono text-bp-pale">
						{data.result}
					</div>
					<button
						type="button"
						onClick={() =>
							navigator.clipboard.writeText(data.result)
						}
						className="border border-bp-border px-3 py-2 text-xs text-bp-accent hover:bg-bp-glow"
					>
						COPY
					</button>
				</div>
			</div>

			<StepTable steps={data.steps} />
		</div>
	);
};
