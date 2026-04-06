import { useEffect, useState } from "react";

type AnimatedStringResult = {
	displayed: string;
	done: boolean;
};

export const useAnimatedString = (
	target: string,
	charDelay: number = 25,
): AnimatedStringResult => {
	const [displayed, setDisplayed] = useState("");

	useEffect(() => {
		setDisplayed("");
		if (!target) {
			return;
		}

		let index = 0;
		const interval = window.setInterval(() => {
			index += 1;
			setDisplayed(target.slice(0, index));
			if (index >= target.length) {
				window.clearInterval(interval);
			}
		}, charDelay);

		return () => {
			window.clearInterval(interval);
		};
	}, [target, charDelay]);

	return {
		displayed,
		done: displayed === target,
	};
};
