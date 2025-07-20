import chalk from "chalk";
import { execa } from "execa";

export async function installAdditionalDeps(responses) {
	const additionalDeps = [];

	if (responses.installLucide) additionalDeps.push("lucide-react");
	if (responses.installRouter) additionalDeps.push("react-router");
	if (responses.installRedux)
		additionalDeps.push("@reduxjs/toolkit", "react-redux");

	if (additionalDeps.length) {
		console.log(
			chalk.cyan(`\n📦 Installing: ${additionalDeps.join(", ")}`)
		);
		await execa("npm", ["install", ...additionalDeps], {
			stdio: "inherit",
		});
	}
}
