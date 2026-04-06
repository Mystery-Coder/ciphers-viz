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

export type AffineKey = { a: number; b: number };

const validateKey = (a: number): string | null => {
	if (gcd(a, ALPHABET_SIZE) !== 1) {
		return "Key a must be coprime with 26.";
	}
	return null;
};

const transform = (
	text: string,
	key: AffineKey,
	decryptMode: boolean,
): CipherResult => {
	const keyError = validateKey(key.a);
	if (keyError) {
		return { result: "", steps: [], error: keyError };
	}

	const normalized = toUpperSafe(text);
	const steps: CipherStep[] = [];
	let result = "";

	const a = mod(key.a, ALPHABET_SIZE);
	const b = mod(key.b, ALPHABET_SIZE);
	const invA = modInverse(a, ALPHABET_SIZE);

	if (invA === null) {
		return {
			result: "",
			steps: [],
			error: "Unable to compute inverse of key a.",
		};
	}

	for (let index = 0; index < normalized.length; index += 1) {
		const char = normalized[index];
		if (!isAlpha(char)) {
			result += char;
			continue;
		}

		const source = charToNum(char);
		const mul = decryptMode
			? mod(source - b, ALPHABET_SIZE)
			: mod(source * a, ALPHABET_SIZE);
		const target = decryptMode
			? mod(mul * invA, ALPHABET_SIZE)
			: mod(mul + b, ALPHABET_SIZE);
		const outChar = numToChar(target);
		result += outChar;

		const calculation = decryptMode
			? `${invA}*(${source} - ${b}) mod 26 = ${target}`
			: `(${a}*${source} + ${b}) mod 26 = ${target}`;

		steps.push({
			index,
			plainChar: char,
			keyInfo: `a=${a}, b=${b}${decryptMode ? `, a^-1=${invA}` : ""}`,
			calculation,
			cipherChar: outChar,
		});
	}

	return { result, steps };
};

export const encrypt = (text: string, key: AffineKey): CipherResult =>
	transform(text, key, false);

export const decrypt = (text: string, key: AffineKey): CipherResult =>
	transform(text, key, true);
