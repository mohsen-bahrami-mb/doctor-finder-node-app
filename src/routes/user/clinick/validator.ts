// import controller
import { checkValidateErr, ValidateErr } from "../../../controllers";
// import modules
// import types
import Express from "express";

export default class {
    // make all route validator

    static async anyValidator(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let validate = new ValidateErr();
        let err = validate.err;
        let { first_name, last_name, password, phone } = req.body;
        (async () => {
            validate.checkValidSync(() => true, "");
        })().finally(() => checkValidateErr(req, res, next, err));
        req.user = { ...req.user, ...{ first_name, last_name, password, phone } };
    }
};