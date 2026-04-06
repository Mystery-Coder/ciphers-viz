import type { Matrix2x2 } from "../../ciphers/hill";

type MatrixTransformProps = {
	matrix: Matrix2x2;
	inverse: Matrix2x2 | null;
	pulsingIndex?: number;
	inversePulsingIndex?: number;
	showResultVector?: boolean;
	resultVector?: [string, string];
};

export const MatrixTransform = ({
	matrix,
	inverse,
	pulsingIndex = -1,
	inversePulsingIndex = -1,
	showResultVector = true,
	resultVector = ["?", "?"],
}: MatrixTransformProps) => {
	const cell = (v: number, index: number, pulseIndex: number) => (
		<span
			className={`matrix-pulse inline-flex min-w-8 justify-center border px-2 py-1 ${
				index === pulseIndex
					? "border-bp-accent bg-[rgba(100,180,255,0.3)]"
					: "border-bp-border"
			}`}
		>
			{v}
		</span>
	);

	return (
		<div className="space-y-3 border border-bp-border bg-bp-panel p-4">
			<p className="text-[10px] tracking-[0.15em] text-bp-dim">
				MATRIX TRANSFORM
			</p>
			<div className="font-mono text-sm text-bp-pale">
				<div className="mb-2">C = K * P (mod 26)</div>
				<div className="flex items-center gap-2">
					{cell(matrix[0][0], 0, pulsingIndex)}
					{cell(matrix[0][1], 1, pulsingIndex)}
				</div>
				<div className="flex items-center gap-2">
					{cell(matrix[1][0], 2, pulsingIndex)}
					{cell(matrix[1][1], 3, pulsingIndex)}
				</div>
				<div
					className={`mt-3 flex items-center gap-2 transition-opacity duration-300 ${
						showResultVector ? "opacity-100" : "opacity-0"
					}`}
				>
					<span className="text-bp-dim">=</span>
					<span className="inline-flex min-w-8 justify-center border border-bp-border px-2 py-1 text-bp-accent">
						{resultVector[0]}
					</span>
					<span className="inline-flex min-w-8 justify-center border border-bp-border px-2 py-1 text-bp-accent">
						{resultVector[1]}
					</span>
				</div>
			</div>
			<div className="border border-bp-border p-3">
				<div className="mb-2 text-[10px] tracking-[0.15em] text-bp-dim">
					INVERSE MATRIX FOR DECRYPT
				</div>
				{inverse ? (
					<div className="font-mono text-sm text-bp-accent">
						<div className="flex items-center gap-2">
							{cell(inverse[0][0], 0, inversePulsingIndex)}
							{cell(inverse[0][1], 1, inversePulsingIndex)}
						</div>
						<div className="flex items-center gap-2">
							{cell(inverse[1][0], 2, inversePulsingIndex)}
							{cell(inverse[1][1], 3, inversePulsingIndex)}
						</div>
					</div>
				) : (
					<div className="bg-[rgba(255,80,80,0.1)] p-2 text-sm text-[#ff6b6b]">
						Not invertible mod 26.
					</div>
				)}
			</div>
		</div>
	);
};
