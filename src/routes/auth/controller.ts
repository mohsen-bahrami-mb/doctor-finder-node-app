// import modules
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Controller, { createUsername, updateSession } from "../../controllers";
// import middleware modules
import { response } from "../../controllers";
// import modules types
import Express from "express";
import { User as UserType } from "../../types/requestProcessor";
// import models types
import User from "../../models/user";
import Session from "../../models/session";

export default new (class extends Controller {
    // make all route logic as middleware function

    async register(req: Express.Request, res: Express.Response): Promise<void> {
        let { first_name, last_name, password, phone } = req.user;
        const user = await User.findOne({ phone });
        if (user) return response({
            res, success: false, sCode: 409,
            message: "this phone already is exist!", data: { user: { phone } }, req
        });
        const SULT = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(<string>password, SULT);
        const username = await createUsername(<string>first_name, <string>last_name);
        const newUser = new User({ username, first_name, last_name, password, phone });
        await newUser.save();
        const session = await Session.findById(req.session.id);
        req.user.id = newUser.id;
        req.session.issue = "register";
        req.session.is_login = true;
        updateSession(req, res, session, false);
        const user_token = jwt.sign({ session_id: req.session.id }, <string>process.env.JWT_SESSION_KEY);
        response({ res, success: true, sCode: 200, message: "user successfully registred", data: { "x-auth-token": user_token } });
    }

    async login(req: Express.Request, res: Express.Response): Promise<void> {
        let { username, phone, email, password } = req.user;
        const search = (username && { username }) || (phone && { phone }) || (email && { email });
        const user = await User.findOne(search as { username?: string, phone?: string, email?: string }) as UserType;
        if (!user) return response({
            res, success: false, sCode: 404, message: "username or password is wrong!", data: { user: null }, req
        });
        const validPassword = bcrypt.compareSync(<string>password, <string>(<UserType>user).password);
        if (!validPassword) return response({
            res, success: false, sCode: 400, message: "username or password is wrong!", data: { user: null }, req
        });
        const session = await Session.findById(req.session.id);
        req.user.id = user.id;
        req.session.issue = "login";
        req.session.is_login = true;
        updateSession(req, res, session, false);
        const user_token = jwt.sign({ session_id: req.session.id }, <string>process.env.JWT_SESSION_KEY);
        response({ res, success: true, sCode: 200, message: "user successfully loged in", data: { "x-auth-token": user_token } });
    }

})();