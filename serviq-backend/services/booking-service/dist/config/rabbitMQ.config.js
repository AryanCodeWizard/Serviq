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
exports.getRabbitMQChannel = exports.rabbitMQConnect = exports.mail_routing_key = exports.mail_exchange = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
let channel;
exports.mail_exchange = "mail_exchange";
exports.mail_routing_key = "mail_routing";
const rabbitMQConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib_1.default.connect("amqp://localhost");
        channel = yield connection.createChannel();
        yield channel.assertExchange(exports.mail_exchange, "direct", { durable: true });
        console.log("Booking service RabbitMQ connection established successfully");
    }
    catch (error) {
        console.log("Booking service RabbitMQ connection failed", error);
    }
});
exports.rabbitMQConnect = rabbitMQConnect;
const getRabbitMQChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ channel not initialized");
    }
    return channel;
};
exports.getRabbitMQChannel = getRabbitMQChannel;
