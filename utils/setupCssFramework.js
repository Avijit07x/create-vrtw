import chalk from "chalk";
import { execa } from "execa";
import fs, { promises as fsp } from "fs";
import path from "path";
import { deleteIfExists } from "./fsHelpers.js";

export async function setupCssFramework({
	projectPath,
	TEMPLATES_DIR,
	language,
	cssFramework,
	indexCssPath,
	ext,
}) {
	process.chdir(projectPath);

	if (cssFramework === "tailwind") {
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
	} else if (cssFramework === "bootstrap") {
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
	} else if (cssFramework === "none") {
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
			cssFramework === "bootstrap"
				? "App.bootstrap.template"
				: cssFramework === "tailwind"
				? "App.tailwind.template"
				: "App.template"
		),
		"utf8"
	);
	if (fs.existsSync(appMainFile)) {
		await fsp.writeFile(appMainFile, appTemplateContent, "utf8");
	}
}
