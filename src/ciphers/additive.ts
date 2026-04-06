import {
	ALPHABET_SIZE,
	charToNum,
	isAlpha,
	mod,
	numToChar,
	toUpperSafe,
} from "./common";
import type { CipherResult, CipherStep } from "./types";

export type AdditiveKey = { shift: number };

const transform = (
	text: string,
	shift: number,
	decryptMode: boolean,
): CipherResult => {
	const normalized = toUpperSafe(text);
	const steps: CipherStep[] = [];
	let result = "";

	const effectiveShift = mod(shift, ALPHABET_SIZE);

	for (let index = 0; index < normalized.length; index += 1) {
		const char = normalized[index];
		if (!isAlpha(char)) {
			result += char;
			continue;
		}

		const source = charToNum(char);
		const target = decryptMode
			? mod(source - effectiveShift, ALPHABET_SIZE)
			: mod(source + effectiveShift, ALPHABET_SIZE);
		const outChar = numToChar(target);
		result += outChar;

		const operation = decryptMode ? "-" : "+";
		steps.push({
			index,
			plainChar: char,
			keyInfo: `shift=${effectiveShift}`,
			calculation: `(${char}=${source} ${operation} ${effectiveShift}) mod 26 = ${target}`,
			cipherChar: outChar,
		});
	}

	return { result, steps };
};

export const encrypt = (text: string, key: AdditiveKey): CipherResult =>
	transform(text, key.shift, false);

export const decrypt = (text: string, key: AdditiveKey): CipherResult =>
	transform(text, key.shift, true);
