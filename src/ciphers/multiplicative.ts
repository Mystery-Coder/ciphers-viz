import {
	ALPHABET_SIZE,
	charToNum,
	gcd,
	isAlpha,
	mod,
	modInverse,
	numToChar,
	toUpperSafe,
} from "./common";
import type { CipherResult, CipherStep } from "./types";

export type MultiplicativeKey = { factor: number };

const validateKey = (factor: number): string | null => {
	if (gcd(factor, ALPHABET_SIZE) !== 1) {
		return "Key must be coprime with 26.";
	}
	return null;
};

export const multiplicationTableMod26 = (factor: number): number[] =>
	Array.from({ length: ALPHABET_SIZE }, (_, n) =>
		mod(n * factor, ALPHABET_SIZE),
	);

const transform = (
	text: string,
	factor: number,
	decryptMode: boolean,
): CipherResult => {
	const keyError = validateKey(factor);
	if (keyError) {
		return { result: "", steps: [], error: keyError };
	}

	const normalized = toUpperSafe(text);
	const steps: CipherStep[] = [];
	let result = "";

	const cleanFactor = mod(factor, ALPHABET_SIZE);
	const inverse = modInverse(cleanFactor, ALPHABET_SIZE);
	if (inverse === null) {
		return {
			result: "",
			steps: [],
			error: "Unable to compute modular inverse for key.",
		};
	}

	for (let index = 0; index < normalized.length; index += 1) {
		const char = normalized[index];
		if (!isAlpha(char)) {
			result += char;
			continue;
		}

		const source = charToNum(char);
		const target = decryptMode
			? mod(source * inverse, ALPHABET_SIZE)
			: mod(source * cleanFactor, ALPHABET_SIZE);
		const outChar = numToChar(target);
		result += outChar;

		const factorUsed = decryptMode ? inverse : cleanFactor;
		steps.push({
			index,
			plainChar: char,
			keyInfo: decryptMode
				? `factor^-1=${inverse} (from ${cleanFactor})`
				: `factor=${cleanFactor}`,
			calculation: `(${char}=${source} * ${factorUsed}) mod 26 = ${target}`,
			cipherChar: outChar,
		});
	}

	return { result, steps };
};

export const encrypt = (text: string, key: MultiplicativeKey): CipherResult =>
	transform(text, key.factor, false);

export const decrypt = (text: string, key: MultiplicativeKey): CipherResult =>
	transform(text, key.factor, true);
