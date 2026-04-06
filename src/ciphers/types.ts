export type CipherMode = "encrypt" | "decrypt";

export type CipherStep = {
	index: number;
	plainChar: string;
	keyInfo: string;
	calculation: string;
	cipherChar: string;
};

export type CipherResult = {
	result: string;
	steps: CipherStep[];
	error?: string;
};
