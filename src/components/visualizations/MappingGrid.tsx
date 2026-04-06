const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type MappingGridProps = {
	mapping: number[];
};

export const MappingGrid = ({ mapping }: MappingGridProps) => {
	return (
		<div className="border border-bp-border bg-bp-panel p-4">
			<p className="mb-3 text-[10px] tracking-[0.15em] text-bp-dim">
				MAPPING GRID
			</p>
			<div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
				{letters.map((char, i) => (
					<div
						key={char}
						className="flash-cell border border-bp-border px-2 py-1 text-xs"
					>
						<div className="text-bp-dim">{char}</div>
						<div className="text-bp-accent">
							{letters[mapping[i] ?? 0]}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
