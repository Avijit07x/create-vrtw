import { access, readdir, readFile, rm, stat, unlink, writeFile } from "fs/promises";
import os from "os";
import path from "path";

const configPath = path.join(os.homedir(), ".vrtw-config.json");

export async function deleteIfExists(filePath) {
	try {
		await access(filePath);
		const stats = await stat(filePath);
		if (stats.isDirectory()) {
			await rm(filePath, { recursive: true, force: true });
		} else {
			await unlink(filePath);
		}
	} catch (err) {
		// File doesn't exist, skip silently
	}
}

export async function cleanDir(dirPath) {
	try {
		await access(dirPath);
		const files = await readdir(dirPath);
		for (const file of files) {
			const target = path.join(dirPath, file);
			const stats = await stat(target);

			if (stats.isDirectory()) {
				await rm(target, { recursive: true, force: true });
			} else {
				await unlink(target);
			}
		}
	} catch (err) {
		// Folder doesn't exist, skip silently
	}
}

export async function loadConfig() {
	try {
		const content = await readFile(configPath, "utf-8");
		return JSON.parse(content);
	} catch (err) {
		return {};
	}
}

export async function saveConfig(data) {
	await writeFile(configPath, JSON.stringify(data, null, 2), "utf-8");
}
