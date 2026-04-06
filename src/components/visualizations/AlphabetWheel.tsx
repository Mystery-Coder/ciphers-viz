import { useMemo } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type AlphabetWheelProps = {
	shift: number;
};

export const AlphabetWheel = ({ shift }: AlphabetWheelProps) => {
	const radius = 88;
	const center = 112;
	const cleanShift = ((shift % 26) + 26) % 26;

	const mapped = useMemo(
		() => letters.map((_, i) => letters[(i + cleanShift) % 26]),
		[cleanShift],
	);

	return (
		<div className="border border-bp-border bg-bp-panel p-4">
			<p className="mb-3 text-[10px] tracking-[0.15em] text-bp-dim">
				SHIFT DIAGRAM
			</p>
			<svg viewBox="0 0 224 224" className="mx-auto max-w-[320px]">
				<circle
					cx={center}
					cy={center}
					r={radius}
					fill="none"
					stroke="rgba(100,180,255,0.25)"
				/>
				<circle
					cx={center}
					cy={center}
					r={radius - 24}
					fill="none"
					stroke="rgba(100,180,255,0.25)"
				/>
				{letters.map((char, i) => {
					const angle = (i / 26) * Math.PI * 2 - Math.PI / 2;
					const x = center + Math.cos(angle) * radius;
					const y = center + Math.sin(angle) * radius;
					const ix = center + Math.cos(angle) * (radius - 24);
					const iy = center + Math.sin(angle) * (radius - 24);
					return (
						<g key={char}>
							<text
								x={x}
								y={y}
								textAnchor="middle"
								dominantBaseline="middle"
								fill="#64b4ff"
								fontSize="10"
							>
								{char}
							</text>
							<text
								x={ix}
								y={iy}
								textAnchor="middle"
								dominantBaseline="middle"
								fill="#a8d4ff"
								fontSize="10"
							>
								{mapped[i]}
							</text>
						</g>
					);
				})}
			</svg>
		</div>
	);
};
