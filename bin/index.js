#!/usr/bin/env node

import chalk from "chalk";
import { execa } from "execa";
import fs from "fs";
import path from "path";
import prompts from "prompts";

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
	const projectPath = path.resolve(process.cwd(), projectName);
	const language = responses.language;
	const viteTemplate = language === "ts" ? "react-ts" : "react";
	const ext = language === "ts" ? "tsx" : "jsx";
	const installLucide = responses.installLucide;

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
	if (installLucide) {
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

	// Overwrite vite.config.ts/js
	const viteConfigPathTS = path.join(process.cwd(), "vite.config.ts");
	const viteConfigPathJS = path.join(process.cwd(), "vite.config.js");
	const viteConfigCode = `import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`;

	if (language === "ts") {
		fs.writeFileSync(viteConfigPathTS, viteConfigCode, "utf8");
		console.log(chalk.green("🔧 vite.config.ts updated for Tailwind v4!"));
	} else {
		fs.writeFileSync(viteConfigPathJS, viteConfigCode, "utf8");
		console.log(chalk.green("🔧 vite.config.js updated for Tailwind v4!"));
	}

	// Write Tailwind import to src/index.css
	const indexCss = path.join(process.cwd(), "src", "index.css");
	fs.writeFileSync(indexCss, "@import 'tailwindcss';\n", "utf-8");
	console.log(chalk.green("💡 src/index.css updated for Tailwind CSS!"));

	// --- Cleanup ---

	// Remove src/App.css if exists
	deleteIfExists(path.join(process.cwd(), "src", "App.css"));
	console.log(chalk.green("🗑️  src/App.css removed (if existed)."));

	// Overwrite src/App.jsx/tsx with minimal example
	const appMainFile = path.join(process.cwd(), "src", `App.${ext}`);
	if (fs.existsSync(appMainFile)) {
		const minimalComponent = `function App() {
  return (
    <div className="min-h-screen flex bg-black text-white items-center justify-center text-2xl font-bold text-center">
      Hello Vite + React + TailwindCSS!
    </div>
  );
}

export default App;
`;
		fs.writeFileSync(appMainFile, minimalComponent, "utf8");
		console.log(chalk.green(`✨ src/App.${ext} cleaned up!`));
	}

	// Clean public/ dir
	cleanDir(path.join(process.cwd(), "public"));
	console.log(chalk.green("🧹 public/ directory cleaned."));

	// Remove src/assets dir if exists
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
