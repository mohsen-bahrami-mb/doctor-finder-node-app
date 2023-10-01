// import modules
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Controller, { createUsername } from "../../controllers";
// import middleware modules
import { response } from "../../controllers";
// import modules types
import Express from "express";
import { User as UserType } from "../../types/requestProcessor";
// import models types
import User from "../../models/user";

export default new (class extends Controller {
    // make all route logic as middleware function

    async getProfile(req: Express.Request, res: Express.Response): Promise<void> {
        const user = await User.findById(req.user.id).select({ password: 0, _id: 0 });
        response({ res, success: true, sCode: 200, message: "user successfully registred", data: {user} });
    }

})();