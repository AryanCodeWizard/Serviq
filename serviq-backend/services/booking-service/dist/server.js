"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_config_1 = require("./config/db.config");
const rabbitMQ_config_1 = require("./config/rabbitMQ.config");
const PORT = process.env.PORT;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_config_1.dbConnect)();
    yield (0, rabbitMQ_config_1.rabbitMQConnect)();
    app_1.default.listen(PORT, () => {
        console.log(`Booking service is successfully running on PORT ${PORT}`);
    });
});
startServer();
