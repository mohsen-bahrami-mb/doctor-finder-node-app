// import controller
import { checkValidateErr, ValidateErr } from "../../controllers";
// import modules
// import types
import Express from "express";
import Mongoose from "mongoose";

export default class {
    // make all route validator

    static async checkId(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let validate = new ValidateErr();
        let err = validate.err;
        const searchId = req.params.id;
        (async () => {
            validate.checkValidSync(
                () => Mongoose.isValidObjectId(searchId),
                "wrong id - set correct id in params!"
            );
        })().finally(() => checkValidateErr(req, res, next, err));
    }
};