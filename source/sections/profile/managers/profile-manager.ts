import {DataProvider} from "../../../model/data-provider";
import {Profile} from "@prisma/client";

export type profileCreate_type =
    {
        forename: string;
        surname: string;
        birthdate: string | Date;
        location: string;
        agentId: number;

        avatarId?: number;
    }

export type avatarCreate_type =
    {
        storage: "local" | "remote",
        address: string;
    }

export class ProfileManager
{
    constructor(private dataProvider: DataProvider)
    {
    }

    async create(profileCreate: profileCreate_type, avatarCreate: avatarCreate_type | null): Promise<Profile | null>
    {
        if (!(profileCreate.avatarId || avatarCreate))
            return null;

        return this.dataProvider.fromPrisma().profile.create({
            data: {
                forename: profileCreate.forename, surname: profileCreate.surname, birthdate: profileCreate.birthdate,
                location: profileCreate.location,
                agent: {
                    connect:
                        {
                            id: profileCreate.agentId
                        }
                },
                avatar: !avatarCreate ? {connect: {id: profileCreate.avatarId}} : {
                    create: {
                        storage: avatarCreate.storage,
                        address: avatarCreate.address
                    }
                }
            }
        })
    }

    delete_all()
    {
        this.dataProvider.fromPrisma().profile.deleteMany({where: {forename: "forename"}});
    }
}
