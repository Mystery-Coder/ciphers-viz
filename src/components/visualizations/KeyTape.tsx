import { useEffect, useMemo, useRef } from "react";

type KeyTapeProps = {
	plain: string;
	runningKey: string;
	cipher: string;
	seedLength?: number;
};

export const KeyTape = ({
	plain,
	runningKey,
	cipher,
	seedLength = 0,
}: KeyTapeProps) => {
	const tapeRef = useRef<HTMLDivElement | null>(null);

	const columns = useMemo(
		() => Math.max(plain.length, runningKey.length, cipher.length),
		[plain, runningKey, cipher],
	);

	useEffect(() => {
		if (!tapeRef.current) {
			return;
		}
		tapeRef.current.scrollLeft = tapeRef.current.scrollWidth;
	}, [columns, runningKey, cipher, plain]);

	const row = (
		label: string,
		text: string,
		tone: "dim" | "accent" | "pale",
		rowType: "plain" | "key" | "cipher",
	) => (
		<div className="grid auto-cols-fr grid-flow-col gap-1">
			<div className="min-w-20 border border-bp-border px-2 py-1 text-xs text-bp-dim">
				{label}
			</div>
			{Array.from({ length: columns }, (_, i) => text[i] ?? " ").map(
				(char, i) =>
					(() => {
						const keySeedCell =
							rowType === "key" &&
							i < seedLength &&
							char.trim() !== "";
						const keyGeneratedCell =
							rowType === "key" &&
							i >= seedLength &&
							char.trim() !== "";
						const keyCellClass = keySeedCell
							? "border-[#64b4ff] bg-[rgba(100,180,255,0.12)]"
							: keyGeneratedCell
								? "border border-dashed border-[#a8d4ff] bg-[rgba(100,180,255,0.08)]"
								: "border-bp-border";

						return (
							<div
								key={`${label}-${i}`}
								className={`key-tape-cell border px-2 py-1 text-center text-sm ${keyCellClass} ${
									tone === "accent"
										? "text-bp-accent"
										: tone === "pale"
											? "text-bp-pale"
											: "text-bp-dim"
								}`}
							>
								{char}
							</div>
						);
					})(),
			)}
		</div>
	);

	return (
		<div
			ref={tapeRef}
			className="space-y-2 overflow-x-auto border border-bp-border bg-bp-panel p-4"
		>
			<p className="text-[10px] tracking-[0.15em] text-bp-dim">
				RUNNING KEY TAPE
			</p>
			{row("PLAIN", plain, "pale", "plain")}
			{row("KEY", runningKey, "accent", "key")}
			{row("CIPHER", cipher, "pale", "cipher")}
		</div>
	);
};
