import cors from 'cors';
import express, { Express } from 'express';
import { isAuth } from './AuthModule';
import { logger } from "../Logger/LoggerManager";
import util from "node:util";
import fs from "node:fs";
import { join } from "node:path";
import { loadConfig } from "../Helper/loadConfig";
const readdir = util.promisify(fs.readdir);

/**
 * Loads all the routes and starts the web API.
 */
export const startWebApi = async () => {
    const app: Express = express();
    
    loadConfig();

    const port = process?.env?.API_PORT;
    if (!port) {
        throw new Error("Le port de l'API n'est pas défini dans le fichier .env");
    }

    app.use(cors());
    app.use(express.json());
    app.use(isAuth);

    const path_str = join(__dirname, "Routes");
    const routes = (await readdir(path_str)).filter(
        route =>
            route.endsWith(".js")
    );

    for (let route of routes) {
        require(join(path_str, route))(app);
    }

    app.listen(port, () => {
        logger.info(`⚡️ Server is running on port ${port}`);
    });
}

