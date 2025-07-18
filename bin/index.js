#!/usr/bin/env node

import chalk from "chalk";
import { execa } from "execa";
import fs from "fs";
import path from "path";
import prompts from "prompts";

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

async function main() {
	// 1. Ask for project name
	const response = await prompts({
		type: "text",
		name: "projectName",
		message: "Enter your project name:",
	});

	const projectName = response.projectName?.trim() || "my-app";
	const projectPath = path.resolve(process.cwd(), projectName);

	// 2. Scaffold Vite project
	console.log(
		chalk.cyan("\n🛠️  Creating Vite React + TypeScript project...")
	);
	await execa(
		"npm",
		["create", "vite@latest", projectName, "--", "--template", "react-ts"],
		{ stdio: "inherit" }
	);

	process.chdir(projectPath);

	// 3. Install initial dependencies
	console.log(chalk.cyan("\n📦 Installing npm dependencies..."));
	await execa("npm", ["install"], { stdio: "inherit" });

	// 4. Install Tailwind and Vite plugin
	console.log(
		chalk.cyan(
			"\n🎨 Installing Tailwind CSS and @tailwindcss/vite plugin..."
		)
	);
	await execa("npm", ["install", "tailwindcss", "@tailwindcss/vite"], {
		stdio: "inherit",
	});

	// 5. Overwrite vite.config.ts with Tailwind plugin usage
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
	if (fs.existsSync(viteConfigPathTS)) {
		fs.writeFileSync(viteConfigPathTS, viteConfigCode, "utf8");
		console.log(chalk.green("🔧 vite.config.ts updated for Tailwind v4!"));
	} else if (fs.existsSync(viteConfigPathJS)) {
		fs.writeFileSync(viteConfigPathJS, viteConfigCode, "utf8");
		console.log(chalk.green("🔧 vite.config.js updated for Tailwind v4!"));
	} else {
		fs.writeFileSync(viteConfigPathTS, viteConfigCode, "utf8");
		console.log(chalk.green("🆕 vite.config.ts created for Tailwind v4!"));
	}

	// 6. Create/overwrite src/index.css with Tailwind directives
	const indexCss = path.join(process.cwd(), "src", "index.css");
	fs.writeFileSync(indexCss, "@import 'tailwindcss';\n", "utf-8");
	console.log(chalk.green("💡 src/index.css updated for Tailwind CSS!"));

	// 7. --- Extra cleanup as requested ---

	// Delete src/App.css if exists
	const appCss = path.join(process.cwd(), "src", "App.css");
	deleteIfExists(appCss);
	console.log(chalk.green("🗑️  src/App.css removed (if existed)."));

	// Clean src/App.tsx with minimal component
	const appTsx = path.join(process.cwd(), "src", "App.tsx");
	if (fs.existsSync(appTsx)) {
		const minimalComponent = `function App() {
  return (
    <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-center">
      Hello Vite + React + TailwindCSS!
    </div>
  );
}

export default App;
`;
		fs.writeFileSync(appTsx, minimalComponent, "utf8");
		console.log(chalk.green("✨ src/App.tsx cleaned up!"));
	}

	// Delete everything in public/
	const publicDir = path.join(process.cwd(), "public");
	cleanDir(publicDir);
	console.log(chalk.green("🧹 public/ directory cleaned."));

	// Delete src/assets/ if exists
	const assetsDir = path.join(process.cwd(), "src", "assets");
	deleteIfExists(assetsDir);
	console.log(chalk.green("🗑️  src/assets folder removed (if existed)."));

	// 8. Final message
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
