import {DataProvider} from "../../../model/data-provider";
import {Profile} from "@prisma/client";

export class profileCreate_class
{
    forename: string;
    surname: string;
    birthdate: string | Date;
    location: string;
    agentId: number;

    avatarId?: number;
    avatarCreate?: avatarCreate_type
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

    async create(profileCreate: profileCreate_class): Promise<Profile | null>
    {
        if (!(profileCreate.avatarId || profileCreate.avatarCreate))
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
                avatar: !profileCreate.avatarCreate ? {
                    connect: {
                        id: profileCreate.avatarId
                    }
                } : {
                    create: {
                        storage: profileCreate.avatarCreate.storage,
                        address: profileCreate.avatarCreate.address
                    }
                }
            }
        })
    }

    delete_all()
    {
        this.dataProvider.fromPrisma().profile.deleteMany({});
    }
}
