import crypto from "crypto";

export const generatePassword = (password: string) => {
    let salt = crypto.randomBytes(32).toString("hex");
    let hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    return {
        salt: salt,
        hash: hash,
    };
};

export function validatePassword(password: string, hash: string, salt: string) {
    let hashToVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    return hash === hashToVerify;
}
