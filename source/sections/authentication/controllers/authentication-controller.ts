import express, {Request, Router} from "express";

import {getReasonPhrase, StatusCodes} from "http-status-codes"

import {plainToInstance} from "class-transformer";
import {dtoCreateAgent, dtoLoginAgent} from "../../agents/data-transfer-object/data-transfer-object";
import {AgentsManager} from "../../agents/managers/agents-manager";

import {Controller, body} from "../../../interface/controller";
import {log} from "util";

export class AuthenticationController extends Controller
{
    agentsManager: AgentsManager;

    constructor(route: string, agentsManager: AgentsManager)
    {
        super(route);

        this.agentsManager = agentsManager;

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
            else if (!(await this.agentsManager.validate(agentLogin.credentials)))
                res.sendStatus(StatusCodes.FORBIDDEN);
            else
            {
                // TODO
                res.send({status: "accepted"});
            }
        });
    }
}
