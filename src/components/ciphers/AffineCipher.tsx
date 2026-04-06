import { useMemo, useState } from "react";
import { decrypt, encrypt } from "../../ciphers/affine";
import type { CipherMode } from "../../ciphers/types";
import { StepTable } from "../StepTable";
import { DualTransform } from "../visualizations/DualTransform";

export const AffineCipher = () => {
	const [text, setText] = useState("HELLO WORLD");
	const [a, setA] = useState(5);
	const [b, setB] = useState(8);
	const [mode, setMode] = useState<CipherMode>("encrypt");

	const data = useMemo(
		() =>
			mode === "encrypt"
				? encrypt(text, { a, b })
				: decrypt(text, { a, b }),
		[text, a, b, mode],
	);

	return (
		<div className="space-y-4">
			<div className="border border-bp-border bg-bp-panel p-4 font-mono text-sm text-bp-accent">
				E(x) = ({a}x + {b}) mod 26
			</div>

			<div className="grid gap-3 border border-bp-border bg-bp-panel p-4 md:grid-cols-4">
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
						KEY A
					</span>
					<input
						type="number"
						value={a}
						onChange={(e) => setA(Number(e.target.value) || 0)}
						className="w-full border border-bp-border bg-bp-bg px-3 py-2 text-bp-pale outline-none focus:border-bp-accent"
					/>
				</label>
				<label>
					<span className="mb-1 block text-[10px] tracking-[0.15em] text-bp-dim">
						KEY B
					</span>
					<input
						type="number"
						value={b}
						onChange={(e) => setB(Number(e.target.value) || 0)}
						className="w-full border border-bp-border bg-bp-bg px-3 py-2 text-bp-pale outline-none focus:border-bp-accent"
					/>
				</label>
				<div className="flex gap-2 md:col-span-4">
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
			<DualTransform a={a} b={b} />

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
