import {
	ALPHABET_SIZE,
	charToNum,
	isAlpha,
	mod,
	numToChar,
	toUpperSafe,
} from "./common";
import type { CipherResult, CipherStep } from "./types";

export type AutokeyKey = { seed: string };

const normalizeSeed = (seed: string): string =>
	toUpperSafe(seed).replace(/[^A-Z]/g, "");

const encryptInternal = (text: string, seed: string): CipherResult => {
	const normalized = toUpperSafe(text);
	const cleanSeed = normalizeSeed(seed);

	if (!cleanSeed) {
		return {
			result: "",
			steps: [],
			error: "Seed key must include at least one letter A-Z.",
		};
	}

	const steps: CipherStep[] = [];
	let result = "";
	let alphaPosition = 0;

	for (let index = 0; index < normalized.length; index += 1) {
		const char = normalized[index];
		if (!isAlpha(char)) {
			result += char;
			continue;
		}

		const keyChar =
			alphaPosition < cleanSeed.length
				? cleanSeed[alphaPosition]
				: normalized.replace(/[^A-Z]/g, "")[
						alphaPosition - cleanSeed.length
					];

		const p = charToNum(char);
		const k = charToNum(keyChar);
		const c = mod(p + k, ALPHABET_SIZE);
		const outChar = numToChar(c);

		result += outChar;
		steps.push({
			index,
			plainChar: char,
			keyInfo: `key=${keyChar}`,
			calculation: `(${p} + ${k}) mod 26 = ${c}`,
			cipherChar: outChar,
		});

		alphaPosition += 1;
	}

	return { result, steps };
};

const decryptInternal = (text: string, seed: string): CipherResult => {
	const normalized = toUpperSafe(text);
	const cleanSeed = normalizeSeed(seed);

	if (!cleanSeed) {
		return {
			result: "",
			steps: [],
			error: "Seed key must include at least one letter A-Z.",
		};
	}

	const steps: CipherStep[] = [];
	let result = "";
	const decryptedLetters: string[] = [];
	let alphaPosition = 0;

	for (let index = 0; index < normalized.length; index += 1) {
		const char = normalized[index];
		if (!isAlpha(char)) {
			result += char;
			continue;
		}

		const keyChar =
			alphaPosition < cleanSeed.length
				? cleanSeed[alphaPosition]
				: decryptedLetters[alphaPosition - cleanSeed.length];

		const c = charToNum(char);
		const k = charToNum(keyChar);
		const p = mod(c - k, ALPHABET_SIZE);
		const outChar = numToChar(p);

		result += outChar;
		decryptedLetters.push(outChar);
		steps.push({
			index,
			plainChar: char,
			keyInfo: `key=${keyChar}`,
			calculation: `(${c} - ${k}) mod 26 = ${p}`,
			cipherChar: outChar,
		});

		alphaPosition += 1;
	}

	return { result, steps };
};

export const encrypt = (text: string, key: AutokeyKey): CipherResult =>
	encryptInternal(text, key.seed);

export const decrypt = (text: string, key: AutokeyKey): CipherResult =>
	decryptInternal(text, key.seed);
