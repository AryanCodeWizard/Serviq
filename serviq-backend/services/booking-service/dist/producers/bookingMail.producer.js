"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingMailMessage = void 0;
const rabbitMQ_config_1 = require("../config/rabbitMQ.config");
const sendBookingMailMessage = (data) => {
    const channel = (0, rabbitMQ_config_1.getRabbitMQChannel)();
    channel.publish(rabbitMQ_config_1.mail_exchange, rabbitMQ_config_1.mail_routing_key, Buffer.from(JSON.stringify(data)), { persistent: true });
};
exports.sendBookingMailMessage = sendBookingMailMessage;
