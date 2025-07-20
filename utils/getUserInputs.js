import prompts from "prompts";

export async function getUserInputs() {
	return await prompts([
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
			type: "select",
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
		{
			type: "toggle",
			name: "gitInit",
			message: "Would you like to initialize a git repository?",
			initial: false,
			active: "yes",
			inactive: "no",
		},
	]);
}
