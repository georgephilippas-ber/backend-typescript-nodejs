import {createHash, randomBytes, scrypt} from "crypto";

export class Encryption
{
    static hashPasskey(passkey: string): string
    {
        return createHash("md5").update(passkey).digest("hex");
    }

    static async hashPassword_generateSalt(password: string, saltLength_bytes: number = 0x10, separator: string = "&"): Promise<string>
    {
        const salt: Buffer = randomBytes(saltLength_bytes);

        return new Promise<string>(resolve =>
        {
            scrypt(password, salt.toString("hex"), 0x20, (err, derivedKey) =>
            {
                resolve([derivedKey, salt].map(value => value.toString("hex")).join(separator));
            });
        })
    }

    static async verifyPassword(password: string, hash: string, separator: string = "&"): Promise<boolean>
    {
        const [pure, salt] = hash.split(separator);

        if (!salt)
            return false;
        else
            return new Promise<boolean>(resolve =>
            {
                scrypt(password, salt, 0x20, (err, derivedKey) =>
                {
                    resolve(derivedKey.toString("hex") === pure)
                });
            });
    }
}
