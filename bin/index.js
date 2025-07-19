#!/usr/bin/env node

import chalk from "chalk";
import { execa } from "execa";
import fs from "fs";
import path from "path";
import prompts from "prompts";

/**
 * Delete file or directory if it exists.
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
	// 1. Prompt for project name
	const { projectName: rawProjectName } = await prompts({
		type: "text",
		name: "projectName",
		message: "Enter your project name:",
	});
	const projectName = rawProjectName?.trim() || "my-app";
	const projectPath = path.resolve(process.cwd(), projectName);

	// 2. Prompt for project language
	const { language } = await prompts({
		type: "select",
		name: "language",
		message: "Which language do you want to use?",
		choices: [
			{ title: "TypeScript", value: "ts" },
			{ title: "JavaScript", value: "js" },
		],
		initial: 0,
	});
	const viteTemplate = language === "ts" ? "react-ts" : "react";
	const ext = language === "ts" ? "tsx" : "jsx";

	// 3. Scaffold Vite project
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

	// 4. Install initial dependencies (for Vite project)
	console.log(chalk.cyan("\n📦 Installing npm dependencies..."));
	await execa("npm", ["install"], { stdio: "inherit" });

	// 5. Optionally install lucide-react (icon library)
	const { installLucide } = await prompts({
		type: "toggle",
		name: "installLucide",
		message: "Would you like to install lucide-react (icon library)?",
		initial: false,
		active: "yes",
		inactive: "no",
	});
	if (installLucide) {
		console.log(chalk.cyan("\n🔗 Installing lucide-react..."));
		await execa("npm", ["install", "lucide-react"], { stdio: "inherit" });
		console.log(chalk.green("✨ lucide-react installed!"));
	}

	// 6. Install TailwindCSS v4 and Vite plugin
	console.log(
		chalk.cyan(
			"\n🎨 Installing Tailwind CSS and @tailwindcss/vite plugin..."
		)
	);
	await execa("npm", ["install", "tailwindcss", "@tailwindcss/vite"], {
		stdio: "inherit",
	});

	// 7. Overwrite vite.config.ts/js with Tailwind + plugin setup
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

	// 8. Overwrite src/index.css with Tailwind directive
	const indexCss = path.join(process.cwd(), "src", "index.css");
	fs.writeFileSync(indexCss, "@import 'tailwindcss';\n", "utf-8");
	console.log(chalk.green("💡 src/index.css updated for Tailwind CSS!"));

	// 9. --- Project cleanup ---

	// Remove src/App.css if exists
	const appCss = path.join(process.cwd(), "src", "App.css");
	deleteIfExists(appCss);
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

	// Empty public/ dir
	const publicDir = path.join(process.cwd(), "public");
	cleanDir(publicDir);
	console.log(chalk.green("🧹 public/ directory cleaned."));

	// Remove src/assets dir if exists
	const assetsDir = path.join(process.cwd(), "src", "assets");
	deleteIfExists(assetsDir);
	console.log(chalk.green("🗑️  src/assets folder removed (if existed)."));

	// 10. Success message
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