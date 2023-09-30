// import modules
import jwt from "jsonwebtoken";
// import models
import Session from "../models/session";
import { response } from ".";
// import types
import Express from "express";

export default function checkValidateErr(
    req: Express.Request, res: Express.Response, next: Express.NextFunction, err: string[], redirect?: string
): void {
    if (err.length) return response({
        res, success: false, sCode: 400, message: "validation error", data: { err },
        req,
        // type: "redirect", view: (redirect ?? req.originalUrl)
    });
    next();
}


export class ValidateErr {
    public err: string[] = [];

    async checkValid(condition: () => boolean, msgErr: string) {
        new Promise((resolve, reject) => {
            if (condition()) resolve(true);
            else reject(msgErr);
        }).catch((v) => { this.err.push(v) });
    }

    checkValidSync(condition: () => boolean, msgErr: string) {
        if (!condition()) this.err.push(msgErr);
    }
}