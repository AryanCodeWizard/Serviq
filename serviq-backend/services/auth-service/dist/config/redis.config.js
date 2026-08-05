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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = exports.redisConnect = void 0;
const redis_1 = require("redis");
let client;
const redisConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    client = (0, redis_1.createClient)({
        username: 'default',
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: 19787
        }
    });
    client.on('error', err => console.log('Redis Client Error', err));
    yield client.connect();
    console.log("Auth service redis connected successfully");
});
exports.redisConnect = redisConnect;
const getRedisClient = () => {
    if (!client) {
        throw new Error("Redis Client not initialzed");
    }
    return client;
};
exports.getRedisClient = getRedisClient;
