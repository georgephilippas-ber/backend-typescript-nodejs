import express from "express";

import {StatusCodes} from "http-status-codes"

import {plainToInstance} from "class-transformer";
import {dtoLoginAgent} from "../../agents/data-transfer-object/data-transfer-object";
import {AgentsManager} from "../../agents/managers/agents-manager";

import {body, Controller} from "../../../interface/controller";
import {JSONWebToken} from "../../../model/json-web-token/json-web-token";
import {Configuration} from "../../../configuration/configuration";
import {SessionsManager} from "../../sessions/managers/sessions-manager";
import {Secret} from "jsonwebtoken";
import moment from "moment";

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
                    await this.sessionsManager.create({agentId: agent_.id, expiresAt: moment().add(this.configuration.getSessionDuration("initial").quantity, this.configuration.getSessionDuration("initial").unit).toDate()});

                    res.status(StatusCodes.OK).send({
                        token: this.jsonWebToken.produce({agentId: agent_.id}, this.configuration.getSessionDuration("initial"))
                    })
                }
            }
        });
    }
}
