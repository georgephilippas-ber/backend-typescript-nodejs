import {isEmail, isArray, isString} from "class-validator";
import {isBetween} from "../../../model/utilities/utilities";

export class dtoCreateAgent
{
    credentials!: string[];

    static validate(agentCreate: dtoCreateAgent): boolean
    {
        const criteria = [isArray(agentCreate.credentials), isBetween(agentCreate.credentials.length, 3, 4), agentCreate.credentials.every(value => value), isEmail(agentCreate.credentials[1])];

        return criteria.every(value => value);
    }
}

export class dtoLoginAgent
{
    credentials!: string[];

    static validate(agentLogin: dtoLoginAgent)
    {
        const criteria = [agentLogin.credentials, isArray(agentLogin.credentials), isBetween(agentLogin.credentials.length, 1, 2), agentLogin.credentials.every(value => value)];

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
