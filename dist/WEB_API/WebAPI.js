"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAPI = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const AuthModule_1 = require("./AuthModule");
const LoggerManager_1 = require("../Logger/LoggerManager");
const node_util_1 = __importDefault(require("node:util"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = require("node:path");
const loadConfig_1 = require("../Helper/loadConfig");
const readdir = node_util_1.default.promisify(node_fs_1.default.readdir);
const startAPI = async () => {
    // start/config API web
    const app = (0, express_1.default)();
    // Chargement des variables d'environnement
    (0, loadConfig_1.loadConfig)();
    const port = process?.env?.API_PORT;
    if (!port) {
        throw new Error("Le port de l'API n'est pas défini dans le fichier .env");
    }
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(AuthModule_1.isAuth);
    const path_str = (0, node_path_1.join)(__dirname, "Routes");
    const routes = (await readdir(path_str)).filter(route => route.endsWith(".js"));
    for (let route of routes) {
        require((0, node_path_1.join)(path_str, route))(app);
    }
    app.listen(port, () => {
        LoggerManager_1.logger.info(`⚡️ Server is running on port ${port}`);
    });
};
exports.startAPI = startAPI;
