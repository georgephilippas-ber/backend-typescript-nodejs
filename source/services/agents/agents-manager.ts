import {DataProvider} from "../../fundamental/data-provider";

import {Agent, Prisma} from "@prisma/client";

import {AgentCreate} from "./data-transfer-object/data-transfer-object";

import {Encryption} from "../../fundamental/encryption/encryption";
import {isEmail} from "class-validator";
import {createHash} from "crypto";

export class AgentsManager
{
    dataProvider: DataProvider;

    constructor(dataProvider: DataProvider)
    {
        this.dataProvider = dataProvider;
    }

    async create(agentCreate: AgentCreate): Promise<Agent | undefined>
    {
        if (!AgentCreate.validate(agentCreate))
            return undefined;

        switch (agentCreate.credentials.length)
        {
            case 3:
            case 4:
                const candidateAgent: Prisma.AgentUncheckedCreateInput =
                    {
                        username: agentCreate.credentials[0],
                        email: agentCreate.credentials[1],
                        password: await Encryption.hashPassword_generateSalt(agentCreate.credentials[2]),
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

    async byAssociation(association: string): Promise<Agent | null>
    {
        let where = !isEmail(association) ? {username: association} : {email: association};

        return this.dataProvider.fromPrisma().agent.findUnique({where});
    }

    async byPasskey(passkey: string): Promise<Agent | null>
    {
        let where = {passkey: createHash("md5").update(passkey).digest("hex")};

        return this.dataProvider.fromPrisma().agent.findUnique({where});
    }

    async validate(credentials: string[]): Promise<boolean>
    {
        if (!credentials[0])
            return false;

        switch (credentials.length)
        {
            case 1:
                return !!(await this.byPasskey(credentials[0]));
            case 2:
                const agent = await this.byAssociation(credentials[0]);

                return !!agent && Encryption.verifyPassword(credentials[1], agent.password);
            default:
                return false;
        }
    }
}
