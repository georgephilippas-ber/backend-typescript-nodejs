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
            let session_: dtoAgentSession | null = await this.extractSession(req);

            if (!session_)
                res.status(StatusCodes.EXPECTATION_FAILED).send({error: "invalid token"});
            else
            {
                let sessionValidity = await this.sessionsManager.getSessionValidity(session_.sessionId);

                switch (sessionValidity)
                {
                    case "nonexistent":
                        res.status(StatusCodes.NOT_FOUND).send({error: sessionValidity});
                        break;
                    case "expired":
                        await this.sessionsManager.delete({id: session_.sessionId});
                        res.status(StatusCodes.FAILED_DEPENDENCY).send({error: sessionValidity});
                        break;
                    case "valid":
                        await this.sessionsManager.delete({id: session_.sessionId});
                        res.sendStatus(StatusCodes.OK);
                }
            }
        });
    }

    extractSession(req: Request): dtoAgentSession | null
    {
        let agentSession: dtoAgentSession | null;

        try
        {
            agentSession = plainToInstance(dtoAgentSession, this.jsonWebToken.verify(headers(req)[this.configuration.authenticationHeader()].split(" ")[1]));
        } catch (e)
        {
            console.log(e);
            agentSession = null;
        }

        if (agentSession && dtoAgentSession.validate(agentSession))
            return {agentId: agentSession.agentId, sessionId: agentSession.sessionId};
        else
            return null;
    }
}
