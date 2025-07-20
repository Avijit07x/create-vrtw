#!/usr/bin/env node

import chalk from "chalk";
import { execa } from "execa";
import fs from "fs";
import path from "path";
import prompts from "prompts";
import { fileURLToPath } from "url";

/**
 * Delete a file or directory if it exists.
 */
function deleteIfExists(filePath) {
	if (fs.existsSync(filePath)) {
		if (fs.lstatSync(filePath).isDirectory()) {
			fs.rmSync(filePath, { recursive: true, force: true });
		} else {
			fs.unlinkSync(filePath);
		}
	}
}

/**
 * Remove all contents of a directory, but not the directory itself.
 */
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

// Path to your templates directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CURRENT_DIR = process.cwd();
const TEMPLATES_DIR = path.join(__dirname, "../templates");

async function main() {
	// All user prompts up front
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
	]);

	const projectName = responses.projectName?.trim() || "my-app";
	const projectPath = path.resolve(CURRENT_DIR, projectName);
	const language = responses.language;
	const viteTemplate = language === "ts" ? "react-ts" : "react";
	const ext = language === "ts" ? "tsx" : "jsx";

	// Scaffold Vite project
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

	// Install npm dependencies for Vite project
	console.log(chalk.cyan("\n📦 Installing npm dependencies..."));
	await execa("npm", ["install"], { stdio: "inherit" });

	// Install lucide-react if requested
	if (responses.installLucide) {
		console.log(chalk.cyan("\n🔗 Installing lucide-react..."));
		await execa("npm", ["install", "lucide-react"], { stdio: "inherit" });
		console.log(chalk.green("✨ lucide-react installed!"));
	}
	// install react-router if requested
	if (responses.installRouter) {
		console.log(chalk.cyan("\n🔗 Installing react-router..."));
		await execa("npm", ["install", "react-router"], { stdio: "inherit" });
		console.log(chalk.green("✨ react-router installed!"));
	}
	// install Redux Toolkit and React Redux if requested
	if (responses.installRedux) {
		console.log(
			chalk.cyan("\n🔗 Installing @reduxjs/toolkit and react-redux...")
		);
		await execa("npm", ["install", "@reduxjs/toolkit", "react-redux"], {
			stdio: "inherit",
		});
		console.log(
			chalk.green("✨ @reduxjs/toolkit and react-redux installed!")
		);
	}

	// Install Tailwind CSS and Vite plugin
	console.log(
		chalk.cyan(
			"\n🎨 Installing Tailwind CSS and @tailwindcss/vite plugin..."
		)
	);
	await execa("npm", ["install", "tailwindcss", "@tailwindcss/vite"], {
		stdio: "inherit",
	});

	// Write vite.config
	const viteConfigFile = `vite.config.${language === "ts" ? "ts" : "js"}`;
	const viteConfigTarget = path.join(process.cwd(), viteConfigFile);
	const viteConfigContent = fs.readFileSync(
		path.join(TEMPLATES_DIR, "vite.config.template"),
		"utf8"
	);
	fs.writeFileSync(viteConfigTarget, viteConfigContent, "utf8");
	console.log(chalk.green(`🔧 ${viteConfigFile} updated for Tailwind v4!`));

	// Write src/index.css from template
	const indexCssTarget = path.join(process.cwd(), "src", "index.css");
	const indexCssContent = fs.readFileSync(
		path.join(TEMPLATES_DIR, "index.template"),
		"utf8"
	);
	fs.writeFileSync(indexCssTarget, indexCssContent, "utf-8");
	console.log(chalk.green("💡 src/index.css updated for Tailwind CSS!"));

	// Cleanup: Remove unnecessary files/assets
	deleteIfExists(path.join(process.cwd(), "src", "App.css"));
	console.log(chalk.green("🗑️  src/App.css removed (if existed)."));

	// Overwrite src/App.jsx/tsx from template
	const appMainFile = path.join(process.cwd(), "src", `App.${ext}`);
	const appTemplateContent = fs.readFileSync(
		path.join(TEMPLATES_DIR, "App.template"),
		"utf8"
	);
	if (fs.existsSync(appMainFile)) {
		fs.writeFileSync(appMainFile, appTemplateContent, "utf8");
		console.log(chalk.green(`✨ src/App.${ext} cleaned up!`));
	}

	// Clean public directory
	cleanDir(path.join(process.cwd(), "public"));
	console.log(chalk.green("🧹 public/ directory cleaned."));

	// Remove src/assets directory if exists
	deleteIfExists(path.join(process.cwd(), "src", "assets"));
	console.log(chalk.green("🗑️  src/assets folder removed (if existed)."));

	//  Finish up
	console.log(chalk.greenBright.bold("\n🎉 Project setup complete! 🚀\n"));
	console.log(chalk.yellowBright("Next steps:"));
	console.log(chalk.yellow(`  cd ${projectName}`));
	console.log(chalk.yellow("  npm run dev\n"));
	console.log(chalk.gray("Useful docs:"));
	console.log(
		chalk.gray("- Tailwind CSS: https://tailwindcss.com/docs/installation")
	);
}

main().catch((e) => {
	console.error(chalk.red("❌ Error:"), e.message || e);
	process.exit(1);
});
