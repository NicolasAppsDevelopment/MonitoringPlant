import { config } from "dotenv";
import { join } from "node:path";

export function loadConfig() {
    config({ path: join(__dirname, '../../.env') });
}