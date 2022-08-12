import {body, Controller} from "../../../interface/controller";
import {profileCreate_class, ProfileManager} from "../managers/profile-manager";
import {plainToInstance} from "class-transformer";
import {StatusCodes} from "http-status-codes";
import express from "express";

export class ProfileController extends Controller
{
    constructor(route: string, private profileManager: ProfileManager)
    {
        super(route);

        this.router.use(express.json());
        
        this.create();
        this.delete_all();
    }

    create()
    {
        this.router.post("/create", async (req, res) =>
        {
            const profileCreate: profileCreate_class = plainToInstance(profileCreate_class, body(req));

            profileCreate.birthdate = new Date(profileCreate.birthdate);

            const profile_ = await this.profileManager.create(profileCreate);

            console.log(profile_);

            if (profile_)
                res.sendStatus(StatusCodes.OK);
            else
                res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }

    delete_all()
    {
        this.router.delete("/delete", (req, res) =>
        {
            this.profileManager.delete_all();

            res.sendStatus(StatusCodes.OK);
        })
    }
}
