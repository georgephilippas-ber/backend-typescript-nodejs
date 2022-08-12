import {DataProvider} from "../../../model/data-provider";
import {Profile} from "@prisma/client";

export class profileCreate_class
{
    forename: string;
    surname: string;
    birthdate: string | Date;
    location: string;
    agentId: number;
    avatar:
        {
            storage: "local" | "remote";
            address: string;
        }
}

export class ProfileManager
{
    constructor(private dataProvider: DataProvider)
    {
    }

    async create(profileCreate: profileCreate_class): Promise<Profile | null>
    {
        return this.dataProvider.fromPrisma().profile.create({
            data: {
                forename: profileCreate.forename, surname: profileCreate.surname, birthdate: profileCreate.birthdate,
                location: profileCreate.location, avatar: {
                    create:
                        {
                            storage: profileCreate.avatar.storage,
                            address: profileCreate.avatar.address
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

    delete_all()
    {
        this.dataProvider.fromPrisma().profile.deleteMany({where: {forename: "forename"}});
    }
}
