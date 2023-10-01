// import modules
// import controllers
import { response } from "../controllers";
// import models
// import types
import Express from "express";

export default async function (
    req: Express.Request, res: Express.Response, next: Express.NextFunction
): Promise<void> {
    // check is login user
    if (!req?.session?.is_login) return response({
        res, success: false, sCode: 401, message: "access denaid!",
        data: { err: ["نیاز است که در سایت لاگین کنید"] },
        req, 
        // type: "redirect-nodb", view: "/auth/login"
    });
    next();
}