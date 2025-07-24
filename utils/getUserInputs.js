import prompts from "prompts";

export async function getUserInputs() {
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
			initial: 0,
		},
		{
			type: "toggle",
			name: "quickSetup",
			message:
				"Quick Setup? (React + Tailwind CSS + Lucide + React Router + Axios)",
			initial: true,
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
			initial: 0,
		},
		{
			type: initialResponses.quickSetup ? null : "toggle",
			name: "installLucide",
			message: "Would you like to install lucide-react (icon library)?",
			initial: true,
			active: "yes",
			inactive: "no",
		},
		{
			type: initialResponses.quickSetup ? null : "toggle",
			name: "installRouter",
			message: "Would you like to install react-router?",
			initial: true,
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
			initial: 0,
		},

		{
			type: initialResponses.quickSetup ? null : "toggle",
			name: "installAxios",
			message: "Would you like to install axios?",
			initial: initialResponses.quickSetup ? true : false,
			active: "yes",
			inactive: "no",
		},
		{
			type: "toggle",
			name: "gitInit",
			message: "Would you like to initialize a git repository?",
			initial: false,
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

	return responses;
}
