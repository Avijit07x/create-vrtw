import {
	cancel,
	confirm,
	isCancel,
	note,
	select,
	spinner,
} from "@clack/prompts";
import chalk from "chalk";
import { configExists, loadConfig, saveConfig } from "./fsHelpers.js";

export function onCancel() {
	console.log("\nOperation cancelled by user.");
	process.exit(1);
}

export async function getUserInputs(projectName) {
	let oldConfig = {};
	let useOldConfig = false;

	if (await configExists()) {
		oldConfig = await loadConfig();
		oldConfig.projectName = projectName;

		const lang = oldConfig.language === "ts" ? "TypeScript" : "JavaScript";
		const quickSetup =
			"React + Tailwind CSS + React Icons + React Router + Axios";

		const cssFramework =
			oldConfig.cssFramework === "none"
				? "No CSS Framework"
				: oldConfig.cssFramework
				? oldConfig.cssFramework.charAt(0).toUpperCase() +
				  oldConfig.cssFramework.slice(1)
				: "N/A";
		const stateManagement =
			oldConfig.stateManagement === "redux"
				? "Redux Toolkit"
				: oldConfig.stateManagement === "zustand"
				? "Zustand"
				: "None";

		note(
			`Previous setup found with the following configuration:

• ${chalk.bold("Language:")} ${chalk.green(lang || "N/A")}
• ${chalk.bold("Quick Setup:")} ${
				oldConfig.quickSetup ? chalk.green(quickSetup) : chalk.red("No")
			}
• ${chalk.bold("CSS Framework:")} ${chalk.yellow(cssFramework || "N/A")}
• ${chalk.bold("State Management:")} ${chalk.magenta(stateManagement || "None")}
`,
			"Previous Configuration"
		);

		const useExisting = await select({
			message: "How would you like to proceed?",
			options: [
				{ value: true, label: "Continue with previous setup" },
				{ value: false, label: "Start fresh (new setup)" },
			],
			initialValue: true,
		});

		if (isCancel(useExisting)) {
			cancel("Operation cancelled.");
			process.exit(1);
		}

		useOldConfig = useExisting;
		const previousSpin = spinner();
		if (useOldConfig) {
			previousSpin.start("Loading previous setup...");
			previousSpin.stop(chalk.green("Previous setup loaded."));
			return { ...oldConfig, projectName };
		}
	}

	const defaults = { ...oldConfig, projectName };

	const language = await select({
		message: "Which language do you want to use?",
		options: [
			{ label: "TypeScript", value: "ts" },
			{ label: "JavaScript", value: "js" },
		],
		initialValue: defaults.language === "js" ? "js" : "ts",
	});
	if (isCancel(language)) onCancel();

	const quickSetup = await confirm({
		message:
			"Quick Setup? (React + Tailwind CSS + React Icons + React Router + Axios)",
		initialValue: defaults.quickSetup ?? true,
	});
	if (isCancel(quickSetup)) onCancel();

	let cssFramework = "tailwind";
	let installReactIcons = true;
	let installRouter = true;
	let installAxios = true;
	let stateManagement = "none";
	let gitInit = false;

	if (!quickSetup) {
		cssFramework = await select({
			message: "Which CSS framework do you want to use?",
			options: [
				{ label: "Tailwind CSS", value: "tailwind" },
				{ label: "Bootstrap", value: "bootstrap" },
				{ label: "None", value: "none" },
			],
			initialValue: defaults.cssFramework || "tailwind",
		});
		if (isCancel(cssFramework)) onCancel();

		installReactIcons = await confirm({
			message: "Would you like to install react-icons?",
			initialValue: defaults.installReactIcons ?? true,
		});
		if (isCancel(installReactIcons)) onCancel();

		installRouter = await confirm({
			message: "Would you like to install react-router?",
			initialValue: defaults.installRouter ?? true,
		});
		if (isCancel(installRouter)) onCancel();

		stateManagement = await select({
			message: "Which state management library do you want to use?",
			options: [
				{ label: "None", value: "none" },
				{ label: "Redux Toolkit", value: "redux" },
				{ label: "Zustand", value: "zustand" },
			],
			initialValue: defaults.stateManagement || "none",
		});
		if (isCancel(stateManagement)) onCancel();

		installAxios = await confirm({
			message: "Would you like to install axios?",
			initialValue: defaults.installAxios ?? true,
		});
		if (isCancel(installAxios)) onCancel();

		gitInit = await confirm({
			message: "Would you like to initialize a git repository?",
			initialValue: defaults.gitInit ?? false,
		});
		if (isCancel(gitInit)) onCancel();
	}

	const responses = {
		projectName,
		language,
		quickSetup,
		cssFramework,
		installReactIcons,
		installRouter,
		installAxios,
		stateManagement,
		gitInit,
	};

	if (quickSetup) {
		Object.assign(responses, {
			cssFramework: "tailwind",
			installReactIcons: true,
			installRouter: true,
			installAxios: true,
		});
	}

	await saveConfig(responses);

	note("Configuration saved for next time.", "Saved");
	return responses;
}
