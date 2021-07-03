import applyPolyfills from "../src/infrastructure/common/polyfills";
applyPolyfills();

import { bootstrapInfrastructure } from "../src/infrastructure";

export async function waitForMocks() {
	await bootstrapInfrastructure();
}
