import { useMemo, useState } from "react";
import { decrypt, encrypt, buildPlayfairGrid } from "../../ciphers/playfair";
import type { CipherMode } from "../../ciphers/types";
import { useAnimatedString } from "../../hooks/useAnimatedString";
import { StepTable } from "../StepTable";
import { PlayfairGrid } from "../visualizations/PlayfairGrid";

export const PlayfairCipher = () => {
	const [text, setText] = useState("HELLO WORLD");
	const [keyword, setKeyword] = useState("KEYWORD");
	const [mode, setMode] = useState<CipherMode>("encrypt");

	const data = useMemo(
		() =>
			mode === "encrypt"
				? encrypt(text, { keyword })
				: decrypt(text, { keyword }),
		[text, keyword, mode],
	);

	const lastStep = data.steps.length > 0 ? data.steps[data.steps.length - 1] : null;
	const highlightLetters = lastStep ? lastStep.plainChar : "";

	const grid = useMemo(() => buildPlayfairGrid(keyword), [keyword]);

	const { displayed, done } = useAnimatedString(data.result, 50);

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
						KEYWORD
					</span>
					<input
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
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

			<div className="grid gap-4 md:grid-cols-2">
				<PlayfairGrid grid={grid} highlightLetters={highlightLetters} />
				<div className="border border-bp-border bg-bp-panel p-4">
					<p className="mb-3 text-[10px] tracking-[0.15em] text-bp-dim">
						DIGRAPHS
					</p>
					<div className="flex flex-wrap gap-2">
						{data.steps.map((step) => (
							<div
								key={step.index}
								className="flex flex-col items-center border border-bp-border bg-bp-bg px-3 py-2"
							>
								<span className="text-xs text-bp-dim">
									{step.plainChar}
								</span>
								<span className="text-[10px] text-bp-accent">
									{step.calculation}
								</span>
								<span className="text-xs text-bp-pale">
									{step.cipherChar}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="border border-bp-border bg-bp-panel p-4">
				<p className="mb-2 text-[10px] tracking-[0.15em] text-bp-dim">
					OUTPUT
				</p>
				<div className="flex flex-wrap items-center gap-2">
					<div className="flex-1 border border-bp-border bg-bp-bg px-3 py-2 font-mono text-bp-pale">
						{displayed}
						{!done ? <span className="blink-cursor">|</span> : null}
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

			<StepTable steps={data.steps} resultString={data.result} />
		</div>
	);
};
