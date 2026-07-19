import crypto from "crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const generateBookingReference = (): string => {
	const bytes = crypto.randomBytes(8);

	let code = "";

	for (const byte of bytes) {
		code += ALPHABET[byte % ALPHABET.length];
	}

	return `BME-${code}`;
};
