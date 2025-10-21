#!/usr/bin/env node

import chalk from "chalk";
import { execa } from "execa";
import path from "path";
import prompts from "prompts";
import { fileURLToPath } from "url";

// Utility functions
import { confirmEmptyFolder } from "../utils/confirmEmptyFolder.js";
import { cleanDir } from "../utils/fsHelpers.js";
import { getPkgManager } from "../utils/getPkgManager.js";
import { getUserInputs, onCancel } from "../utils/getUserInputs.js";
import { installAdditionalDeps } from "../utils/installDependencies.js";
import { isYarnV1 } from "../utils/isYarnV1.js";
import { printFinalMessage } from "../utils/printFinalMessage.js";
import { setupCssFramework } from "../utils/setupCssFramework.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CURRENT_DIR = process.cwd();
const TEMPLATES_DIR = path.join(__dirname, "../templates");

async function main() {
	let { useNpm, useYarn } = { useNpm: false, useYarn: false };

	const pkg = getPkgManager();

	if (pkg === "npm") {
		useNpm = true;
	}

	const { projectName } = await prompts(
		{
			type: "text",
			name: "projectName",
			message: "Enter your project name:",
			validate: (name) => !!name || "Project name is required!",
		},
		{ onCancel }
	);

	await confirmEmptyFolder(projectName);

	const responses = await getUserInputs(projectName);

	const projectPath = path.resolve(CURRENT_DIR, projectName);
	const language = responses.language;
	const viteTemplate = language === "ts" ? "react-ts" : "react";
	const ext = language === "ts" ? "tsx" : "jsx";

	console.log(
		chalk.cyan(
			`\nCreating Vite React + ${
				language === "ts" ? "TypeScript" : "JavaScript"
			} project...`
		)
	);

	const createArgs = [
		"create",
		useYarn && isYarnV1() ? "vite" : "vite@latest",
		projectName,
		useNpm && "--",
		"--template",
		viteTemplate,
	];

	await execa(pkg, createArgs, { stdio: ["pipe"] });

	process.chdir(projectPath);

	const indexCssPath = path.join(process.cwd(), "src", "index.css");

	console.log(chalk.cyan(`\nInstalling dependencies using ${pkg}...`));

	await execa(pkg, ["install"], { stdio: "inherit" });

	if (responses.gitInit) {
		await execa("git", ["init"], { stdio: "inherit" });
		console.log(chalk.green("✔ Git repository initialized!"));
	}

	await installAdditionalDeps(responses, pkg);

	await setupCssFramework({
		projectPath,
		TEMPLATES_DIR,
		language,
		cssFramework: responses.cssFramework,
		indexCssPath,
		ext,
		pkg,
	});

	cleanDir(path.join(process.cwd(), "public"));
	cleanDir(path.join(process.cwd(), "src", "assets"));

	printFinalMessage(responses, projectName);

	await execa(pkg, ["run", "dev"], { stdio: "inherit" });
}

main().catch((e) => {
	console.error(chalk.red("Error:"), e.message || e);
	process.exit(1);
});
