module.exports = async () => {
	const modules = await Promise.all([
		import("chalk"),
		import("log-update")
	]);

	return {
		chalk: modules[0].default,
		logUpdate: modules[1].default
	};
};