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
exports.AgentsManager = void 0;
const data_transfer_object_1 = require("./data-transfer-object/data-transfer-object");
const encryption_1 = require("../../fundamental/encryption/encryption");
const class_validator_1 = require("class-validator");
const crypto_1 = require("crypto");
class AgentsManager {
    constructor(dataProvider) {
        this.dataProvider = dataProvider;
    }
    create(agentCreate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data_transfer_object_1.AgentCreate.validate(agentCreate))
                return undefined;
            switch (agentCreate.credentials.length) {
                case 3:
                case 4:
                    const candidateAgent = {
                        username: agentCreate.credentials[0],
                        email: agentCreate.credentials[1],
                        password: yield encryption_1.Encryption.hashPassword_generateSalt(agentCreate.credentials[2]),
                    };
                    if (agentCreate.credentials[3])
                        candidateAgent.passkey = encryption_1.Encryption.hashPasskey(agentCreate.credentials[3]);
                    return this.dataProvider.fromPrisma().agent.create({
                        data: candidateAgent
                    });
                default:
                    return undefined;
            }
        });
    }
    byAssociation(association) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = !(0, class_validator_1.isEmail)(association) ? { username: association } : { email: association };
            return this.dataProvider.fromPrisma().agent.findUnique({ where });
        });
    }
    byPasskey(passkey) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = { passkey: (0, crypto_1.createHash)("md5").update(passkey).digest("hex") };
            return this.dataProvider.fromPrisma().agent.findUnique({ where });
        });
    }
    validate(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!credentials[0])
                return false;
            switch (credentials.length) {
                case 1:
                    return !!(yield this.byPasskey(credentials[0]));
                case 2:
                    const agent = yield this.byAssociation(credentials[0]);
                    return !!agent && encryption_1.Encryption.verifyPassword(credentials[1], agent.password);
                default:
                    return false;
            }
        });
    }
}
exports.AgentsManager = AgentsManager;
