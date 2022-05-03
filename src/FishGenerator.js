const fs = require("fs");
const replacer = require("replace-color");
const { colors, safe_replacements } = require("../colors.json");
const { primary, secondary } = require("../colors.json").base;
const models = fs.readdirSync("./models").map(file => file.replace(/.[a-z]+$/, "")).filter(file => !file.endsWith(".safe"));

module.exports = class FishGenerator {
	async generateFishes () {
		for (let model of models) {
			await this.generateReplaceSafeModels(model);

			for (const mainColor in colors) {
				await this.generateBases(model, mainColor);
			}

			for (const mainColor in colors) {
				await this.fillBases(model, mainColor);
			}
		}
	}

	async generateBases (model, mainColor) {
		const { chalk, logUpdate } = await require("./CliUtils")();
		logUpdate(chalk.blueBright(`⚙️ Generating bases of ${chalk.white(model)} with color ${chalk.white(mainColor)} (${Object.keys(colors).indexOf(mainColor) + 1}/${Object.keys(colors).length})`));

		let base = `./models/${model}.safe.png`;
		for (const primaryToReplace of primary) {
			if (fs.existsSync(`./dist/${model}/${mainColor}`)) {
				continue;
			}

			const index = primary.indexOf(primaryToReplace);

			try {
				base = await replacer({
					image: base, colors: {
						type: "hex",
						targetColor: `#${safe_replacements.primary[index]}`,
						replaceColor: `#${colors[mainColor][index]}`,
					}
				});
			} catch (e) {
				console.error(e);
				process.exit(1);
				return;
			}

			if (primary.length - 1 === index) {
				await base.writeAsync(`./dist/${model}/${mainColor}/base.png`);
			}
		}
	}

	async fillBases (model, mainColor) {
		const { chalk, logUpdate } = await require("./CliUtils")();
		for (const secondaryColor in colors) {
			logUpdate(chalk.blueBright(`⚙️ Filling ${chalk.white(mainColor)} (${Object.keys(colors).indexOf(mainColor) + 1}/${Object.keys(colors).length}) base of ${chalk.white(model)} with color ${chalk.white(secondaryColor)} (${Object.keys(colors).indexOf(secondaryColor) + 1}/${Object.keys(colors).length})`));

			let base = `./dist/${model}/${mainColor}/base.png`;
			if (!fs.existsSync(base)) continue;

			for (const secondaryToReplace of secondary) {
				if (fs.existsSync(`./dist/${model}/${mainColor}/${secondaryColor}.png`)) {
					continue;
				}

				const index = secondary.indexOf(secondaryToReplace);

				try {
					base = await replacer({
						image: base, colors: {
							type: "hex",
							targetColor: `#${safe_replacements.secondary[index]}`,
							replaceColor: `#${colors[secondaryColor][index]}`,
						}
					});
				} catch (e) {
					console.error(e);
					process.exit(1);
					return;
				}

				if (secondary.length - 1 === index) {
					await base.writeAsync(`./dist/${model}/${mainColor}/${secondaryColor}.png`);
				}
			}
		}
	}

	async deleteBases () {
		const dist = fs.readdirSync("./dist").filter(file => file.endsWith(".zip"));
		const safeModels = fs.readdirSync("./models").filter(file => file.endsWith(".safe.png"));

		safeModels.forEach(file => fs.unlinkSync(`./models/${file}`));

		if (dist.length < 0) {
			console.error("No files generated in dist");
			process.exit(1);
			return;
		}

		dist.forEach(dir => {
			fs.readdirSync(`./dist/${dir}`).forEach(color => {
				fs.readdirSync(`./dist/${dir}/${color}`).forEach(file => {
					if (file === "base.png") {
						fs.unlinkSync(`./dist/${dir}/${color}/${file}`);
					}
				});
			});
		});
	}

	async generateReplaceSafeModels (model) {
		let base = `./models/${model}.png`;

		if (fs.existsSync(`./models/${model}.safe.png`)) return;
		const { chalk, logUpdate } = await require("./CliUtils")();
		logUpdate(chalk.blueBright(`⚙️ Generating color-replace safe base : ${chalk.white(model)}`));

		for (const primaryToReplace of primary) {
			const index = primary.indexOf(primaryToReplace);

			try {
				base = await replacer({
					image: base, colors: {
						type: "hex", targetColor: `#${primaryToReplace}`, replaceColor: `#${safe_replacements.primary[index]}`,
					}
				});
			} catch (e) {
				console.error(e);
				process.exit(1);
				return;
			}
		}

		for (const secondaryToReplace of secondary) {
			const index = secondary.indexOf(secondaryToReplace);

			try {
				base = await replacer({
					image: base, colors: {
						type: "hex", targetColor: `#${secondaryToReplace}`, replaceColor: `#${safe_replacements.secondary[index]}`,
					}
				});
			} catch (e) {
				console.error(e);
				process.exit(1);
				return;
			}

			if (secondary.length - 1 === index) {
				await base.writeAsync(`./models/${model}.safe.png`);
			}
		}
	}
};