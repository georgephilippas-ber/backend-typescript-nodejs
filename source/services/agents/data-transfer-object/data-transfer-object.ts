import {isEmail, isArray} from "class-validator";
import {isBetween} from "../../../fundamental/utilities/utilities";

export class AgentCreate
{
    credentials!: [string, string, string, string?]

    validate(): boolean
    {
        const criteria = [isArray(this.credentials), isBetween(this.credentials.length, 3, 4), this.credentials.every(value => value), isEmail(this.credentials[1])];

        return criteria.every(value => value);
    }
}
