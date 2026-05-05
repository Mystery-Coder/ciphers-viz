import { toUpperSafe } from "./common";
import type { CipherResult, CipherStep } from "./types";

export type PlayfairKey = { keyword: string };

type Position = { row: number; col: number };

const GRID_SIZE = 5;

const buildGrid = (keyword: string): string[][] => {
	const cleaned = toUpperSafe(keyword).replace(/[^A-Z]/g, "").replace(/J/g, "I");
	const seen = new Set<string>();
	const letters: string[] = [];

	for (const char of cleaned) {
		if (!seen.has(char)) {
			seen.add(char);
			letters.push(char);
		}
	}

	for (let i = 0; i < 26; i += 1) {
		const letter = String.fromCharCode(65 + i);
		if (letter === "J") continue;
		if (!seen.has(letter)) {
			seen.add(letter);
			letters.push(letter);
		}
	}

	const grid: string[][] = [];
	for (let row = 0; row < GRID_SIZE; row += 1) {
		grid.push(letters.slice(row * GRID_SIZE, (row + 1) * GRID_SIZE));
	}
	return grid;
};

const findPosition = (grid: string[][], letter: string): Position => {
	for (let row = 0; row < GRID_SIZE; row += 1) {
		for (let col = 0; col < GRID_SIZE; col += 1) {
			if (grid[row][col] === letter) {
				return { row, col };
			}
		}
	}
	return { row: 0, col: 0 };
};

const prepareDigraphs = (text: string): string[] => {
	const normalized = toUpperSafe(text).replace(/[^A-Z]/g, "").replace(/J/g, "I");
	const pairs: string[] = [];
	let i = 0;

	while (i < normalized.length) {
		const first = normalized[i];
		if (i + 1 >= normalized.length) {
			pairs.push(first + "X");
			i += 1;
		} else if (normalized[i] === normalized[i + 1]) {
			pairs.push(first + "X");
			i += 1;
		} else {
			pairs.push(normalized[i] + normalized[i + 1]);
			i += 2;
		}
	}

	return pairs;
};

const transformPair = (
	grid: string[][],
	a: string,
	b: string,
	decryptMode: boolean,
): [string, string] => {
	const posA = findPosition(grid, a);
	const posB = findPosition(grid, b);

	if (posA.row === posB.row) {
		const shift = decryptMode ? -1 : 1;
		return [
			grid[posA.row][((posA.col + shift) + GRID_SIZE) % GRID_SIZE],
			grid[posB.row][((posB.col + shift) + GRID_SIZE) % GRID_SIZE],
		];
	}

	if (posA.col === posB.col) {
		const shift = decryptMode ? -1 : 1;
		return [
			grid[((posA.row + shift) + GRID_SIZE) % GRID_SIZE][posA.col],
			grid[((posB.row + shift) + GRID_SIZE) % GRID_SIZE][posB.col],
		];
	}

	return [grid[posA.row][posB.col], grid[posB.row][posA.col]];
};

const transform = (
	text: string,
	keyword: string,
	decryptMode: boolean,
): CipherResult => {
	const cleanKeyword = toUpperSafe(keyword).replace(/[^A-Z]/g, "");
	if (!cleanKeyword) {
		return {
			result: "",
			steps: [],
			error: "Keyword must include at least one letter A-Z.",
		};
	}

	const grid = buildGrid(keyword);
	const digraphs = prepareDigraphs(text);
	const steps: CipherStep[] = [];
	let result = "";

	for (let i = 0; i < digraphs.length; i += 1) {
		const [a, b] = [digraphs[i][0], digraphs[i][1]];
		const [outA, outB] = transformPair(grid, a, b, decryptMode);

		const posA = findPosition(grid, a);
		const posB = findPosition(grid, b);

		let rule = "";
		if (posA.row === posB.row) {
			rule = decryptMode ? "Same row: shift left" : "Same row: shift right";
		} else if (posA.col === posB.col) {
			rule = decryptMode ? "Same col: shift up" : "Same col: shift down";
		} else {
			rule = "Rectangle: swap columns";
		}

		result += outA + outB;
		steps.push({
			index: i,
			plainChar: a + b,
			keyInfo: `(${posA.row},${posA.col}) (${posB.row},${posB.col})`,
			calculation: rule,
			cipherChar: outA + outB,
		});
	}

	return { result, steps };
};

export const buildPlayfairGrid = (keyword: string): string[][] =>
	buildGrid(keyword);

export const encrypt = (text: string, key: PlayfairKey): CipherResult =>
	transform(text, key.keyword, false);

export const decrypt = (text: string, key: PlayfairKey): CipherResult =>
	transform(text, key.keyword, true);
