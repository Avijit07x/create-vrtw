import { isCancel, select } from "@clack/prompts";
import { access, mkdir, readdir, rm } from "fs/promises";
import path from "path";
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

	const remove = await select({
		message: `Folder "${
			projectName || "."
		}" already exists and is not empty. How do you want to proceed?`,
		options: [
			{ label: "Delete all files and continue", value: true },
			{ label: "Cancel setup", value: false },
		],
		initialValue: true,
	});

	if (isCancel(remove) || !remove) {
		onCancel();
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
	return targetPath;
}
