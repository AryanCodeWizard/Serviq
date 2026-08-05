"use strict";
// amqplib is official node js library for communication with RabbitMQ
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
exports.getRabbitMQChannel = exports.rabbitMQConnect = exports.profile_exchange = exports.mail_exchange = void 0;
// It allows you to:
// Connect to RabbitMQ
// Create channels
// Create exchanges
// Create queues
// Publish messages
// Consume messages
// Server Starts
//       │
//       ▼
// rabbitMQConnect()
//       │
//       ▼
// Connect to RabbitMQ
//       │
//       ▼
// Create Connection
//       │
//       ▼
// Create Channel
//       │
//       ▼
// Ensure Exchange Exists
//       │
//       ▼
// Application Ready
//       │
//       ▼
// Other Files
//       │
//       ▼
// getRabbitMQChannel()
//       │
//       ▼
// Publish / Consume Messages
const amqplib_1 = __importDefault(require("amqplib"));
let channel;
exports.mail_exchange = "mail_exchange";
exports.profile_exchange = "profile_exchange_name";
const rabbitMQConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib_1.default.connect("amqp://localhost");
        channel = yield connection.createChannel();
        yield channel.assertExchange(exports.mail_exchange, "direct", { durable: true });
        yield channel.assertExchange(exports.profile_exchange, "direct", { durable: true });
        console.log("RabbitMQ connection established successfully");
    }
    catch (error) {
        console.log("RabbitMQ connection failed", error);
    }
});
exports.rabbitMQConnect = rabbitMQConnect;
const getRabbitMQChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ channel not get");
    }
    return channel;
};
exports.getRabbitMQChannel = getRabbitMQChannel;
