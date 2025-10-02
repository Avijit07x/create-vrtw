import { access, mkdir, readdir, rm } from "fs/promises";
import path from "path";
import prompts from "prompts";
import { onCancel } from "./getUserInputs.js";

export async function confirmEmptyFolder(projectName) {
	const cwd = process.cwd();
	const targetPath = path.resolve(cwd, projectName || "");

	try {
		await access(targetPath);
	} catch {
		return targetPath;
	}

	const files = await readdir(targetPath);
	if (files.length === 0) return targetPath;

	const { remove } = await prompts(
		{
			type: "select",
			name: "remove",
			message: `Folder "${
				projectName || "."
			}" already exists and is not empty. How do you want to proceed?`,
			choices: [
				{ title: "Delete all files and continue", value: true },
				{ title: "Cancel setup", value: false },
			],
			initial: 0,
		},
		{ onCancel }
	);

	if (!remove) {
		console.log("Setup cancelled.");
		process.exit(1);
	}

	if (targetPath === cwd) {
		const inside = await readdir(targetPath);
		await Promise.all(
			inside.map((name) =>
				rm(path.join(targetPath, name), {
					recursive: true,
					force: true,
				})
			)
		);
	} else {
		await rm(targetPath, { recursive: true, force: true });
		await mkdir(targetPath);
	}

	console.log(`Cleared existing folder: ${projectName || "."}`);
	return targetPath;
}
