"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agents_manager_1 = require("./agents-manager");
const data_provider_1 = require("../../fundamental/data-provider");
let agentsManager = new agents_manager_1.AgentsManager(new data_provider_1.DataProvider());
describe("", () => {
    agentsManager.validate([]);
});
