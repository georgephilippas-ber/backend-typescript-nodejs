"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentCreate = void 0;
const class_validator_1 = require("class-validator");
const utilities_1 = require("../../../fundamental/utilities/utilities");
class AgentCreate {
    static validate(agentCreate) {
        const criteria = [(0, class_validator_1.isArray)(agentCreate.credentials), (0, utilities_1.isBetween)(agentCreate.credentials.length, 3, 4), agentCreate.credentials.every(value => value), (0, class_validator_1.isEmail)(agentCreate.credentials[1])];
        return criteria.every(value => value);
    }
}
exports.AgentCreate = AgentCreate;
