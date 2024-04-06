import { config } from "dotenv";
import { join } from "node:path";

/**
 * Load the configuration file (.env) from the root of the project.
 */
export function loadConfig() {
    config({ path: join(__dirname, '../../.env') });
}