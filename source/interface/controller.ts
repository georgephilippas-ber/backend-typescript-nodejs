import express, {Express, Request, Router} from "express";

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
