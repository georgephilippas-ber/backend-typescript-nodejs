import {PrismaClient} from "@prisma/client";

export class DataProvider
{
    prismaClient: PrismaClient;

    constructor()
    {
        this.prismaClient = new PrismaClient();
    }

    fromPrisma(): PrismaClient
    {
        return this.prismaClient;
    }
}
