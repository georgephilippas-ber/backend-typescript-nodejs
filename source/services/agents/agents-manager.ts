import {DataProvider} from "../../fundamental/data-provider";

import {Agent} from "@prisma/client";

import {AgentCreate} from "./data-transfer-object/data-transfer-object";

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
                const candidateAgent =
                    {
                        username: agentCreate.credentials[0],
                        email: agentCreate.credentials[1],
                        password: agentCreate.credentials[2],
                        passkey: agentCreate.credentials[3] ?? null
                    };

                return this.dataProvider.fromPrisma().agent.create({
                    data: candidateAgent
                });
            default:
                return undefined;

        }
    }

    validate_byPassword(credentials: string[])
    {

    }
}
