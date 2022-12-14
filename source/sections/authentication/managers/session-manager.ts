import {AgentManager} from "./agent-manager";
import {DataProvider} from "../../../model/data-provider";
import {Prisma, Agent, Session} from "@prisma/client";

import moment, {DurationInputArg2} from "moment";

export class dtoCreateSession
{
    agentId?: number;
    association?: string;

    expiresAt?: Date;

    static validate(sessionCreate: dtoCreateSession): boolean
    {
        let criteria = [sessionCreate.agentId || sessionCreate.association];

        return criteria.every(value => value);
    }
}

export class dtoExtendSession
{
    id!: number;

    by!: { quantity: number, unit?: DurationInputArg2 };
}

export class dtoDeleteSession
{
    id!: number;
}

export class SessionManager
{
    constructor(private agentsManager: AgentManager, private dataProvider: DataProvider)
    {
    }

    async byId(id: number): Promise<Session | null>
    {
        return this.dataProvider.fromPrisma().session.findUnique({where: {id}});
    }

    async getSessionValidity(sessionId: number): Promise<"nonexistent" | "expired" | "valid">
    {
        const session_: Session | null = await this.byId(sessionId);

        if (!session_)
            return "nonexistent";
        else if (moment(session_.expiresAt) < moment())
            return "expired";
        else
            return "valid";
    }

    async extend(sessionExtend: dtoExtendSession): Promise<Session | null>
    {
        const session_ = await this.byId(sessionExtend.id);

        if (!session_ || moment(session_.expiresAt) < moment())
            return null;
        else
        {
            return this.dataProvider.fromPrisma().session.update({
                where: {
                    id: session_.id
                }, data: {
                    expiresAt: session_.expiresAt ? moment(session_.expiresAt).add(sessionExtend.by.quantity, sessionExtend.by.unit ?? "minutes").toDate() : undefined
                }
            });
        }
    }

    async create(sessionCreate: dtoCreateSession): Promise<Session | null>
    {
        if (!dtoCreateSession.validate(sessionCreate))
            return null;

        let agent_: Agent | null = null;

        if (sessionCreate.agentId)
            agent_ = await this.agentsManager.byId(sessionCreate.agentId);
        else if (sessionCreate.association)
            agent_ = await this.agentsManager.byAssociation(sessionCreate.association);

        if (agent_)
        {
            return this.dataProvider.fromPrisma().session.create({
                data:
                    {
                        expiresAt: sessionCreate.expiresAt && moment(sessionCreate.expiresAt) > (moment()) ? sessionCreate.expiresAt : undefined,
                        agent: {
                            connect:
                                {
                                    id: agent_.id
                                }
                        }
                    }
            });
        } else
            return null;
    }

    delete(deleteSesion: dtoDeleteSession): Promise<Session | null>
    {
        return this.dataProvider.fromPrisma().session.delete({where: {id: deleteSesion.id}});
    }

    async delete_forUser(agentId: number): Promise<Prisma.BatchPayload>
    {
        return this.dataProvider.fromPrisma().session.deleteMany({
            where:
                {
                    agent: {
                        id: agentId
                    }
                }
        });
    }

    async delete_all(): Promise<Prisma.BatchPayload>
    {
        return this.dataProvider.fromPrisma().session.deleteMany({});
    }
}
