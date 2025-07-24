import prompts from "prompts";
import { loadConfig, saveConfig } from "./fsHelpers.js";

export async function getUserInputs() {
	const defaults = await loadConfig();

	const initialResponses = await prompts([
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
			initial: defaults.language === "js" ? 1 : 0,
		},
		{
			type: "toggle",
			name: "quickSetup",
			message:
				"Quick Setup? (React + Tailwind CSS + Lucide + React Router + Axios)",
			initial: defaults.quickSetup ?? true,
			active: "yes",
			inactive: "no",
		},
	]);

	const moreResponses = await prompts([
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
			name: "installLucide",
			message: "Would you like to install lucide-react (icon library)?",
			initial: defaults.installLucide ?? true,
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
			message: "Which state management library do you want to install?",
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
	]);

	const responses = {
		...initialResponses,
		...moreResponses,
	};

	if (responses.quickSetup) {
		responses.cssFramework = "tailwind";
		responses.installLucide = true;
		responses.installRouter = true;
		responses.installAxios = true;
	}
	if (responses.projectName) {
		await saveConfig({
			language: responses.language,
			cssFramework: responses.cssFramework,
			installLucide: responses.installLucide,
			installRouter: responses.installRouter,
			installAxios: responses.installAxios,
			stateManagement: responses.stateManagement,
			gitInit: responses.gitInit,
			quickSetup: responses.quickSetup,
		});
	}

	return responses;
}
