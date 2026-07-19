const currency = new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0,
});

export const formatCurrency = (value: number) => {
	return currency.format(value || 0);
};

export const formatPrice = (value: number) => {
	return value ? currency.format(value) : "Free";
};

export const formatDate = (value: string) => {
	return new Date(value).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

export const formatDateTime = (value: string) => {
	return new Date(value).toLocaleString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
};
