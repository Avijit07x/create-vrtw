import { execa } from "execa";
import open from "open";

export async function openDevServerAndLaunchBrowser(cwd) {
	const devProcess = execa("npm", ["run", "dev"], { cwd });
	let browserOpened = false;

	devProcess.stdout?.on("data", (data) => {
		const text = data.toString();
		process.stdout.write(text);

		const match = text.match(/Local:\s*(http:\/\/localhost:\d+)/);
		if (match && !browserOpened) {
			open(match[1]);
			browserOpened = true;
		}
	});

	devProcess.stderr?.on("data", (data) => {
		process.stderr.write(data.toString());
	});

	await devProcess;
}
