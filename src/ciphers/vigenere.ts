import {
	ALPHABET_SIZE,
	charToNum,
	isAlpha,
	mod,
	numToChar,
	toUpperSafe,
} from "./common";
import type { CipherResult, CipherStep } from "./types";

export type VigenereKey = { keyword: string };

const normalizeKeyword = (keyword: string): string =>
	toUpperSafe(keyword).replace(/[^A-Z]/g, "");

const transform = (
	text: string,
	keyword: string,
	decryptMode: boolean,
): CipherResult => {
	const cleanKeyword = normalizeKeyword(keyword);
	if (!cleanKeyword) {
		return {
			result: "",
			steps: [],
			error: "Keyword must include at least one letter A-Z.",
		};
	}

	const normalized = toUpperSafe(text);
	const steps: CipherStep[] = [];
	let result = "";
	let alphaPosition = 0;

	for (let index = 0; index < normalized.length; index += 1) {
		const char = normalized[index];
		if (!isAlpha(char)) {
			result += char;
			continue;
		}

		const keyChar = cleanKeyword[alphaPosition % cleanKeyword.length];
		const p = charToNum(char);
		const k = charToNum(keyChar);
		const value = decryptMode
			? mod(p - k, ALPHABET_SIZE)
			: mod(p + k, ALPHABET_SIZE);
		const outChar = numToChar(value);

		result += outChar;
		steps.push({
			index,
			plainChar: char,
			keyInfo: `key=${keyChar} (${k})`,
			calculation: decryptMode
				? `(${p} - ${k}) mod 26 = ${value}`
				: `(${p} + ${k}) mod 26 = ${value}`,
			cipherChar: outChar,
		});

		alphaPosition += 1;
	}

	return { result, steps };
};

export const buildTabulaRecta = (): string[][] =>
	Array.from({ length: ALPHABET_SIZE }, (_, row) =>
		Array.from({ length: ALPHABET_SIZE }, (_, col) => numToChar(row + col)),
	);

export const encrypt = (text: string, key: VigenereKey): CipherResult =>
	transform(text, key.keyword, false);

export const decrypt = (text: string, key: VigenereKey): CipherResult =>
	transform(text, key.keyword, true);
