import { useMemo } from "react";
import type { CipherStep } from "../ciphers/types";
import { useStaggerChildren } from "../hooks/useStaggerChildren";

type StepTableProps = {
	steps: CipherStep[];
	resultString?: string;
};

const hashString = (value: string): string => {
	let hash = 0;
	for (let i = 0; i < value.length; i += 1) {
		hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
	}
	return hash.toString(16);
};

export const StepTable = ({ steps, resultString = "" }: StepTableProps) => {
	const delays = useStaggerChildren(steps.length, 28);
	const tableKey = useMemo(() => hashString(resultString), [resultString]);

	if (steps.length === 0) {
		return (
			<div className="border border-bp-border bg-bp-panel p-4 text-sm text-bp-dim">
				No alpha characters to transform.
			</div>
		);
	}

	return (
		<div className="overflow-auto border border-bp-border bg-bp-panel">
			<table
				key={tableKey}
				className="w-full min-w-[680px] border-collapse text-sm"
			>
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
					{steps.map((step, index) => (
						<tr
							key={`${step.index}-${step.calculation}`}
							className="stagger-row"
							style={{ animationDelay: `${delays[index]}ms` }}
						>
							<td className="cell-flash border border-bp-border px-2 py-2 text-bp-dim">
								{step.index}
							</td>
							<td className="cell-flash border border-bp-border px-2 py-2 text-bp-pale">
								{step.plainChar}
							</td>
							<td className="cell-flash border border-bp-border px-2 py-2 text-bp-accent">
								{step.keyInfo}
							</td>
							<td className="cell-flash border border-bp-border px-2 py-2 text-bp-pale">
								{step.calculation}
							</td>
							<td className="cell-flash border border-bp-border px-2 py-2 text-bp-pale">
								{step.cipherChar}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
