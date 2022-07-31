import {Secret} from "jsonwebtoken";
import {faker} from "@faker-js/faker";
import {duration_type} from "../interface/types";

type configuration_type = {
    authentication:
        {
            hashLength_bytes: number;
            maximumUsernameLength_characters: number;
            secretOrPrivateKey: Secret;
            sessionDuration:
                {
                    initial: duration_type;
                    extension: duration_type;
                };
        }
}

const configuration_: configuration_type = Object.freeze(
    {
        authentication:
            {
                hashLength_bytes: 0x20,
                maximumUsernameLength_characters: 0x10,
                secretOrPrivateKey: faker.datatype.uuid(),
                sessionDuration:
                    {
                        initial: {quantity: 0x02, unit: "hours"},
                        extension: {quantity: 30, unit: "minutes"}
                    }
            }
    });

export class Configuration
{
    configuration: configuration_type

    constructor()
    {
        this.configuration = configuration_;
    }

    getAuthentication(key: keyof configuration_type["authentication"]): any
    {
        return this.configuration.authentication[key];
    }

    getSecretOrPrivateKey(): Secret
    {
        return this.configuration.authentication.secretOrPrivateKey;
    }

    getSessionDuration(key: keyof configuration_type["authentication"]["sessionDuration"]): duration_type
    {
        return this.configuration.authentication.sessionDuration[key];
    }
}
