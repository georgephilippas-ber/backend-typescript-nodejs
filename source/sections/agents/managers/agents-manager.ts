import {DataProvider} from "../../../model/data-provider";

import {Agent, Prisma} from "@prisma/client";

import {dtoCreateAgent, dtoDeleteAgent} from "../data-transfer-object/data-transfer-object";

import {Encryption} from "../../../model/encryption/encryption";
import {isEmail} from "class-validator";
import {createHash} from "crypto";
import {configuration} from "../../../configuration/configuration";

export class AgentsManager
{
    dataProvider: DataProvider;

    constructor(dataProvider: DataProvider)
    {
        this.dataProvider = dataProvider;
    }

    async create(agentCreate: dtoCreateAgent): Promise<Agent | undefined>
    {
        if (!dtoCreateAgent.validate(agentCreate))
            return undefined;

        switch (agentCreate.credentials.length)
        {
            case 3:
            case 4:
                const candidateAgent: Prisma.AgentUncheckedCreateInput =
                    {
                        username: agentCreate.credentials[0],
                        email: agentCreate.credentials[1],
                        password: await Encryption.hashPassword_generateSalt(agentCreate.credentials[2], configuration().authentication.hashLength_bytes),
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

    async delete(agentDelete: dtoDeleteAgent): Promise<Agent | null>
    {
        if (!dtoDeleteAgent.validate(agentDelete))
            return null;

        if (isEmail(agentDelete.credential))
        {
            return this.dataProvider.fromPrisma().agent.delete({where: {email: agentDelete.credential}});
        }

        if (agentDelete.credential.length <= configuration().authentication.maximumUsernameLength_characters)
        {
            return this.dataProvider.fromPrisma().agent.delete({where: {username: agentDelete.credential}});
        }

        return this.dataProvider.fromPrisma().agent.delete({where: {passkey: createHash("md5").update(agentDelete.credential).digest("hex")}});
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

    async all(): Promise<Agent[]>
    {
        return this.dataProvider.fromPrisma().agent.findMany();
    }
}
