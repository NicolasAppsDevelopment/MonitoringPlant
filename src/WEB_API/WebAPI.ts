import cors from 'cors';
import express, { Express } from 'express';
import { isAuth } from './AuthModule';
import { logger } from "../Logger/LoggerManager";
import util from "node:util";
import fs from "node:fs";
import { join } from "node:path";
const readdir = util.promisify(fs.readdir);

export const startAPI = async () => {
    // start/config API web
    const app: Express = express();
    const port = process.env.API_PORT;
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
        logger.info(`⚡️ Server is running at http://localhost:${port}`);
    });
}

