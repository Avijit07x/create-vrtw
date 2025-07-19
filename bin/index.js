#!/usr/bin/env node

import chalk from "chalk";
import { execa } from "execa";
import fs from "fs";
import path from "path";
import prompts from "prompts";

// Delete file or directory if exists
function deleteIfExists(filePath) {
	if (fs.existsSync(filePath)) {
		if (fs.lstatSync(filePath).isDirectory()) {
			fs.rmSync(filePath, { recursive: true, force: true });
		} else {
			fs.unlinkSync(filePath);
		}
	}
}

// Remove all contents of a directory
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
	// 1. Ask project name
	const response = await prompts({
		type: "text",
		name: "projectName",
		message: "Enter your project name:",
	});
	const projectName = response.projectName?.trim() || "my-app";

	// 2. Ask for JS or TS
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
	const projectPath = path.resolve(process.cwd(), projectName);

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

	// 4. Install initial dependencies
	console.log(chalk.cyan("\n📦 Installing npm dependencies..."));
	await execa("npm", ["install"], { stdio: "inherit" });

	// 5. Install Tailwind and Vite plugin
	console.log(
		chalk.cyan(
			"\n🎨 Installing Tailwind CSS and @tailwindcss/vite plugin..."
		)
	);
	await execa("npm", ["install", "tailwindcss", "@tailwindcss/vite"], {
		stdio: "inherit",
	});

	// 6. Overwrite vite.config.ts/js with Tailwind plugin usage
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

	// 7. Create/overwrite src/index.css with Tailwind directives
	const indexCss = path.join(process.cwd(), "src", "index.css");
	fs.writeFileSync(indexCss, "@import 'tailwindcss';\n", "utf-8");
	console.log(chalk.green("💡 src/index.css updated for Tailwind CSS!"));

	// 8. --- Extra cleanup ---

	// Delete src/App.css if exists
	const appCss = path.join(process.cwd(), "src", "App.css");
	deleteIfExists(appCss);
	console.log(chalk.green("🗑️  src/App.css removed (if existed)."));

	// Clean src/App.tsx or App.jsx to minimal code
	const ext = language === "ts" ? "tsx" : "jsx";
	const appMainFile = path.join(process.cwd(), "src", `App.${ext}`);
	if (fs.existsSync(appMainFile)) {
		const minimalComponent =
			language === "ts"
				? `function App() {
  return (
    <div className="min-h-screen flex bg-black text-white items-center justify-center text-2xl font-bold text-center">
      Hello Vite + React + TailwindCSS!
    </div>
  );
}

export default App;
`
				: `function App() {
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

	// Delete everything in public/
	const publicDir = path.join(process.cwd(), "public");
	cleanDir(publicDir);
	console.log(chalk.green("🧹 public/ directory cleaned."));

	// Delete src/assets/ if exists
	const assetsDir = path.join(process.cwd(), "src", "assets");
	deleteIfExists(assetsDir);
	console.log(chalk.green("🗑️  src/assets folder removed (if existed)."));

	// 9. Final message
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
