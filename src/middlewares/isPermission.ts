// import modules
// import controllers
import { response } from "../controllers";
// import models
import User from "../models/user";
// import types
import Express from "express";

export async function isAdmin(
    req: Express.Request, res: Express.Response, next: Express.NextFunction
): Promise<void> {
    // check is login user
    if (!req?.session?.is_login) return response({
        res, success: false, sCode: 401, message: "access denaid!",
        data: { err: ["نیاز است که در سایت لاگین کنید"] },
        req,
        // type: "redirect-nodb", view: "/auth/login"
    });
    const user = await User.findById(req.session.user_id);
    const isAdmin = user?.role.includes("owner") || user?.role.includes("admin");
    if (!user || !isAdmin) return response({
        res, success: false, sCode: 401, message: "access denaid!",
        data: { err: ["شما دسترسی لازم را ندارید!"] },
        req,
        // type: "redirect-nodb", view: "/auth/login"
    });
    next();
}