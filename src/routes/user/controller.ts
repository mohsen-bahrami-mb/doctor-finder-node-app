// import modules
import Controller from "../../controllers";
// import middleware modules
import { response } from "../../controllers";
// import modules types
import Express from "express";
// import models types
import User from "../../models/user";
import Doctor from "../../models/doctor";
import Clinick from "../../models/clinick";

export default new (class extends Controller {
    // make all route logic as middleware function

    async getProfile(req: Express.Request, res: Express.Response): Promise<void> {
        const user = await User.findById(req.user.id).select({ password: 0, _id: 0 });
        const doctor = await Doctor.findOne({ user_id: req.user.id }).select({ _id: 0, user_id: 0 });
        const clinick = await Clinick.findOne({ user_id: req.user.id }).select({ _id: 0, user_id: 0 });
        response({ res, success: true, sCode: 200, message: "user successfully registred", data: { user, doctor, clinick } });
    }

    async madeToDoctorRole(req: Express.Request, res: Express.Response): Promise<void> {
        let doctor = await Doctor.findOne({ user_id: req.user.id }).select({ _id: 0, user_id: 0 });
        if (doctor) return response({
            res, success: false, sCode: 409, message: "this user is already doctor!", data: { doctor }
        });
        doctor = await Doctor.create({ user_id: req.user.id });
        response({ res, success: true, sCode: 200, message: "user successfully registred", data: { doctor } });
    }

    async madeToClinickRole(req: Express.Request, res: Express.Response): Promise<void> {
        let clinick = await Clinick.findOne({ user_id: req.user.id }).select({ _id: 0, user_id: 0 });
        if (clinick) return response({
            res, success: false, sCode: 409, message: "this user is already clinick!", data: { clinick }
        });
        let doctor = await Doctor.findOne({ user_id: req.user.id }).select({ _id: 0, user_id: 0 });
        if (!doctor) return response({
            res, success: false, sCode: 400,
            message: "this user is not a doctor! first made it a doctor, then try it again", data: {}
        });
        clinick = await Clinick.create({ user_id: req.user.id });
        response({ res, success: true, sCode: 200, message: "user successfully registred", data: { clinick } });
    }

})();