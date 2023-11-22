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

    static async searchInDoctors(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let validate = new ValidateErr();
        let err = validate.err;
        const { first_name, last_name, medical_serial } = req.query;
        (async () => {
            validate.checkValidSync(
                () => typeof first_name !== "undefined" && typeof first_name === "string",
                "first_name suold be exist and should be an string!"
            );
            validate.checkValidSync(
                () => typeof last_name !== "undefined" && typeof last_name === "string",
                "last_name suold be exist and should be an string!"
            );
            validate.checkValidSync(
                () => typeof medical_serial !== "undefined" && typeof medical_serial === "string",
                "medical_serial suold be exist and should be an string!"
            );
        })().finally(() => checkValidateErr(req, res, next, err));
    }
};