import { useEffect, useRef, useState } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type AlphabetWheelProps = {
	shift: number;
};

export const AlphabetWheel = ({ shift }: AlphabetWheelProps) => {
	const radius = 88;
	const center = 112;
	const innerRadius = radius - 24;
	const cleanShift = ((shift % 26) + 26) % 26;
	const degreesPerStep = 360 / 26;
	const previousShiftRef = useRef(cleanShift);
	const [rotationDeg, setRotationDeg] = useState(cleanShift * degreesPerStep);

	useEffect(() => {
		const previous = previousShiftRef.current;
		let delta = cleanShift - previous;
		if (delta > 13) {
			delta -= 26;
		}
		if (delta < -13) {
			delta += 26;
		}
		setRotationDeg((prev) => prev + delta * degreesPerStep);
		previousShiftRef.current = cleanShift;
	}, [cleanShift, degreesPerStep]);

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
					r={innerRadius}
					fill="none"
					stroke="rgba(100,180,255,0.25)"
				/>
				{letters.map((char, i) => {
					const angle = (i / 26) * Math.PI * 2 - Math.PI / 2;
					const x = center + Math.cos(angle) * radius;
					const y = center + Math.sin(angle) * radius;
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
						</g>
					);
				})}
				<g
					style={{
						transformOrigin: `${center}px ${center}px`,
						transform: `rotate(${rotationDeg}deg)`,
						transition: "transform 500ms ease-in-out",
					}}
				>
					{letters.map((char, i) => {
						const angle = (i / 26) * Math.PI * 2 - Math.PI / 2;
						const ix = center + Math.cos(angle) * innerRadius;
						const iy = center + Math.sin(angle) * innerRadius;
						return (
							<text
								key={`inner-${char}`}
								x={ix}
								y={iy}
								textAnchor="middle"
								dominantBaseline="middle"
								fill="#a8d4ff"
								fontSize="10"
							>
								{char}
							</text>
						);
					})}
				</g>
			</svg>
		</div>
	);
};
