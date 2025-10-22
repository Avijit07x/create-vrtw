#!/usr/bin/env node

import { isCancel, log, spinner, text } from "@clack/prompts";
import chalk from "chalk";
import { execa } from "execa";
import path from "path";
import { fileURLToPath } from "url";

// Utility functions
import { confirmEmptyFolder } from "../utils/confirmEmptyFolder.js";
import { cleanDir } from "../utils/fsHelpers.js";
import { getPkgManager } from "../utils/getPkgManager.js";
import { getUserInputs, onCancel } from "../utils/getUserInputs.js";
import { installAdditionalDeps } from "../utils/installDependencies.js";
import { isYarnV1 } from "../utils/isYarnV1.js";
import { setupCssFramework } from "../utils/setupCssFramework.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CURRENT_DIR = process.cwd();
const TEMPLATES_DIR = path.join(__dirname, "../templates");

async function main() {
	let { useNpm, useYarn } = { useNpm: false, useYarn: false };
	const pkg = getPkgManager();

	if (pkg === "npm") useNpm = true;
	if (pkg === "yarn") useYarn = true;

	const projectName = await text({
		message: "Enter your project name:",
		placeholder: "my-app",
		validate(value) {
			if (!value || !value.trim()) return "Project name is required!";
		},
	});

	if (isCancel(projectName)) onCancel();

	await confirmEmptyFolder(projectName);

	const responses = await getUserInputs(projectName);
	const projectPath = path.resolve(CURRENT_DIR, projectName);
	const language = responses.language;
	const viteTemplate = language === "ts" ? "react-ts" : "react";
	const ext = language === "ts" ? "tsx" : "jsx";
	const indexCssPath = path.join(projectPath, "src", "index.css");

	const createSpin = spinner();
	createSpin.start("Creating your Vite + React project...");
	try {
		const createArgs = [
			"create",
			useYarn && isYarnV1() ? "vite" : "vite@latest",
			projectName,
			useNpm && "--",
			"--template",
			viteTemplate,
		].filter(Boolean);

		await execa(pkg, createArgs, { stdio: ["pipe"] });
		createSpin.stop(chalk.green("Project created successfully!"));
	} catch (err) {
		createSpin.stop(chalk.red("Failed to create project."));
		throw err;
	}

	process.chdir(projectPath);

	const depSpin = spinner();
	depSpin.start(`Installing dependencies using ${pkg}...`);
	try {
		await execa(pkg, ["install"], { stdio: ["pipe"] });
		depSpin.stop(chalk.green("Dependencies installed."));
	} catch (err) {
		depSpin.stop(chalk.red("Failed to install dependencies."));
		throw err;
	}

	if (responses.gitInit) {
		const gitSpin = spinner();
		gitSpin.start("Initializing git repository...");
		try {
			await execa("git", ["init"], { stdio: ["pipe"] });
			gitSpin.stop(chalk.green("Git repository initialized."));
		} catch (err) {
			gitSpin.stop(chalk.red("Git initialization failed."));
			throw err;
		}
	}

	const extrasSpin = spinner();
	extrasSpin.start("Installing additional dependencies...");
	try {
		await installAdditionalDeps(responses, pkg, useYarn);
		extrasSpin.stop(chalk.green("Additional dependencies installed."));
	} catch (err) {
		extrasSpin.stop(
			chalk.red("Failed to install additional dependencies.")
		);
		throw err;
	}

	const cssSpin = spinner();
	const cssFramework =
		responses.cssFramework === "none"
			? "No CSS Framework"
			: responses.cssFramework
			? responses.cssFramework.charAt(0).toUpperCase() +
			  responses.cssFramework.slice(1)
			: "N/A";
	if (responses.cssFramework !== "none") {
		cssSpin.start(`Setting up ${cssFramework}...`);
	}
	try {
		await setupCssFramework({
			projectPath,
			TEMPLATES_DIR,
			language,
			cssFramework: responses.cssFramework,
			indexCssPath,
			ext,
			pkg,
		});
		if (responses.cssFramework !== "none") {
			cssSpin.stop(chalk.green(`${cssFramework} setup complete.`));
		}
	} catch (err) {
		cssSpin.stop(chalk.red(`Failed to setup ${cssFramework}.`));
		throw err;
	}

	cleanDir(path.join(process.cwd(), "public"));
	cleanDir(path.join(process.cwd(), "src", "assets"));

	log.step(chalk.green("Project setup complete!"));
	log.step(chalk.green("Dev server started."));
	await execa(pkg, ["run", "dev"], { stdio: "inherit" });
}

main().catch((e) => {
	console.error(chalk.red("Error:"), e.message || e);
	process.exit(1);
});
