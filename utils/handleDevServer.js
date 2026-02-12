import { isCancel, select } from "@clack/prompts";
import chalk from "chalk";
import { execa } from "execa";
import { onCancel } from "./getUserInputs.js";

export async function handleDevServer(pkg, projectName, log) {
	const startDev = await select({
		message: "Start the development server?",
		options: [
			{ label: "Yes", value: true },
			{ label: "No", value: false },
		],
		initialValue: true,
	});

	if (isCancel(startDev)) onCancel();

	if (startDev) {
		log.step(chalk.green("Starting dev server..."));
		await execa(pkg, ["run", "dev"], { stdio: "inherit" });
	} else {
		console.log(chalk.bold("\nNext steps:"));

		if (projectName !== ".") {
			console.log(chalk.gray(`  cd ${projectName}`));
		}

		console.log(chalk.gray(`  ${pkg} run dev\n`));
	}
}
