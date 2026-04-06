import { useMemo } from "react";

type KeyTapeProps = {
	plain: string;
	runningKey: string;
	cipher: string;
};

export const KeyTape = ({ plain, runningKey, cipher }: KeyTapeProps) => {
	const columns = useMemo(
		() => Math.max(plain.length, runningKey.length, cipher.length),
		[plain, runningKey, cipher],
	);

	const row = (
		label: string,
		text: string,
		tone: "dim" | "accent" | "pale",
	) => (
		<div className="grid auto-cols-fr grid-flow-col gap-1">
			<div className="min-w-20 border border-bp-border px-2 py-1 text-xs text-bp-dim">
				{label}
			</div>
			{Array.from({ length: columns }, (_, i) => text[i] ?? " ").map(
				(char, i) => (
					<div
						key={`${label}-${i}`}
						className={`animate-slide-in border border-bp-border px-2 py-1 text-center text-sm ${
							tone === "accent"
								? "text-bp-accent"
								: tone === "pale"
									? "text-bp-pale"
									: "text-bp-dim"
						}`}
					>
						{char}
					</div>
				),
			)}
		</div>
	);

	return (
		<div className="space-y-2 border border-bp-border bg-bp-panel p-4">
			<p className="text-[10px] tracking-[0.15em] text-bp-dim">
				RUNNING KEY TAPE
			</p>
			{row("PLAIN", plain, "pale")}
			{row("KEY", runningKey, "accent")}
			{row("CIPHER", cipher, "pale")}
		</div>
	);
};
