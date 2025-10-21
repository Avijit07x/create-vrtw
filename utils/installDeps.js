import { execa } from "execa";

export async function installDeps(pkgManager, dev, ...packages) {
	let cmd, args;
	switch (pkgManager) {
		case "pnpm":
			cmd = "pnpm";
			args = dev ? ["add", "-D", ...packages] : ["add", ...packages];
			break;
		case "yarn":
			cmd = "yarn";
			args = dev ? ["add", "-D", ...packages] : ["add", ...packages];
			break;
		case "bun":
			cmd = "bun";
			args = dev ? ["add", "-d", ...packages] : ["add", ...packages];
			break;
		default:
			cmd = "npm";
			args = dev
				? ["install", "-D", ...packages]
				: ["install", ...packages];
	}
	await execa(cmd, args, { stdio: "pipe" });
}
