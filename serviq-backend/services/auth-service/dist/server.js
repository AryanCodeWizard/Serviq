"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_1 = require("./config/db.config");
dotenv_1.default.config();
const PORT = process.env.PORT;
(0, db_config_1.dbConnect)();
app_1.default.listen(PORT, () => {
    console.log(`Auth Service is successfully listening on PORT ${PORT}`);
});
