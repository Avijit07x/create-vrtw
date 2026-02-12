import { installDeps } from "./installDeps.js";

export async function installAdditionalDeps(responses, pkg) {
	const additionalDeps = [];

	if (responses.iconLibrary === "lucide") {
		additionalDeps.push("lucide-react");
	} else if (responses.iconLibrary === "huge") {
		additionalDeps.push("@hugeicons/react");
		additionalDeps.push("@hugeicons/core-free-icons");
	}

	if (responses.installRouter) additionalDeps.push("react-router-dom");
	if (responses.stateManagement === "redux") {
		additionalDeps.push("@reduxjs/toolkit", "react-redux");
	} else if (responses.stateManagement === "zustand") {
		additionalDeps.push("zustand");
	}
	if (responses.installAxios) additionalDeps.push("axios");
	additionalDeps.push("react", "react-dom");

	if (additionalDeps.length) {
		await installDeps(pkg, false, ...additionalDeps);
	}
}
