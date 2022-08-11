import {DataProvider} from "../../../model/data-provider";

import {Agent, Prisma} from "@prisma/client";

import {Encryption} from "../../../model/encryption/encryption";
import {isEmail} from "class-validator";
import {createHash} from "crypto";
import {Configuration} from "../../../configuration/configuration";

export class AgentManager
{
    dataProvider: DataProvider;
    configuration: Configuration;

    constructor(dataProvider: DataProvider, configuration: Configuration)
    {
        this.dataProvider = dataProvider;
        this.configuration = configuration;
    }

    async create(credentials: string[]): Promise<Agent | null>
    {
        if (!credentials.every(value => value))
            return null;

        switch (credentials.length)
        {
            case 3:
            case 4:
                const candidateAgent: Prisma.AgentUncheckedCreateInput =
                    {
                        username: credentials[0],
                        email: credentials[1],
                        password: await Encryption.hashPassword_generateSalt(credentials[2], this.configuration.getHashLength_bytes()),
                    };

                if (credentials[3])
                    candidateAgent.passkey = Encryption.hashPasskey(credentials[3]);

                return this.dataProvider.fromPrisma().agent.create({
                    data: candidateAgent
                });
            default:
                return null;
        }
    }

    async delete(credential: string): Promise<Agent | null>
    {
        if (!credential)
            return null;

        if (isEmail(credential))
        {
            return this.dataProvider.fromPrisma().agent.delete({where: {email: credential}});
        }

        if (credential.length <= this.configuration.getMaximumUsernameLength_characters())
        {
            return this.dataProvider.fromPrisma().agent.delete({where: {username: credential}});
        }

        return this.dataProvider.fromPrisma().agent.delete({where: {passkey: createHash("md5").update(credential).digest("hex")}});
    }

    async byId(id: number): Promise<Agent | null>
    {
        return this.dataProvider.fromPrisma().agent.findUnique({where: {id}});
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

    async validate(credentials: string[]): Promise<Agent | null>
    {
        if (!credentials[0])
            return null;

        switch (credentials.length)
        {
            case 1:
                return this.byPasskey(credentials[0]);
            case 2:
                const agent = await this.byAssociation(credentials[0]);

                if (agent)
                    return (await Encryption.verifyPassword(credentials[1], agent.password, this.configuration.getHashLength_bytes())) ? agent : null;
                else
                    return null;
            default:
                return null;
        }
    }

    async all(): Promise<Agent[]>
    {
        return this.dataProvider.fromPrisma().agent.findMany();
    }
}
