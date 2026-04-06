import { useMemo, useState } from "react";
import {
	decrypt,
	encrypt,
	inverseMatrixMod26,
	type Matrix2x2,
} from "../../ciphers/hill";
import type { CipherMode } from "../../ciphers/types";
import { useAnimatedString } from "../../hooks/useAnimatedString";
import { useMatrixPulse } from "../../hooks/useMatrixPulse";
import { StepTable } from "../StepTable";
import { MatrixTransform } from "../visualizations/MatrixTransform";

export const HillCipher = () => {
	const [text, setText] = useState("HELP");
	const [mode, setMode] = useState<CipherMode>("encrypt");
	const [matrix, setMatrix] = useState<Matrix2x2>([
		[3, 3],
		[2, 5],
	]);
	const [showResultVector, setShowResultVector] = useState(true);

	const data = useMemo(
		() =>
			mode === "encrypt"
				? encrypt(text, { matrix })
				: decrypt(text, { matrix }),
		[text, matrix, mode],
	);

	const inverse = useMemo(() => inverseMatrixMod26(matrix), [matrix]);
	const { displayed, done } = useAnimatedString(data.result, 25);
	const { pulsingIndex, startPulse } = useMatrixPulse(4, () =>
		setShowResultVector(true),
	);
	const { pulsingIndex: inversePulsingIndex, startPulse: startInversePulse } =
		useMatrixPulse(4, () => setShowResultVector(true));
	const resultVector = useMemo<[string, string]>(() => {
		const pair = data.steps[0]?.cipherChar ?? "";
		return [pair[0] ?? "?", pair[1] ?? "?"];
	}, [data.steps]);

	const setCell = (r: 0 | 1, c: 0 | 1, value: number) => {
		setMatrix((prev) => {
			const next: Matrix2x2 = [
				[prev[0][0], prev[0][1]],
				[prev[1][0], prev[1][1]],
			];
			next[r][c] = value;
			return next;
		});
	};

	return (
		<div className="space-y-4">
			<div className="grid gap-3 border border-bp-border bg-bp-panel p-4 md:grid-cols-3">
				<label className="md:col-span-3">
					<span className="mb-1 block text-[10px] tracking-[0.15em] text-bp-dim">
						PLAINTEXT / CIPHERTEXT
					</span>
					<input
						value={text}
						onChange={(e) => setText(e.target.value)}
						className="w-full border border-bp-border bg-bp-bg px-3 py-2 text-bp-pale outline-none focus:border-bp-accent"
					/>
				</label>
				<div className="md:col-span-2">
					<span className="mb-1 block text-[10px] tracking-[0.15em] text-bp-dim">
						2x2 KEY MATRIX
					</span>
					<div className="grid max-w-[220px] grid-cols-2 gap-2">
						<input
							type="number"
							value={matrix[0][0]}
							onChange={(e) =>
								setCell(0, 0, Number(e.target.value) || 0)
							}
							className="border border-bp-border bg-bp-bg px-2 py-2 text-bp-pale outline-none focus:border-bp-accent"
						/>
						<input
							type="number"
							value={matrix[0][1]}
							onChange={(e) =>
								setCell(0, 1, Number(e.target.value) || 0)
							}
							className="border border-bp-border bg-bp-bg px-2 py-2 text-bp-pale outline-none focus:border-bp-accent"
						/>
						<input
							type="number"
							value={matrix[1][0]}
							onChange={(e) =>
								setCell(1, 0, Number(e.target.value) || 0)
							}
							className="border border-bp-border bg-bp-bg px-2 py-2 text-bp-pale outline-none focus:border-bp-accent"
						/>
						<input
							type="number"
							value={matrix[1][1]}
							onChange={(e) =>
								setCell(1, 1, Number(e.target.value) || 0)
							}
							className="border border-bp-border bg-bp-bg px-2 py-2 text-bp-pale outline-none focus:border-bp-accent"
						/>
					</div>
				</div>
				<div className="flex items-start gap-2 md:justify-end">
					<button
						type="button"
						onClick={() => {
							setMode("encrypt");
							setShowResultVector(false);
							startPulse();
						}}
						className={`border px-3 py-2 text-xs tracking-[0.12em] ${mode === "encrypt" ? "border-bp-accent bg-bp-glow text-bp-pale" : "border-bp-border text-bp-dim"}`}
					>
						ENCRYPT
					</button>
					<button
						type="button"
						onClick={() => {
							setMode("decrypt");
							setShowResultVector(false);
							startInversePulse();
						}}
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
			<MatrixTransform
				matrix={matrix}
				inverse={inverse}
				pulsingIndex={pulsingIndex}
				inversePulsingIndex={inversePulsingIndex}
				showResultVector={showResultVector}
				resultVector={resultVector}
			/>

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
