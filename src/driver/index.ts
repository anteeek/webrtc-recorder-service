import { bootstrapInfrastructure } from "../infrastructure";
import bootstrapHttpServer from "./server";

export default async function bootstrapApp() {
    await bootstrapInfrastructure();
    await bootstrapHttpServer();
}

bootstrapApp();
