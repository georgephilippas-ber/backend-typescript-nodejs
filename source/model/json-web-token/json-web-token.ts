import jsonwebtoken, {Secret} from "jsonwebtoken"

import moment, {DurationInputArg2} from "moment";
import {exclude} from "../utilities/utilities";
import {duration_type} from "../../interface/types";

export class JSONWebToken
{
    secretOrPrivateKey: Secret

    constructor(secretOrPrivateKey: Secret)
    {
        this.secretOrPrivateKey = secretOrPrivateKey;
    }

    produce(payload: object, expiration?: duration_type): string
    {
        let payload_ = !expiration ? payload : {
            ...payload,
            exp: moment().add(expiration.quantity, expiration.unit).unix()
        };

        return jsonwebtoken.sign(payload_, this.secretOrPrivateKey);
    }

    verify(string_: string): object | null
    {
        try
        {
            return exclude(jsonwebtoken.verify(string_, this.secretOrPrivateKey) as object, ["iat", "exp"]);
        } catch (e)
        {
            return null;
        }
    }
}
