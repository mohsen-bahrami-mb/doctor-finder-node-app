// import controller
import { checkValidateErr, ValidateErr } from "../../controllers";
// import modules
// import types
import Express from "express";

export default class {
    // make all route validator

    static async registerValidator(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let validate = new ValidateErr();
        let err = validate.err;
        let { first_name, last_name, password, phone } = req.body;
        (async () => {
            validate.checkValidSync(() => first_name && true, "first_name is required!");
            validate.checkValidSync(() => typeof first_name === "string", "first_name should be an string!");
            validate.checkValidSync(() => first_name?.length > 3 && first_name?.length < 100, "first_name should be between 3 and 100 letter!");
            validate.checkValidSync(() => last_name && true, "last_name is required!");
            validate.checkValidSync(() => typeof last_name === "string", "last_name should be an string!");
            validate.checkValidSync(() => last_name?.length > 3 && last_name?.length < 100, "last_name should be between 3 and 100 letter!");
            validate.checkValidSync(() => password && true, "password is required!");
            validate.checkValidSync(() => password.length >= 6, "password characters must be at least 6 characters!");
            validate.checkValidSync(() => phone && true, "phone is required!");
            validate.checkValidSync(() => (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gmi).test(phone), "phone format is not valid!");
        })().finally(() => checkValidateErr(req, res, next, err));
        req.user = { ...req.user, ...{ first_name, last_name, password, phone } };
    }

    static async loginValidator(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let validate = new ValidateErr();
        let err = validate.err;
        let { username, phone, email, password } = req.body;
        let usernameValidateMSG: string = "";
        function usernameValidate(): boolean {
            let usernameCounter = 0;
            username && usernameCounter++;
            phone && usernameCounter++;
            email && usernameCounter++;
            if (usernameCounter !== 1) {
                usernameValidateMSG = "just send one of these: username, phone, email";
                return false;
            }
            if (phone && !(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gmi).test(phone)) {
                usernameValidateMSG = "phone format is not valid!";
                return false;
            }
            if (email && !(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm).test(email)) {
                usernameValidateMSG = "phone format is not valid!";
                return false;
            }
            return true;
        }
        (async () => {
            validate.checkValidSync(() => usernameValidate(), usernameValidateMSG);
            validate.checkValidSync(() => password && true, "password is required!");
            validate.checkValidSync(() => password.length >= 6, "password characters must be at least 6 characters!");
        })().finally(() => checkValidateErr(req, res, next, err));
        req.user = { ...req.user, ...{ username, phone, email, password } };
    }
};