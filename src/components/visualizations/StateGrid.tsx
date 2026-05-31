type StateGridProps = {
	label?: string;
	bytes: number[];
	compact?: boolean;
	tone?: "accent" | "pale" | "dim";
};

const toHex = (value: number): string =>
	value.toString(16).padStart(2, "0").toUpperCase();

const orderState = (bytes: number[]): number[] => {
	if (bytes.length !== 16) {
		return bytes.slice();
	}
	const ordered: number[] = [];
	for (let row = 0; row < 4; row += 1) {
		for (let col = 0; col < 4; col += 1) {
			ordered.push(bytes[row + 4 * col]);
		}
	}
	return ordered;
};

export const StateGrid = ({
	label,
	bytes,
	compact = false,
	tone = "pale",
}: StateGridProps) => {
	const display = orderState(bytes);
	const textTone =
		tone === "accent"
			? "text-bp-accent"
			: tone === "dim"
				? "text-bp-dim"
				: "text-bp-pale";

	return (
		<div className="border border-bp-border bg-bp-panel p-3">
			{label ? (
				<p className="mb-2 text-[10px] tracking-[0.15em] text-bp-dim">
					{label}
				</p>
			) : null}
			<div
				className={`grid grid-cols-4 ${
					compact ? "gap-1 text-[10px]" : "gap-2 text-xs"
				} font-mono`}
			>
				{display.map((value, index) => (
					<div
						key={`${label ?? "state"}-${index}`}
						className={`border border-bp-border bg-bp-bg px-2 py-1 text-center ${textTone}`}
					>
						{toHex(value)}
					</div>
				))}
			</div>
		</div>
	);
};
