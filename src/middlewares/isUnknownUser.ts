// import modules
// import controllers
import { response } from "../controllers";
// import models
// import types
import Express from "express";

export default async function (
    req: Express.Request, res: Express.Response, next: Express.NextFunction
): Promise<void> {
    // check is unknown user
    if (req.session.is_login) return response({
        res, success: false, sCode: 409, message: "logged in user",
        data: { err: ["شما هم اکنون در پنل کاربری خود هستید!", "نیازی به ثبت نام یا ورود مجدد نیست!"] },
        req, type: "redirect", view: "/dashboard"
    });
    next();
}