import { useMemo } from "react";

export const useStaggerChildren = (
	count: number,
	intervalMs: number,
): number[] => {
	return useMemo(
		() =>
			Array.from(
				{ length: count },
				(_, index) => Math.min(index, 19) * intervalMs,
			),
		[count, intervalMs],
	);
};
