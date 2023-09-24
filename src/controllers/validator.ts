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
        req, type: "redirect", view: (redirect ?? req.originalUrl)
    });
    next();
}