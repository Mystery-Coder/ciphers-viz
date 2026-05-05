import { useEffect, useRef, useState } from "react";

type PlayfairGridProps = {
	grid: string[][];
	highlightLetters?: string;
};

export const PlayfairGrid = ({
	grid,
	highlightLetters,
}: PlayfairGridProps) => {
	const [trackedLetters, setTrackedLetters] = useState("");
	const [pulseTick, setPulseTick] = useState(0);
	const mountedRef = useRef(false);

	useEffect(() => {
		if (!mountedRef.current) {
			const timer = window.setTimeout(() => {
				setTrackedLetters(highlightLetters || "");
				mountedRef.current = true;
			}, 600);
			return () => window.clearTimeout(timer);
		}
		setTrackedLetters(highlightLetters || "");
	}, [highlightLetters]);

	useEffect(() => {
		setPulseTick((prev) => prev + 1);
	}, [trackedLetters]);

	const getCellClass = (row: number, col: number): string => {
		if (!trackedLetters || trackedLetters.length < 2) {
			return "text-bp-dim";
		}

		const [a, b] = [trackedLetters[0], trackedLetters[1]];
		const posA = findPos(grid, a);
		const posB = findPos(grid, b);

		if (!posA || !posB) return "text-bp-dim";

		const isA = row === posA.row && col === posA.col;
		const isB = row === posB.row && col === posB.col;

		if (isA || isB) {
			return "bg-[rgba(100,180,255,0.2)] text-bp-accent font-semibold intersect-pulse";
		}

		if (posA.row === posB.row && row === posA.row) {
			return "bg-[rgba(100,180,255,0.08)] text-bp-pale";
		}

		if (posA.col === posB.col && col === posA.col) {
			return "bg-[rgba(100,180,255,0.08)] text-bp-pale";
		}

		if (posA.row !== posB.row && posA.col !== posB.col) {
			const isCorner =
				(row === posA.row && col === posB.col) ||
				(row === posB.row && col === posA.col);
			if (isCorner) {
				return "bg-[rgba(100,180,255,0.15)] text-bp-pale intersect-pulse";
			}
		}

		return "text-bp-dim";
	};

	return (
		<div className="border border-bp-border bg-bp-panel p-4">
			<p className="mb-3 text-[10px] tracking-[0.15em] text-bp-dim">
				PLAYFAIR SQUARE
			</p>
			<div className="grid w-max grid-cols-5">
				{grid.map((row, rowIdx) =>
					row.map((letter, colIdx) => (
						<div
							key={`cell-${rowIdx}-${colIdx}-${pulseTick}`}
							className={`flex h-10 w-10 items-center justify-center border border-bp-border text-sm transition-all duration-150 ${getCellClass(rowIdx, colIdx)}`}
						>
							{letter}
						</div>
					)),
				)}
			</div>
		</div>
	);
};

const findPos = (
	grid: string[][],
	letter: string,
): { row: number; col: number } | null => {
	for (let row = 0; row < grid.length; row += 1) {
		for (let col = 0; col < grid[row].length; col += 1) {
			if (grid[row][col] === letter) {
				return { row, col };
			}
		}
	}
	return null;
};
