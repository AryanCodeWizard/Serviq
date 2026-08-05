"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendProfileMaessage = void 0;
const rabbitMQ_config_1 = require("../config/rabbitMQ.config");
// let channel;
const sendProfileMaessage = (data) => {
    const channel = (0, rabbitMQ_config_1.getRabbitMQChannel)();
    channel.publish(rabbitMQ_config_1.profile_exchange, "profile_routing_key", Buffer.from(JSON.stringify(data)));
};
exports.sendProfileMaessage = sendProfileMaessage;
