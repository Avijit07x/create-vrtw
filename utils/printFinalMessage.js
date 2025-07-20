import chalk from "chalk";

export function printFinalMessage(responses, projectName) {
	console.log(chalk.greenBright.bold("\n🎉 Project setup complete! 🚀\n"));
	console.log(chalk.yellowBright("Next steps:"));
	console.log(chalk.yellow(`  cd ${projectName}`));
	console.log(chalk.yellow("  npm run dev\n"));

	if (responses.cssFramework !== "none") {
		console.log(chalk.gray("Useful docs:"));
	}
	if (responses.cssFramework === "tailwind") {
		console.log(
			chalk.gray(
				"- Tailwind CSS: https://tailwindcss.com/docs/installation"
			)
		);
	} else if (responses.cssFramework === "bootstrap") {
		console.log(chalk.gray("- Bootstrap: https://getbootstrap.com/docs/"));
	}
}
