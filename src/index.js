const FishGenerator = new (require("./FishGenerator"))();

const startTime = Date.now();
FishGenerator.generateFishes()
	.then(FishGenerator.deleteBases)
	.then(async () => {
		const { chalk, logUpdate } = await require("./CliUtils")();

		let time = ((Date.now() - startTime) / 1000).toFixed(2);

		if (time >= 60) {
			time = `${(time / 60).toFixed(2)}min`;
		} else {
			time = `${time}s`;
		}
		logUpdate(chalk.greenBright(`✅ Done in ${time}`));
	});