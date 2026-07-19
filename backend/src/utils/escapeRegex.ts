export const escapeRegex = (value: string) => {
	return value.slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
