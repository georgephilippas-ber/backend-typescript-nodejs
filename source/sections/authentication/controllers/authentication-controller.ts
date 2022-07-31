import express, {Request} from "express";

import {StatusCodes} from "http-status-codes"

import {plainToInstance} from "class-transformer";
import {dtoLoginAgent} from "../../agents/data-transfer-object/data-transfer-object";
import {AgentsManager} from "../../agents/managers/agents-manager";

import {body, Controller, headers} from "../../../interface/controller";
import {JSONWebToken} from "../../../model/json-web-token/json-web-token";
import {Configuration} from "../../../configuration/configuration";
import {SessionsManager} from "../../sessions/managers/sessions-manager";
import moment from "moment";

class dtoAgentSession
{
    agentId!: number;
    sessionId!: number;

    static validate(agentSession: dtoAgentSession)
    {
        return Boolean(agentSession.agentId && agentSession.sessionId);
    }
}


export class AuthenticationController extends Controller
{
    agentsManager: AgentsManager;
    sessionsManager: SessionsManager;

    jsonWebToken: JSONWebToken;
    configuration: Configuration;

    constructor(route: string, agentsManager: AgentsManager, sessionsManager: SessionsManager, jsonWebToken: JSONWebToken, configuration: Configuration)
    {
        super(route);

        this.agentsManager = agentsManager;
        this.sessionsManager = sessionsManager;

        this.jsonWebToken = jsonWebToken;
        this.configuration = configuration;

        this.router.use(express.json());

        this.login();
        this.logout();
    }

    login()
    {
        this.router.post("/login", async (req, res) =>
        {
            let agentLogin: dtoLoginAgent = plainToInstance(dtoLoginAgent, body(req));

            if (!dtoLoginAgent.validate(agentLogin))
                res.sendStatus(StatusCodes.BAD_REQUEST)
            else
            {
                let agent_ = await this.agentsManager.validate(agentLogin.credentials);

                if (agent_)
                {
                    let session_ = await this.sessionsManager.create({
                        agentId: agent_.id,
                        expiresAt: moment().add(this.configuration.getSessionDuration("initial").quantity, this.configuration.getSessionDuration("initial").unit).toDate()
                    });

                    if (session_)
                        res.status(StatusCodes.OK).send({
                            token: this.jsonWebToken.produce({agentId: agent_.id, sessionId: session_.id})
                        });
                    else
                        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }

    logout()
    {
        this.router.post("/logout", async (req, res) =>
        {
            let session_: dtoAgentSession | null = await this.getSession(req);

            if (!session_)
                res.sendStatus(StatusCodes.EXPECTATION_FAILED)
            else
            {
                await this.sessionsManager.delete({id: session_.sessionId});

                res.sendStatus(StatusCodes.OK);
            }
        });
    }

    async getSession(req: Request): Promise<dtoAgentSession | null>
    {
        const authenticationHeader: string = headers(req)[this.configuration.authenticationHeader()];

        if (!authenticationHeader)
            return null;

        const authenticationToken = authenticationHeader.split(" ")[1];

        if (!authenticationToken)
            return null;

        const authenticationPayload = this.jsonWebToken.verify(authenticationToken);

        if (!authenticationPayload)
            return null;

        const agentSession: dtoAgentSession = plainToInstance(dtoAgentSession, authenticationPayload);

        if (!dtoAgentSession.validate(agentSession))
            return null;
        else
            return {agentId: agentSession.agentId, sessionId: agentSession.sessionId};
    }
}
