type DualTransformProps = {
	a: number;
	b: number;
};

export const DualTransform = ({ a, b }: DualTransformProps) => {
	return (
		<div className="border border-bp-border bg-bp-panel p-4">
			<p className="mb-3 text-[10px] tracking-[0.15em] text-bp-dim">
				DUAL TRANSFORM
			</p>
			<div className="grid gap-2 md:grid-cols-3">
				<div className="border border-bp-border p-3 text-sm text-bp-pale">
					x (plain index)
				</div>
				<div className="border border-bp-border p-3 text-sm text-bp-accent">
					multiply: {a}x
				</div>
				<div className="border border-bp-border p-3 text-sm text-bp-pale">
					add: +{b} then mod 26
				</div>
			</div>
			<div className="mt-3 border border-bp-border p-3 font-mono text-sm text-bp-accent">
				E(x) = ({a}x + {b}) mod 26
			</div>
		</div>
	);
};
