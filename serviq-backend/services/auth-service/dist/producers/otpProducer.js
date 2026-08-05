"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpMessage = void 0;
const rabbitMQ_config_1 = require("../config/rabbitMQ.config");
const sendOtpMessage = (data) => {
    const channel = (0, rabbitMQ_config_1.getRabbitMQChannel)();
    const published = channel.publish(rabbitMQ_config_1.mail_exchange, "mail_routing", Buffer.from(JSON.stringify(data)));
    console.log("Message published:", published);
};
exports.sendOtpMessage = sendOtpMessage;
