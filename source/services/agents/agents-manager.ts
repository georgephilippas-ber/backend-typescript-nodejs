import {DataProvider} from "../../fundamental/data-provider";

import {Agent, Prisma} from "@prisma/client";

import {AgentCreate} from "./data-transfer-object/data-transfer-object";

import {Encryption} from "../../fundamental/encryption/encryption";

export class AgentsManager
{
    dataProvider: DataProvider;

    constructor(dataProvider: DataProvider)
    {
        this.dataProvider = dataProvider;
    }

    async create(agentCreate: AgentCreate): Promise<Agent | undefined>
    {
        if (!agentCreate.validate())
            return undefined;

        switch (agentCreate.credentials.length)
        {
            case 3:
            case 4:
                const candidateAgent: Prisma.AgentUncheckedCreateInput =
                    {
                        username: agentCreate.credentials[0],
                        email: agentCreate.credentials[1],
                        password: await Encryption.hashPassword(agentCreate.credentials[2]),
                    };

                if (agentCreate.credentials[3])
                    candidateAgent.passkey = Encryption.hashPasskey(agentCreate.credentials[3]);

                return this.dataProvider.fromPrisma().agent.create({
                    data: candidateAgent
                });
            default:
                return undefined;
        }
    }
}
