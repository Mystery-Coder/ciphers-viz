export const A_CODE = 65;
export const ALPHABET_SIZE = 26;

export const isAlpha = (char: string): boolean => /^[A-Z]$/.test(char);

export const toUpperSafe = (text: string): string => text.toUpperCase();

export const charToNum = (char: string): number => char.charCodeAt(0) - A_CODE;

export const numToChar = (value: number): string =>
	String.fromCharCode(A_CODE + mod(value, ALPHABET_SIZE));

export const mod = (value: number, modulo: number): number =>
	((value % modulo) + modulo) % modulo;

export const gcd = (a: number, b: number): number => {
	let x = Math.abs(a);
	let y = Math.abs(b);
	while (y !== 0) {
		const t = y;
		y = x % y;
		x = t;
	}
	return x;
};

export const modInverse = (a: number, m: number): number | null => {
	const value = mod(a, m);
	for (let i = 1; i < m; i += 1) {
		if (mod(value * i, m) === 1) {
			return i;
		}
	}
	return null;
};
