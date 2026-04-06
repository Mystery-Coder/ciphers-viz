import { Fragment, useEffect, useRef, useState } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type VigenereSquareProps = {
	activeRow: number;
	activeCol: number;
};

export const VigenereSquare = ({
	activeRow,
	activeCol,
}: VigenereSquareProps) => {
	const [trackedRow, setTrackedRow] = useState(0);
	const [trackedCol, setTrackedCol] = useState(0);
	const [pulseTick, setPulseTick] = useState(0);
	const mountedRef = useRef(false);

	useEffect(() => {
		if (!mountedRef.current) {
			const timer = window.setTimeout(() => {
				setTrackedRow(activeRow);
				setTrackedCol(activeCol);
				mountedRef.current = true;
			}, 600);
			return () => window.clearTimeout(timer);
		}

		setTrackedRow(activeRow);
		setTrackedCol(activeCol);
	}, [activeRow, activeCol]);

	useEffect(() => {
		setPulseTick((prev) => prev + 1);
	}, [trackedRow, trackedCol]);

	return (
		<div className="overflow-auto border border-bp-border bg-bp-panel p-3">
			<p className="mb-2 text-[10px] tracking-[0.15em] text-bp-dim">
				TABULA RECTA
			</p>
			<div className="grid w-max grid-cols-[repeat(27,minmax(24px,1fr))]">
				<div className="border border-bp-border p-1 text-[10px] text-bp-dim">
					#
				</div>
				{letters.map((char) => (
					<div
						key={`h-${char}`}
						className="border border-bp-border p-1 text-center text-[10px] text-bp-dim"
					>
						{char}
					</div>
				))}
				{letters.map((rowChar, row) => (
					<Fragment key={`row-${rowChar}`}>
						<div
							key={`r-${rowChar}`}
							className={`border border-bp-border p-1 text-center text-[10px] ${
								row === trackedRow
									? "bg-bp-glow text-bp-accent"
									: "text-bp-dim"
							}`}
						>
							{rowChar}
						</div>
						{letters.map((_, col) => {
							const out = letters[(row + col) % 26];
							const rowActive = row === trackedRow;
							const colActive = col === trackedCol;
							const active = rowActive || colActive;
							const intersection = rowActive && colActive;
							return (
								<div
									key={
										intersection
											? `${rowChar}-${col}-${pulseTick}`
											: `${rowChar}-${col}`
									}
									className={`border border-bp-border p-1 text-center text-[10px] ${
										active
											? "crosshair-cell bg-[rgba(100,180,255,0.12)] text-bp-pale"
											: "text-bp-dim"
									} ${intersection ? "intersect-pulse" : ""}`}
								>
									{out}
								</div>
							);
						})}
					</Fragment>
				))}
			</div>
		</div>
	);
};
