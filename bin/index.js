#!/usr/bin/env node

import chalk from "chalk";
import { execa } from "execa";
import fs, { promises as fsp } from "fs";
import path from "path";
import prompts from "prompts";
import { fileURLToPath } from "url";

function deleteIfExists(filePath) {
	if (fs.existsSync(filePath)) {
		if (fs.lstatSync(filePath).isDirectory()) {
			fs.rmSync(filePath, { recursive: true, force: true });
		} else {
			fs.unlinkSync(filePath);
		}
	}
}

function cleanDir(dirPath) {
	if (fs.existsSync(dirPath)) {
		for (const file of fs.readdirSync(dirPath)) {
			const target = path.join(dirPath, file);
			if (fs.lstatSync(target).isDirectory()) {
				fs.rmSync(target, { recursive: true, force: true });
			} else {
				fs.unlinkSync(target);
			}
		}
	}
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CURRENT_DIR = process.cwd();
const TEMPLATES_DIR = path.join(__dirname, "../templates");

async function main() {
	const responses = await prompts([
		{
			type: "text",
			name: "projectName",
			message: "Enter your project name:",
		},
		{
			type: "select",
			name: "language",
			message: "Which language do you want to use?",
			choices: [
				{ title: "TypeScript", value: "ts" },
				{ title: "JavaScript", value: "js" },
			],
			initial: 0,
		},
		{
			type: "select",
			name: "cssFramework",
			message: "Which CSS framework do you want to use?",
			choices: [
				{ title: "Tailwind CSS", value: "tailwind" },
				{ title: "Bootstrap", value: "bootstrap" },
				{ title: "None", value: "none" },
			],
			initial: 0,
		},
		{
			type: "toggle",
			name: "installLucide",
			message: "Would you like to install lucide-react (icon library)?",
			initial: true,
			active: "yes",
			inactive: "no",
		},
		{
			type: "toggle",
			name: "installRouter",
			message: "Would you like to install react-router?",
			initial: true,
			active: "yes",
			inactive: "no",
		},
		{
			type: "toggle",
			name: "installRedux",
			message:
				"Would you like to install Redux Toolkit (and React Redux)?",
			initial: true,
			active: "yes",
			inactive: "no",
		},
		{
			type: "toggle",
			name: "gitInit",
			message: "Would you like to initialize a git repository?",
			initial: false,
			active: "yes",
			inactive: "no",
		},
	]);

	const projectName = responses.projectName?.trim() || "my-app";
	const projectPath = path.resolve(CURRENT_DIR, projectName);
	const language = responses.language;
	const viteTemplate = language === "ts" ? "react-ts" : "react";
	const ext = language === "ts" ? "tsx" : "jsx";
	const indexCssPath = path.join(process.cwd(), "src", "index.css");

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

	console.log(chalk.cyan("\n📦 Installing npm dependencies..."));
	await execa("npm", ["install"], { stdio: "inherit" });

	// Initialize a git repository
	if (responses.gitInit) {
		await execa("git", ["init"], { stdio: "inherit" });
		console.log(chalk.green("✔ Git repository initialized!"));
	}

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

	if (responses.cssFramework === "tailwind") {
		console.log(
			chalk.cyan(
				"\n🎨 Installing Tailwind CSS and @tailwindcss/vite plugin..."
			)
		);
		await execa("npm", ["install", "tailwindcss", "@tailwindcss/vite"], {
			stdio: "inherit",
		});

		const viteConfigFile = `vite.config.${language === "ts" ? "ts" : "js"}`;
		const viteConfigTarget = path.join(process.cwd(), viteConfigFile);
		const viteConfigContent = await fsp.readFile(
			path.join(TEMPLATES_DIR, "vite.config.template"),
			"utf8"
		);
		await fsp.writeFile(viteConfigTarget, viteConfigContent, "utf8");

		const indexCssContent = await fsp.readFile(
			path.join(TEMPLATES_DIR, "index.tailwind.template"),
			"utf8"
		);
		await fsp.writeFile(indexCssPath, indexCssContent, "utf-8");
	} else if (responses.cssFramework === "bootstrap") {
		console.log(chalk.cyan("\n🎨 Installing Bootstrap..."));
		await execa("npm", ["install", "bootstrap"], { stdio: "inherit" });

		const mainFileExt = language === "ts" ? "tsx" : "jsx";
		const mainFile = path.join(process.cwd(), "src", `main.${mainFileExt}`);
		if (fs.existsSync(mainFile)) {
			let mainFileContent = await fsp.readFile(mainFile, "utf8");
			if (
				!mainFileContent.includes(
					"bootstrap/dist/css/bootstrap.min.css"
				)
			) {
				mainFileContent =
					"import 'bootstrap/dist/css/bootstrap.min.css';\n" +
					mainFileContent;
				await fsp.writeFile(mainFile, mainFileContent, "utf8");
			}
		}
		if (fs.existsSync(indexCssPath)) {
			await fsp.writeFile(indexCssPath, "", "utf8");
		}
	} else if (responses.cssFramework === "none") {
		console.log(chalk.yellow("⚠️  No CSS framework will be installed."));
		if (fs.existsSync(indexCssPath)) {
			const indexCssContent = await fsp.readFile(
				path.join(TEMPLATES_DIR, "index.template"),
				"utf8"
			);
			await fsp.writeFile(indexCssPath, indexCssContent, "utf-8");
		}
	}

	deleteIfExists(path.join(process.cwd(), "src", "App.css"));

	const appMainFile = path.join(process.cwd(), "src", `App.${ext}`);
	const appTemplateContent = await fsp.readFile(
		path.join(
			TEMPLATES_DIR,
			responses.cssFramework === "bootstrap"
				? "App.bootstrap.template"
				: responses.cssFramework === "tailwind"
				? "App.tailwind.template"
				: "App.template"
		),
		"utf8"
	);
	if (fs.existsSync(appMainFile)) {
		await fsp.writeFile(appMainFile, appTemplateContent, "utf8");
	}

	cleanDir(path.join(process.cwd(), "public"));
	deleteIfExists(path.join(process.cwd(), "src", "assets"));

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

main().catch((e) => {
	console.error(chalk.red("❌ Error:"), e.message || e);
	process.exit(1);
});
