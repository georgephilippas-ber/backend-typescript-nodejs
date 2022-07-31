import {Secret} from "jsonwebtoken";
import {faker} from "@faker-js/faker";
import {duration_type} from "../interface/types";
import {randomBytes} from "crypto";

type configuration_type = {
    encryption:
        {
            hashLength_bytes: number;
        },
    authentication:
        {
            maximumUsernameLength_characters: number;
            secretOrPrivateKey: Secret;
            sessionDuration:
                {
                    initial: duration_type;
                    extension: duration_type;
                };
            authenticationHeader: string;
        }
}

const configuration_: configuration_type =
    {
        encryption:
            {
                hashLength_bytes: 0x20
            },
        authentication:
            {
                maximumUsernameLength_characters: 0x10,
                secretOrPrivateKey: randomBytes(0x20),
                sessionDuration:
                    {
                        initial: {quantity: 0x02, unit: "hours"},
                        extension: {quantity: 30, unit: "minutes"}
                    },
                authenticationHeader: "Authentication".toLowerCase()
            }
    };

export class Configuration
{
    configuration: configuration_type

    constructor()
    {
        this.configuration = configuration_;
    }

    getHashLength_bytes(): number
    {
        return this.configuration.encryption.hashLength_bytes;
    }

    getMaximumUsernameLength_characters(): number
    {
        return this.configuration.authentication.maximumUsernameLength_characters;
    }

    getSecretOrPrivateKey(): Secret
    {
        return this.configuration.authentication.secretOrPrivateKey;
    }

    getSessionDuration(key: keyof configuration_type["authentication"]["sessionDuration"]): duration_type
    {
        return this.configuration.authentication.sessionDuration[key];
    }

    authenticationHeader(): string
    {
        return this.configuration.authentication.authenticationHeader;
    }
}
