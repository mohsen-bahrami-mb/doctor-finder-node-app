// import controller
import { checkValidateErr, ValidateErr } from "../../controllers";
// import modules
import { isValidObjectId } from "mongoose";
// import types
import Express from "express";

export default class {
    // make all route validator

    static async addCategory(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let validate = new ValidateErr();
        let err = validate.err;
        let { categoryName, categoryId } = req.body;
        (async () => {
            if (categoryId)
                validate.checkValidSync(() => isValidObjectId(categoryId), "wrong categoryId format!");
            if (categoryName)
                validate.checkValidSync(() => typeof categoryName === "string", "categoryName should be an string!");
        })().finally(() => checkValidateErr(req, res, next, err));
    }

};