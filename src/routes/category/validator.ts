// import controller
import { ValidateErr, checkValidateErr } from "../../controllers";
// import modules
// import types
import Mongoose from "mongoose";
import Express from "express";

export default class {
    // make all route validator

    static async adminCreateCategory(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let validate = new ValidateErr();
        let err = validate.err;
        let { categoryName } = req.body;
        (async () => {
            validate.checkValidSync(() => categoryName && true, "categoryName is not exist!");
            validate.checkValidSync(() => typeof categoryName === "string", "categoryName should be an string!");
        })().finally(() => checkValidateErr(req, res, next, err));
    }

    static async adminRemoveCategory(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let validate = new ValidateErr();
        let err = validate.err;
        let itemId = req.params.id;
        (async () => {
            validate.checkValidSync(() => typeof itemId != "undefined" && itemId != null, "id is not exist!");
            validate.checkValidSync(() => Mongoose.isValidObjectId(itemId), "invalid id!");
        })().finally(() => checkValidateErr(req, res, next, err));
    }

};