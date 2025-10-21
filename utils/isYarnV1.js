import { execaSync } from "execa";

export function isYarnV1() {
	try {
		const out = execaSync("yarn", ["-v"], { stdio: "pipe" }).stdout.trim();
		return out.startsWith("1.");
	} catch {
		return false;
	}
}
