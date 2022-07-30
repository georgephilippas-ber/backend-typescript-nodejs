import express, {Request, Router} from "express";

import {getReasonPhrase, StatusCodes} from "http-status-codes"

import {plainToInstance} from "class-transformer";
import {dtoCreateAgent} from "../../agents/data-transfer-object/data-transfer-object";
import {AgentsManager} from "../../agents/managers/agents-manager";

import {Controller, body} from "../../../interface/controller";

export class AuthenticationController extends Controller
{
    agentsManager: AgentsManager;

    constructor(route: string, agentsManager: AgentsManager)
    {
        super(route);

        this.agentsManager = agentsManager;

        this.router.use(express.json());
    }

    login()
    {
        this.router.post("login", async (req, res) =>
        {
            let createAgent: dtoCreateAgent = plainToInstance(dtoCreateAgent, body(req));

            if (!dtoCreateAgent.validate(createAgent))
                res.sendStatus(StatusCodes.BAD_REQUEST)
            else if (!(await this.agentsManager.validate(createAgent.credentials)))
                res.sendStatus(StatusCodes.FORBIDDEN);
            else
            {
                res.send({status: "accepted"});
            }
        });
    }
}
