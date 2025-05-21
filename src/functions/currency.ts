export const formatCurrency = (num: number) => {
	return num.toLocaleString("zh-TW", {
		style: "currency",
		currency: "TWD",
	});
};
