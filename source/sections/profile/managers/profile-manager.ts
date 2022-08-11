import {DataProvider} from "../../../model/data-provider";
import {Profile} from "@prisma/client";

type avatarCreate_type =
    {
        storage: "local" | "remote";
        address: string;
    }

type profileCreate_type =
    {
        forename: string;
        surname: string;
        birthdate: Date;
        location: string;
        agentId: number;
    }


function validate_profileCreate(profileCreate: profileCreate_type)
{
    return !!(profileCreate.forename && profileCreate.surname && profileCreate.birthdate && profileCreate.location);
}

export class ProfileManager
{
    constructor(private dataProvider: DataProvider)
    {
    }

    async create(profileCreate: profileCreate_type, avatarCreate: avatarCreate_type): Promise<Profile | null>
    {
        if (!validate_profileCreate(profileCreate))
            return null;
        else
        {

        }
        return this.dataProvider.fromPrisma().profile.create({
            data: {
                forename: profileCreate.forename, surname: profileCreate.surname, birthdate: profileCreate.birthdate,
                location: profileCreate.location, avatar: {
                    create:
                        {
                            storage: avatarCreate.storage,
                            address: avatarCreate.address
                        }
                }, agent: {
                    connect:
                        {
                            id: profileCreate.agentId
                        }
                }
            }
        })
    }
}
