import {isEmail, isArray} from "class-validator";
import {isBetween} from "../../../fundamental/utilities/utilities";

export class AgentCreate
{
    credentials!: [string, string, string, string?]

    static validate(agentCreate: AgentCreate): boolean
    {
        const criteria = [isArray(agentCreate.credentials), isBetween(agentCreate.credentials.length, 3, 4), agentCreate.credentials.every(value => value), isEmail(agentCreate.credentials[1])];

        return criteria.every(value => value);
    }
}
