import { useCallback, useEffect, useRef, useState } from "react";

type MatrixPulseResult = {
	pulsingIndex: number;
	startPulse: () => void;
};

export const useMatrixPulse = (
	cells: number,
	onComplete?: () => void,
): MatrixPulseResult => {
	const [pulsingIndex, setPulsingIndex] = useState(-1);
	const timersRef = useRef<number[]>([]);

	const clearTimers = useCallback(() => {
		timersRef.current.forEach((timer) => window.clearTimeout(timer));
		timersRef.current = [];
	}, []);

	const startPulse = useCallback(() => {
		clearTimers();
		setPulsingIndex(-1);

		for (let i = 0; i < cells; i += 1) {
			const timer = window.setTimeout(() => {
				setPulsingIndex(i);
			}, i * 80);
			timersRef.current.push(timer);
		}

		const doneTimer = window.setTimeout(
			() => {
				setPulsingIndex(-1);
				onComplete?.();
			},
			cells * 80 + 20,
		);
		timersRef.current.push(doneTimer);
	}, [cells, clearTimers, onComplete]);

	useEffect(() => {
		return () => {
			clearTimers();
		};
	}, [clearTimers]);

	return { pulsingIndex, startPulse };
};
