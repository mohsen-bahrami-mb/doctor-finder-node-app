// import controller
import { isValidObjectId } from "mongoose";
import { checkValidateErr, ValidateErr } from "../../../controllers";
// import modules
import { visitStateEnum } from "../../../models/visit";
// import types
import Express from "express";

export default class {
    // make all route validator

    static async checkId(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let validate = new ValidateErr();
        let err = validate.err;
        const searchId = req.params.id;
        (async () => {
            validate.checkValidSync(() => isValidObjectId(searchId), "wrong id - set correct id in params!");
        })().finally(() => checkValidateErr(req, res, next, err));
    }

    static async addRome(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let validate = new ValidateErr();
        let err = validate.err;
        const { name, doctors, hour } = req.body;
        (async () => {
            validate.checkValidSync(() => typeof name === "string", "name should be an string!");
            validate.checkValidSync(() => checkArrayId(doctors), "wrong doctors id - set correct id in 'doctors' array!");
            validate.checkValidSync(() => checkArrayHour(hour), "wrong hour structure!");
        })().finally(() => checkValidateErr(req, res, next, err));
    }

    static async editRome(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let validate = new ValidateErr();
        let err = validate.err;
        const { name, hour } = req.body;
        (async () => {
            validate.checkValidSync(() => typeof name === "string", "name should be an string!");
            validate.checkValidSync(() => checkArrayHour(hour), "wrong hour structure!");
        })().finally(() => checkValidateErr(req, res, next, err));
    }

    static async checkRome8doctorId(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let validate = new ValidateErr();
        let err = validate.err;
        const romeId = req.params.romeId;
        const doctorId = req.params.doctorId;
        (async () => {
            validate.checkValidSync(() => isValidObjectId(romeId), "wrong rome id - set correct id in params!");
            validate.checkValidSync(() => isValidObjectId(doctorId), "wrong doctor id - set correct id in params!");
        })().finally(() => checkValidateErr(req, res, next, err));
    }

    static async createVisit(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let validate = new ValidateErr();
        let err = validate.err;
        const { rome_id, hour_index, date } = req.body;
        (async () => {
            validate.checkValidSync(() => isValidObjectId(rome_id), "wrong rome_id - set correct id!");
            validate.checkValidSync(() => !isNaN(Number(hour_index)), "wrong hour_index - is not a number!");
            validate.checkValidSync(() => !isNaN(new Date(date).getTime()), "wrong date - is not a correct format!");
        })().finally(() => checkValidateErr(req, res, next, err));
    }

    static async changeVisitState(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let validate = new ValidateErr();
        let err = validate.err;
        const state = req.params.state;
        const visitId = req.params.visitId;
        (async () => {
            validate.checkValidSync(
                () => state === visitStateEnum[2] || state === visitStateEnum[3],
                `wrong state param - it should be ${visitStateEnum[2]} or ${visitStateEnum[3]}!`
            );
            validate.checkValidSync(() => isValidObjectId(visitId), "wrong visit id - set correct id in params!");
        })().finally(() => checkValidateErr(req, res, next, err));
    }

};

const checkArrayId = (array: any) => {
    let result = true;
    Array.from(array).forEach((item: unknown) => {
        const check = isValidObjectId(item);
        if (!check) {
            result = false;
            return;
        }
    });
    return result;
};

const checkArrayHour = (array: any) => {
    let result = true;
    Array.from(array).forEach((item: any) => {
        const itemKeys = Object.keys(item);
        if (itemKeys.indexOf("start") !== -1 || itemKeys.indexOf("end") !== -1 || itemKeys.length !== 2) {
            result = false;
            return;
        }
        if (typeof item.start !== "string" || typeof item.end !== "string") {
            result = false;
            return;
        }
    });
    return result;
};