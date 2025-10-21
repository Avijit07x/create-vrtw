import {
	cancel,
	confirm,
	intro,
	isCancel,
	note,
	outro,
	select,
} from "@clack/prompts";
import { configExists, loadConfig, saveConfig } from "./fsHelpers.js";

export function onCancel() {
	console.log("\nOperation cancelled by user.");
	process.exit(1);
}

export async function getUserInputs(projectName) {
	intro("⚡ Create VRTW Setup");

	let oldConfig = {};
	let useOldConfig = false;

	if (await configExists()) {
		oldConfig = await loadConfig();
		oldConfig.projectName = projectName;

		const msg = `Previous setup found:
• Language: ${oldConfig.language || "N/A"}
• Quick Setup: ${oldConfig.quickSetup ? "Yes" : "No"}
• CSS Framework: ${oldConfig.cssFramework || "N/A"}
• State Mgmt: ${oldConfig.stateManagement || "none"}

How would you like to proceed?`;

		const useExisting = await select({
			message: msg,
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
		if (useOldConfig) {
			outro("Continuing with previous setup...");
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
