import {isEmail, isArray, isString} from "class-validator";
import {isBetween} from "../../../model/utilities/utilities";

export class dtoCreateAgent
{
    credentials!: [string, string, string, string?]

    static validate(agentCreate: dtoCreateAgent): boolean
    {
        const criteria = [isArray(agentCreate.credentials), isBetween(agentCreate.credentials.length, 3, 4), agentCreate.credentials.every(value => value), isEmail(agentCreate.credentials[1])];

        return criteria.every(value => value);
    }
}

export class dtoDeleteAgent
{
    credential!: string;

    static validate(agentDelete: dtoDeleteAgent): boolean
    {
        const criteria = [isString(agentDelete.credential), !!agentDelete.credential];

        return criteria.every(value => value);
    }
}
