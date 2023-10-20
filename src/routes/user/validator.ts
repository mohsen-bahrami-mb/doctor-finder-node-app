// import controller
import { checkValidateErr, ValidateErr } from "../../controllers";
// import modules
// import types
import Express from "express";

export default class {
    // make all route validator

    static async addCategory(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let validate = new ValidateErr();
        let err = validate.err;
        let { categoryName } = req.body;
        (async () => {
            validate.checkValidSync(() => typeof categoryName === "string", "categoryName should be an string!");
        })().finally(() => checkValidateErr(req, res, next, err));
        req.user = { ...req.user, ...{ categoryName } };
    }
};