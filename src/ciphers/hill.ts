import {
	ALPHABET_SIZE,
	charToNum,
	mod,
	modInverse,
	numToChar,
	toUpperSafe,
} from "./common";
import type { CipherResult, CipherStep } from "./types";

export type Matrix2x2 = [[number, number], [number, number]];
export type HillKey = { matrix: Matrix2x2 };

export const determinantMod26 = (matrix: Matrix2x2): number =>
	mod(
		matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0],
		ALPHABET_SIZE,
	);

export const inverseMatrixMod26 = (matrix: Matrix2x2): Matrix2x2 | null => {
	const det = determinantMod26(matrix);
	const invDet = modInverse(det, ALPHABET_SIZE);
	if (invDet === null) {
		return null;
	}

	return [
		[
			mod(invDet * matrix[1][1], ALPHABET_SIZE),
			mod(invDet * -matrix[0][1], ALPHABET_SIZE),
		],
		[
			mod(invDet * -matrix[1][0], ALPHABET_SIZE),
			mod(invDet * matrix[0][0], ALPHABET_SIZE),
		],
	];
};

const multiplyVector = (
	matrix: Matrix2x2,
	vector: [number, number],
): [number, number] => {
	const x = mod(
		matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
		ALPHABET_SIZE,
	);
	const y = mod(
		matrix[1][0] * vector[0] + matrix[1][1] * vector[1],
		ALPHABET_SIZE,
	);
	return [x, y];
};

const alphaOnly = (text: string): string =>
	toUpperSafe(text).replace(/[^A-Z]/g, "");

const transform = (
	text: string,
	matrix: Matrix2x2,
	decryptMode: boolean,
): CipherResult => {
	const useMatrix = decryptMode ? inverseMatrixMod26(matrix) : matrix;

	if (!useMatrix) {
		return {
			result: "",
			steps: [],
			error: "Matrix is not invertible mod 26.",
		};
	}

	const raw = alphaOnly(text);
	if (!raw) {
		return { result: "", steps: [] };
	}

	const padded = raw.length % 2 === 0 ? raw : `${raw}X`;
	const steps: CipherStep[] = [];
	let result = "";

	for (let i = 0; i < padded.length; i += 2) {
		const c1 = padded[i];
		const c2 = padded[i + 1];
		const vec: [number, number] = [charToNum(c1), charToNum(c2)];
		const out = multiplyVector(useMatrix, vec);
		const outChars: [string, string] = [
			numToChar(out[0]),
			numToChar(out[1]),
		];

		result += outChars.join("");

		steps.push({
			index: i,
			plainChar: `${c1}${c2}`,
			keyInfo: decryptMode ? "inverse matrix" : "key matrix",
			calculation: `[[${useMatrix[0][0]},${useMatrix[0][1]}],[${useMatrix[1][0]},${useMatrix[1][1]}]] * [${vec[0]},${vec[1]}] = [${out[0]},${out[1]}] mod 26`,
			cipherChar: outChars.join(""),
		});
	}

	return { result, steps };
};

export const encrypt = (text: string, key: HillKey): CipherResult =>
	transform(text, key.matrix, false);

export const decrypt = (text: string, key: HillKey): CipherResult =>
	transform(text, key.matrix, true);
