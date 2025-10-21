import chalk from "chalk";
import { installDeps } from "./installDeps.js";

export async function installAdditionalDeps(responses, pkg) {
	const additionalDeps = [];

	if (responses.installReactIcons) additionalDeps.push("react-icons");
	if (responses.installRouter) additionalDeps.push("react-router-dom");
	if (responses.stateManagement === "redux") {
		additionalDeps.push("@reduxjs/toolkit", "react-redux");
	} else if (responses.stateManagement === "zustand") {
		additionalDeps.push("zustand");
	}
	if (responses.installAxios) additionalDeps.push("axios");
	additionalDeps.push("vite@latest");

	if (additionalDeps.length) {
		console.log(chalk.cyan(`\nInstalling: ${additionalDeps.join(", ")}`));
		await installDeps(pkg, false, ...additionalDeps);
	}
}
