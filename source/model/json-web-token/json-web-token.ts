import jsonwebtoken, {Secret} from "jsonwebtoken"

import moment from "moment";
import {exclude} from "../utilities/utilities";
import {duration_type} from "../../interface/types";

export class JSONWebToken
{
    secretOrPrivateKey: Secret

    constructor(secretOrPrivateKey: Secret)
    {
        this.secretOrPrivateKey = secretOrPrivateKey;
    }

    produce(payload: object, duration?: duration_type): string
    {
        let payload_ = !duration ? payload : {
            ...payload,
            exp: moment().add(duration.quantity, duration.unit).unix()
        };

        return jsonwebtoken.sign(payload_, this.secretOrPrivateKey, {algorithm: "HS256"});
    }

    verify(string_: string): object | null
    {
        try
        {
            return exclude(jsonwebtoken.verify(string_, this.secretOrPrivateKey, {algorithms: ["HS256"]}) as object, ["iat", "exp"]);
        } catch (e)
        {
            console.log("failed")
            return null;
        }
    }
}
