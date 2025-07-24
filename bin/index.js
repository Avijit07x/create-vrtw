#!/usr/bin/env node

import chalk from "chalk";
import { execa } from "execa";
import path from "path";
import { fileURLToPath } from "url";

// Utility functions
import { cleanDir } from "../utils/fsHelpers.js";
import { getUserInputs } from "../utils/getUserInputs.js";
import { installAdditionalDeps } from "../utils/installDependencies.js";
import { printFinalMessage } from "../utils/printFinalMessage.js";
import { setupCssFramework } from "../utils/setupCssFramework.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CURRENT_DIR = process.cwd();
const TEMPLATES_DIR = path.join(__dirname, "../templates");

async function main() {
	// Prompt user for configuration
	const responses = await getUserInputs();

	const projectName = responses.projectName?.trim() || "my-app";
	const projectPath = path.resolve(CURRENT_DIR, projectName);
	const language = responses.language;
	const viteTemplate = language === "ts" ? "react-ts" : "react";
	const ext = language === "ts" ? "tsx" : "jsx";

	// Create Vite project using selected template
	console.log(
		chalk.cyan(
			`\n🛠️  Creating Vite React + ${
				language === "ts" ? "TypeScript" : "JavaScript"
			} project...`
		)
	);
	await execa(
		"npm",
		[
			"create",
			"vite@latest",
			projectName,
			"--",
			"--template",
			viteTemplate,
		],
		{ stdio: "inherit" }
	);

	process.chdir(projectPath);
	const indexCssPath = path.join(process.cwd(), "src", "index.css");

	// Install default Vite dependencies
	console.log(chalk.cyan("\n📦 Installing npm dependencies..."));
	await execa("npm", ["install"], { stdio: "inherit" });

	// Initialize Git if selected
	if (responses.gitInit) {
		await execa("git", ["init"], { stdio: "inherit" });
		console.log(chalk.green("✔ Git repository initialized!"));
	}

	// Install selected additional dependencies
	await installAdditionalDeps(responses);

	// Setup selected CSS framework
	await setupCssFramework({
		projectPath,
		TEMPLATES_DIR,
		language,
		cssFramework: responses.cssFramework,
		indexCssPath,
		ext,
	});

	// Clean up default files
	cleanDir(path.join(process.cwd(), "public"));
	cleanDir(path.join(process.cwd(), "src", "assets"));

	// Final instructions and helpful links
	printFinalMessage(responses, projectName);
}

// Handle unexpected errors
main().catch((e) => {
	console.error(chalk.red("❌ Error:"), e.message || e);
	process.exit(1);
});
