import { useMemo, useState } from "react";
import {
	decrypt,
	encrypt,
	multiplicationTableMod26,
} from "../../ciphers/multiplicative";
import type { CipherMode } from "../../ciphers/types";
import { StepTable } from "../StepTable";
import { MappingGrid } from "../visualizations/MappingGrid";

export const MultiplicativeCipher = () => {
	const [text, setText] = useState("HELLO WORLD");
	const [factor, setFactor] = useState(5);
	const [mode, setMode] = useState<CipherMode>("encrypt");

	const data = useMemo(
		() =>
			mode === "encrypt"
				? encrypt(text, { factor })
				: decrypt(text, { factor }),
		[text, factor, mode],
	);

	const mapping = useMemo(() => multiplicationTableMod26(factor), [factor]);

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
						MULTIPLICATIVE KEY
					</span>
					<input
						type="number"
						value={factor}
						onChange={(e) => setFactor(Number(e.target.value) || 0)}
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
			<MappingGrid mapping={mapping} />

			<div className="border border-bp-border bg-bp-panel p-4">
				<p className="mb-2 text-[10px] tracking-[0.15em] text-bp-dim">
					MULTIPLICATION TABLE MOD 26
				</p>
				<div className="grid grid-cols-2 gap-1 md:grid-cols-4 lg:grid-cols-7">
					{mapping.map((value, i) => (
						<div
							key={`mul-${i}`}
							className="border border-bp-border px-2 py-1 text-xs text-bp-pale"
						>
							{i} * {factor} = {value}
						</div>
					))}
				</div>
			</div>

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
