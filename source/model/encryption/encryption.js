"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encryption = void 0;
const crypto_1 = require("crypto");
class Encryption {
    static hashPasskey(passkey) {
        return (0, crypto_1.createHash)("md5").update(passkey).digest("hex");
    }
    static hashPassword_generateSalt(password, hashLength_bytes, saltLength_bytes = 0x10, separator = "&") {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = (0, crypto_1.randomBytes)(saltLength_bytes);
            return new Promise(resolve => {
                (0, crypto_1.scrypt)(password, salt.toString("hex"), hashLength_bytes, (err, derivedKey) => {
                    resolve([derivedKey, salt].map(value => value.toString("hex")).join(separator));
                });
            });
        });
    }
    static verifyPassword(password, hash, hashLength_bytes, separator = "&") {
        return __awaiter(this, void 0, void 0, function* () {
            const [pure, salt] = hash.split(separator);
            if (!salt)
                return false;
            else
                return new Promise(resolve => {
                    (0, crypto_1.scrypt)(password, salt, 0x20, (err, derivedKey) => {
                        resolve(derivedKey.toString("hex") === pure);
                    });
                });
        });
    }
}
exports.Encryption = Encryption;
