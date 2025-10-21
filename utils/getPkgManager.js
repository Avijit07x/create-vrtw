export function getPkgManager() {
	const ua = process.env.npm_config_user_agent || "";
	const execPath = process.env.npm_execpath || "";
	const argv0 = process.argv[1] || "";
	if (ua.startsWith("yarn")) return "yarn";
	if (ua.startsWith("pnpm")) return "pnpm";
	if (ua.startsWith("bun")) return "bun";
	if (execPath.includes("yarn")) return "yarn";
	if (execPath.includes("pnpm")) return "pnpm";
	if (execPath.includes("bun")) return "bun";
	if (argv0.includes("yarn")) return "yarn";
	if (argv0.includes("pnpm")) return "pnpm";
	if (argv0.includes("bun")) return "bun";
	return "npm";
}
