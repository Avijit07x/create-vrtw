import chalk from "chalk";

export function printFinalMessage(responses, projectName) {
	console.log(chalk.greenBright.bold("\n✔ Project setup complete!\n"));
	
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
