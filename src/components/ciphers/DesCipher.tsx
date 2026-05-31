import { useMemo, useState } from "react";
import { decrypt, encrypt } from "../../ciphers/des";
import type { CipherMode } from "../../ciphers/types";
import { useAnimatedString } from "../../hooks/useAnimatedString";

const DEFAULT_BLOCK = "0123456789ABCDEF";
const DEFAULT_KEY = "133457799BBCDFF1";

export const DesCipher = () => {
	const [block, setBlock] = useState(DEFAULT_BLOCK);
	const [key, setKey] = useState(DEFAULT_KEY);
	const [mode, setMode] = useState<CipherMode>("encrypt");

	const data = useMemo(
		() => (mode === "encrypt" ? encrypt(block, key) : decrypt(block, key)),
		[block, key, mode],
	);

	const { displayed, done } = useAnimatedString(data.resultHex, 16);

	return (
		<div className="space-y-4">
			<div className="grid gap-3 border border-bp-border bg-bp-panel p-4 md:grid-cols-3">
				<label className="md:col-span-2">
					<span className="mb-1 block text-[10px] tracking-[0.15em] text-bp-dim">
						BLOCK (16 HEX)
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
						KEY (16 HEX)
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
					<div className="overflow-auto border border-bp-border bg-bp-panel">
						<table className="w-full min-w-[720px] border-collapse font-mono text-xs">
							<thead className="text-left text-[10px] uppercase tracking-[0.15em] text-bp-dim">
								<tr>
									<th className="border border-bp-border px-2 py-2">
										Round
									</th>
									<th className="border border-bp-border px-2 py-2">
										L
									</th>
									<th className="border border-bp-border px-2 py-2">
										R
									</th>
									<th className="border border-bp-border px-2 py-2">
										F(R, K)
									</th>
									<th className="border border-bp-border px-2 py-2">
										Subkey
									</th>
								</tr>
							</thead>
							<tbody>
								{data.rounds.map((round) => (
									<tr
										key={`round-${round.round}`}
										className="stagger-row"
									>
										<td className="border border-bp-border px-2 py-2 text-bp-dim">
											{round.round}
										</td>
										<td className="border border-bp-border px-2 py-2 text-bp-pale">
											{round.l}
										</td>
										<td className="border border-bp-border px-2 py-2 text-bp-pale">
											{round.r}
										</td>
										<td className="border border-bp-border px-2 py-2 text-bp-accent">
											{round.f}
										</td>
										<td className="border border-bp-border px-2 py-2 text-bp-accent">
											{round.subkey}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			) : null}

			{!data.error ? (
				<div className="space-y-3">
					<p className="text-[10px] tracking-[0.15em] text-bp-dim">
						SUBKEYS (48-BIT)
					</p>
					<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
						{data.subkeys.map((subkey, index) => (
							<div
								key={`subkey-${index + 1}`}
								className="border border-bp-border bg-bp-panel px-3 py-2 font-mono text-xs text-bp-accent"
							>
								K{index + 1}: {subkey}
							</div>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
};
