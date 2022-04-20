const fs = require("fs");
const replacer = require("replace-color");
const { colors } = require("../colors.json");
const { primary, secondary } = require("../colors.json").base;
const models = fs.readdirSync("./models").map(file => file.replace(/.[a-z]+$/, ""));

module.exports = class FishGenerator {
	static async generateFishes () {
		for (const model of models) {
			for (const mainColor in colors) {
				await this.generateBases(model, mainColor);
			}
			for (const mainColor in colors) {
				await this.fillBases(model, mainColor);
			}
		}
	}

	static async generateBases (model, mainColor) {
		console.log(`Generating bases of ${model} with color ${mainColor}`);

		let base = `./models/${model}.png`;
		for (const primaryToReplace of primary) {
			if (fs.existsSync(`./dist/${model}/${mainColor}`)) {
				continue;
			}

			const index = primary.indexOf(primaryToReplace);

			try {
				base = await replacer({
					image: base,
					colors: {
						type: "hex",
						targetColor: `#${primaryToReplace}`,
						replaceColor: `#${colors[mainColor][index]}`,
					}
				});
			} catch (e) {
				console.error(e);
				process.exit(1);
				return;
			}

			if (primary.length - 1 === index) {
				await base.write(`./dist/${model}/${mainColor}/base.png`);
			}
		}
	}

	static async fillBases (model, mainColor) {
		for (const secondaryColor in colors) {
			console.log(`Filling ${mainColor} base of ${model} with color ${secondaryColor}`);

			let base = `./dist/${model}/${mainColor}/base.png`;
			if (!fs.existsSync(base)) continue;

			for (const secondaryToReplace of secondary) {
				if (fs.existsSync(`./dist/${model}/${mainColor}/${secondaryColor}.png`)) {
					continue;
				}

				const index = secondary.indexOf(secondaryToReplace);

				try {
					base = await replacer({
						image: base,
						colors: {
							type: "hex",
							targetColor: `#${secondaryToReplace}`,
							replaceColor: `#${colors[secondaryColor][index]}`,
						}
					});
				} catch (e) {
					console.error(e);
					process.exit(1);
					return;
				}

				if (secondary.length - 1 === index) {
					await base.write(`./dist/${model}/${mainColor}/${secondaryColor}.png`);
				}
			}
		}
	}

	static async deleteBases () {
		const dist = fs.readdirSync("./dist");

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
};