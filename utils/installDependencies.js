import { installDeps } from "./installDeps.js";
import { isYarnV1 } from "./isYarnV1.js";

export async function installAdditionalDeps(responses, pkg, useYarn) {
	const additionalDeps = [];

	if (responses.installReactIcons) additionalDeps.push("react-icons");
	if (responses.installRouter) additionalDeps.push("react-router-dom");
	if (responses.stateManagement === "redux") {
		additionalDeps.push("@reduxjs/toolkit", "react-redux");
	} else if (responses.stateManagement === "zustand") {
		additionalDeps.push("zustand");
	}
	if (responses.installAxios) additionalDeps.push("axios");
	additionalDeps.push("react", "react-dom");
	if (useYarn && isYarnV1()) {
		additionalDeps.push("vite");
	} else {
		additionalDeps.push("vite@latest");
	}

	if (additionalDeps.length) {
		await installDeps(pkg, false, ...additionalDeps);
	}
}
