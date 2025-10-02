import prompts from "prompts";
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

		const { useExisting } = await prompts(
			{
				type: "select",
				name: "useExisting",
				message:
					`Previous setup found: ` +
					`Language: ${oldConfig.language || "N/A"} | ` +
					`Quick Setup: ${oldConfig.quickSetup ? "Yes" : "No"} | ` +
					`CSS Framework: ${oldConfig.cssFramework || "N/A"} | ` +
					`State Mgmt: ${oldConfig.stateManagement || "none"}\n\n` +
					`How would you like to proceed?`,
				choices: [
					{ title: "Continue with previous setup", value: true },
					{ title: "Start fresh (new setup)", value: false },
				],
				initial: 0,
			},
			{ onCancel }
		);

		useOldConfig = useExisting;
		if (useOldConfig) return { ...oldConfig, projectName };
	}

	const defaults = { ...oldConfig, projectName };

	const initialResponses = await prompts(
		[
			{
				type: "select",
				name: "language",
				message: "Which language do you want to use?",
				choices: [
					{ title: "TypeScript", value: "ts" },
					{ title: "JavaScript", value: "js" },
				],
				initial: defaults.language === "js" ? 1 : 0,
			},
			{
				type: "toggle",
				name: "quickSetup",
				message:
					"Quick Setup? (React + Tailwind CSS + React Icons + React Router + Axios)",
				initial: defaults.quickSetup ?? true,
				active: "yes",
				inactive: "no",
			},
		],
		{ onCancel }
	);

	const moreResponses = await prompts(
		[
			{
				type: initialResponses.quickSetup ? null : "select",
				name: "cssFramework",
				message: "Which CSS framework do you want to use?",
				choices: [
					{ title: "Tailwind CSS", value: "tailwind" },
					{ title: "Bootstrap", value: "bootstrap" },
					{ title: "None", value: "none" },
				],
				initial: ["tailwind", "bootstrap", "none"].indexOf(
					defaults.cssFramework || "tailwind"
				),
			},
			{
				type: initialResponses.quickSetup ? null : "toggle",
				name: "installReactIcons",
				message:
					"Would you like to install react-icons (icon library)?",
				initial: defaults.installReactIcons ?? true,
				active: "yes",
				inactive: "no",
			},
			{
				type: initialResponses.quickSetup ? null : "toggle",
				name: "installRouter",
				message: "Would you like to install react-router?",
				initial: defaults.installRouter ?? true,
				active: "yes",
				inactive: "no",
			},
			{
				type: "select",
				name: "stateManagement",
				message:
					"Which state management library do you want to install?",
				choices: [
					{ title: "None", value: "none" },
					{ title: "Redux Toolkit", value: "redux" },
					{ title: "Zustand", value: "zustand" },
				],
				initial: ["none", "redux", "zustand"].indexOf(
					defaults.stateManagement || "none"
				),
			},
			{
				type: initialResponses.quickSetup ? null : "toggle",
				name: "installAxios",
				message: "Would you like to install axios?",
				initial: defaults.installAxios ?? true,
				active: "yes",
				inactive: "no",
			},
			{
				type: "toggle",
				name: "gitInit",
				message: "Would you like to initialize a git repository?",
				initial: defaults.gitInit ?? false,
				active: "yes",
				inactive: "no",
			},
		],
		{ onCancel }
	);

	const responses = { projectName, ...initialResponses, ...moreResponses };

	if (responses.quickSetup) {
		Object.assign(responses, {
			cssFramework: "tailwind",
			installReactIcons: true,
			installRouter: true,
			installAxios: true,
		});
	}

	await saveConfig(responses);
	return responses;
}
