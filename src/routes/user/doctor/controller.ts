// import modules
import Controller from "../../../controllers";
// import middleware modules
import { response } from "../../../controllers";
// import modules types
import Express from "express";
// import models types
import User from "../../../models/user";
import Doctor from "../../../models/doctor";

export default new (class extends Controller {
    // make all route logic as middleware function

    async getAny(req: Express.Request, res: Express.Response): Promise<void> {

        // response({ res, success: true, sCode: 200, message: "user successfully registred", data: { user, doctor } });
    }


})();