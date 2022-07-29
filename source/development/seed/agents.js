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
exports.seed = void 0;
const data_provider_1 = require("../../fundamental/data-provider");
const agents_manager_1 = require("../../services/agents/agents-manager");
const faker_1 = require("@faker-js/faker");
function seed(cardinality) {
    return __awaiter(this, void 0, void 0, function* () {
        const agentsManager = new agents_manager_1.AgentsManager(new data_provider_1.DataProvider());
        agentsManager.dataProvider.fromPrisma().agent.deleteMany({});
        for (let i_ = 0; i_ < cardinality; i_++) {
            const forename = faker_1.faker.name.firstName("female"), surname = faker_1.faker.name.lastName("female");
            let agentCreate = { credentials: [faker_1.faker.internet.userName(forename, surname).toLowerCase(), faker_1.faker.internet.email(forename, surname).toLowerCase(), faker_1.faker.internet.password(0x10, true).toLowerCase(), faker_1.faker.lorem.words(0x04)] };
            console.log(agentCreate.credentials);
            yield agentsManager.create(agentCreate);
        }
    });
}
exports.seed = seed;
