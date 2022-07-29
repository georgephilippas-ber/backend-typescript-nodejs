"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataProvider = void 0;
const client_1 = require("@prisma/client");
class DataProvider {
    constructor() {
        this.prismaClient = new client_1.PrismaClient();
    }
    fromPrisma() {
        return this.prismaClient;
    }
}
exports.DataProvider = DataProvider;
