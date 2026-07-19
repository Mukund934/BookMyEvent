interface PasswordResetMail {
	to: string;
	resetUrl: string;
}

export const sendPasswordResetEmail = async ({
	to,
	resetUrl,
}: PasswordResetMail): Promise<void> => {
	console.log(
		`[MAIL] password reset for ${to} -> ${resetUrl}`,
	);
};
