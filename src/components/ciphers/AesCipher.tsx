import { useMemo, useState } from "react";
import { decrypt, encrypt } from "../../ciphers/aes";
import type { CipherMode } from "../../ciphers/types";
import { useAnimatedString } from "../../hooks/useAnimatedString";
import { StateGrid } from "../visualizations/StateGrid";

const DEFAULT_BLOCK = "00112233445566778899AABBCCDDEEFF";
const DEFAULT_KEY = "000102030405060708090A0B0C0D0E0F";

export const AesCipher = () => {
	const [block, setBlock] = useState(DEFAULT_BLOCK);
	const [key, setKey] = useState(DEFAULT_KEY);
	const [mode, setMode] = useState<CipherMode>("encrypt");

	const data = useMemo(
		() => (mode === "encrypt" ? encrypt(block, key) : decrypt(block, key)),
		[block, key, mode],
	);

	const { displayed, done } = useAnimatedString(data.resultHex, 18);

	return (
		<div className="space-y-4">
			<div className="grid gap-3 border border-bp-border bg-bp-panel p-4 md:grid-cols-3">
				<label className="md:col-span-2">
					<span className="mb-1 block text-[10px] tracking-[0.15em] text-bp-dim">
						BLOCK (32 HEX)
					</span>
					<input
						value={block}
						onChange={(e) => setBlock(e.target.value.toUpperCase())}
						className="w-full border border-bp-border bg-bp-bg px-3 py-2 text-bp-pale outline-none focus:border-bp-accent"
						spellCheck={false}
					/>
				</label>
				<label>
					<span className="mb-1 block text-[10px] tracking-[0.15em] text-bp-dim">
						KEY (32 HEX)
					</span>
					<input
						value={key}
						onChange={(e) => setKey(e.target.value.toUpperCase())}
						className="w-full border border-bp-border bg-bp-bg px-3 py-2 text-bp-pale outline-none focus:border-bp-accent"
						spellCheck={false}
					/>
				</label>
				<div className="flex gap-2 md:col-span-3">
					<button
						type="button"
						onClick={() => setMode("encrypt")}
						className={`border px-3 py-2 text-xs tracking-[0.12em] ${
							mode === "encrypt"
								? "border-bp-accent bg-bp-glow text-bp-pale"
								: "border-bp-border text-bp-dim"
						}`}
					>
						ENCRYPT
					</button>
					<button
						type="button"
						onClick={() => setMode("decrypt")}
						className={`border px-3 py-2 text-xs tracking-[0.12em] ${
							mode === "decrypt"
								? "border-bp-accent bg-bp-glow text-bp-pale"
								: "border-bp-border text-bp-dim"
						}`}
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
							navigator.clipboard.writeText(data.resultHex)
						}
						className="border border-bp-border px-3 py-2 text-xs text-bp-accent hover:bg-bp-glow"
					>
						COPY
					</button>
				</div>
			</div>

			{!data.error ? (
				<div className="space-y-3">
					<p className="text-[10px] tracking-[0.15em] text-bp-dim">
						ROUND STATES
					</p>
					<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
						{data.rounds.map((round) => (
							<StateGrid
								key={`round-${round.step}-${round.keyIndex}`}
								label={`${round.label} / K${round.keyIndex}`}
								bytes={round.state}
								compact
							/>
						))}
					</div>
				</div>
			) : null}

			{!data.error ? (
				<div className="space-y-3">
					<p className="text-[10px] tracking-[0.15em] text-bp-dim">
						KEY SCHEDULE
					</p>
					<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{data.roundKeys.map((roundKey, index) => (
							<StateGrid
								key={`key-${index}`}
								label={`K${index}`}
								bytes={roundKey}
								compact
								tone="accent"
							/>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
};
