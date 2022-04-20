const FishGenerator = require("./FishGenerator");

const startTime = Date.now();
FishGenerator.generateFishes()
	.then(FishGenerator.deleteBases)
	.then(() => {
		console.log(`Done in ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
	});