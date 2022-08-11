import express, {Express, Request, Router} from "express";
import {protectedRoute} from "../sections/identification/controllers/authentication-controller";
import {SessionsManager} from "../sections/identification/managers/sessions-manager";
import {JSONWebToken} from "../model/json-web-token/json-web-token";
import {Configuration} from "../configuration/configuration";

export class Controller
{
    router: Router;
    route: string;

    constructor(route: string)
    {
        this.router = express.Router();

        this.route = route;
    }
}

export class ProtectedController extends Controller
{
    constructor(route: string, sessionsManager: SessionsManager, jsonWebToken: JSONWebToken, configuration: Configuration)
    {
        super(route);

        this.router.use(express.json());

        this.router.use(protectedRoute(sessionsManager, jsonWebToken, configuration));
    }
}

export function body(req: Request): any
{
    return req.body;
}

export function headers(req: Request): any
{
    return req.headers;
}

export class Controllers
{
    controllers: Controller[];

    constructor(controllers: Controller[])
    {
        this.controllers = controllers;
    }

    register(application: Express)
    {
        this.controllers.forEach(value =>
        {
            application.use(value.route, value.router);
        })
    }
}
