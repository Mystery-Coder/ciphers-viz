import type { CipherStep } from "../ciphers/types";

type StepTableProps = {
	steps: CipherStep[];
};

export const StepTable = ({ steps }: StepTableProps) => {
	if (steps.length === 0) {
		return (
			<div className="border border-bp-border bg-bp-panel p-4 text-sm text-bp-dim">
				No alpha characters to transform.
			</div>
		);
	}

	return (
		<div className="overflow-auto border border-bp-border bg-bp-panel">
			<table className="w-full min-w-[680px] border-collapse text-sm">
				<thead className="text-left text-[11px] uppercase tracking-[0.15em] text-bp-dim">
					<tr>
						<th className="border border-bp-border px-2 py-2">
							Index
						</th>
						<th className="border border-bp-border px-2 py-2">
							Input
						</th>
						<th className="border border-bp-border px-2 py-2">
							Key
						</th>
						<th className="border border-bp-border px-2 py-2">
							Calculation
						</th>
						<th className="border border-bp-border px-2 py-2">
							Output
						</th>
					</tr>
				</thead>
				<tbody>
					{steps.map((step) => (
						<tr
							key={`${step.index}-${step.calculation}`}
							className="flash-cell"
						>
							<td className="border border-bp-border px-2 py-2 text-bp-dim">
								{step.index}
							</td>
							<td className="border border-bp-border px-2 py-2 text-bp-pale">
								{step.plainChar}
							</td>
							<td className="border border-bp-border px-2 py-2 text-bp-accent">
								{step.keyInfo}
							</td>
							<td className="border border-bp-border px-2 py-2 text-bp-pale">
								{step.calculation}
							</td>
							<td className="border border-bp-border px-2 py-2 text-bp-pale">
								{step.cipherChar}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
