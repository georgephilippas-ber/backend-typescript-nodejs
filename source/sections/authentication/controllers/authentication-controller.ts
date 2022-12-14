import express, {NextFunction, Request, Response} from "express";

import {StatusCodes} from "http-status-codes"

import {instanceToPlain, plainToInstance} from "class-transformer";
import {AgentManager} from "../managers/agent-manager";

import {body, Controller, headers} from "../../../interface/controller";
import {JSONWebToken} from "../../../model/json-web-token/json-web-token";
import {Configuration} from "../../../configuration/configuration";
import {SessionManager} from "../managers/session-manager";
import moment from "moment";

class dtoSession
{
    agentId!: number;
    sessionId!: number;

    constructor(agentId: number, sessionId: number)
    {
        this.agentId = agentId;
        this.sessionId = sessionId;
    }

    validate()
    {
        return !!(this.agentId && this.sessionId);
    }
}

class dtoLogin
{
    credentials!: string[];

    validate()
    {
        return Array.isArray(this.credentials) && this.credentials.every(value => value);
    }
}

export function protectedRoute(sessionsManager: SessionManager, jsonWebToken: JSONWebToken, configuration: Configuration)
{
    return async (req: Request, res: Response, next: NextFunction) =>
    {
        let extractedSession: dtoSession | null;

        try
        {
            extractedSession = plainToInstance(dtoSession, jsonWebToken.verify(headers(req)[configuration.authenticationHeader()].split(" ")[1]));

            if (!extractedSession || !extractedSession.validate())
                res.sendStatus(StatusCodes.PARTIAL_CONTENT);
            else
            {
                switch (await sessionsManager.getSessionValidity(extractedSession.sessionId))
                {
                    case "nonexistent":
                    case "expired":
                        res.sendStatus(StatusCodes.FORBIDDEN);
                        break;
                    case "valid":
                        req.body["session"] = instanceToPlain(extractedSession);

                        await sessionsManager.extend({
                            id: extractedSession.sessionId,
                            by: configuration.getSessionDuration("extension")
                        });

                        next();
                }
            }
        } catch (e)
        {
            res.sendStatus(StatusCodes.BAD_REQUEST);
        }
    }
}


export class AuthenticationController extends Controller
{
    agentsManager: AgentManager;
    sessionsManager: SessionManager;

    jsonWebToken: JSONWebToken;
    configuration: Configuration;

    constructor(route: string, agentsManager: AgentManager, sessionsManager: SessionManager, jsonWebToken: JSONWebToken, configuration: Configuration)
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
            let agentLogin: dtoLogin = plainToInstance(dtoLogin, body(req));

            if (!agentLogin.validate())
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
            let extractedSession: dtoSession | null = await this.extractSession(req);

            if (!extractedSession)
                res.status(StatusCodes.EXPECTATION_FAILED).send({error: "invalid token"});
            else
            {
                let sessionValidity = await this.sessionsManager.getSessionValidity(extractedSession.sessionId);

                switch (sessionValidity)
                {
                    case "nonexistent":
                        res.status(StatusCodes.NOT_FOUND).send({error: sessionValidity});
                        break;
                    case "expired":
                        await this.sessionsManager.delete({id: extractedSession.sessionId});
                        res.status(StatusCodes.FAILED_DEPENDENCY).send({error: sessionValidity});
                        break;
                    case "valid":
                        await this.sessionsManager.delete({id: extractedSession.sessionId});
                        res.sendStatus(StatusCodes.OK);
                }
            }
        });
    }

    extractSession(req: Request): dtoSession | null
    {
        let extractedSession: dtoSession | null;

        try
        {
            extractedSession = plainToInstance(dtoSession, this.jsonWebToken.verify(headers(req)[this.configuration.authenticationHeader()].split(" ")[1]));
        } catch (e)
        {
            extractedSession = null;
        }

        if (extractedSession && extractedSession.validate())
            return new dtoSession(extractedSession.agentId, extractedSession.sessionId);
        else
            return null;
    }
}
