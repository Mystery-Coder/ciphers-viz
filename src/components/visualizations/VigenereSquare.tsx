import { Fragment } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type VigenereSquareProps = {
	activeRow: number;
	activeCol: number;
};

export const VigenereSquare = ({
	activeRow,
	activeCol,
}: VigenereSquareProps) => {
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
								row === activeRow
									? "bg-bp-glow text-bp-accent"
									: "text-bp-dim"
							}`}
						>
							{rowChar}
						</div>
						{letters.map((_, col) => {
							const out = letters[(row + col) % 26];
							const active =
								row === activeRow || col === activeCol;
							return (
								<div
									key={`${rowChar}-${col}`}
									className={`border border-bp-border p-1 text-center text-[10px] ${
										active
											? "flash-cell bg-bp-glow text-bp-pale"
											: "text-bp-dim"
									}`}
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
