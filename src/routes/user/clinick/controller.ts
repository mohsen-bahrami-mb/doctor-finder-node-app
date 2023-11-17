// import modules
import Controller from "../../../controllers";
// import middleware modules
import { response } from "../../../controllers";
// import modules types
import Express from "express";
import Mongoose from "mongoose";
// import models types
import User from "../../../models/user";
import Doctor from "../../../models/doctor";
import Clinick from "../../../models/clinick";
import Visit, { visitStateEnum } from "../../../models/visit";

export default new (class extends Controller {
    // make all route logic as middleware function

    async addDoctor(req: Express.Request, res: Express.Response): Promise<void> {
        const userClinickId = req.user.id as Mongoose.Types.ObjectId;
        const doctorId = new Mongoose.Types.ObjectId(req.params.id);

        const { clinick, doctor } = await checkDoctor8Clinick(req, res, userClinickId, doctorId);
        if (!clinick || !doctor) return;

        clinick.doctors.push(doctor.id);
        await clinick.save();

        response({
            req, res, success: true, sCode: 200,
            message: "doctor successfully added to clinick members", data: { doctorAdded: doctor.id }
        });
    }

    async removeDoctor(req: Express.Request, res: Express.Response): Promise<void> {
        const userClinickId = req.user.id as Mongoose.Types.ObjectId;
        const doctorId = new Mongoose.Types.ObjectId(req.params.id);

        const { clinick, doctor } = await checkDoctor8Clinick(req, res, userClinickId, doctorId);
        if (!clinick || !doctor) return;

        const newDoctorsList = clinick.doctors.filter(d => !d.equals(doctor.id));
        clinick.doctors = newDoctorsList;
        await clinick.save();

        response({
            req, res, success: true, sCode: 200,
            message: "doctor successfully deleted from clinick members", data: { doctorAdded: doctor.id }
        });
    }

    async addRome(req: Express.Request, res: Express.Response): Promise<void> {
        const clinick = await Clinick.findOne({ user_id: req.user.id }).select("-user_id");
        if (!clinick) return response({
            req, res, sCode: 403, success: false,
            message: "this user is not a clinick!", data: { clinick: null }
        });

        const { name, doctors, hour } = req.body;
        doctors.map((d: string) => new Mongoose.Types.ObjectId(d));
        clinick.rome.push({
            id: new Mongoose.Types.ObjectId(),
            name,
            doctors,
            hour
        });
        await clinick.save()

        response({
            req, res, success: true, sCode: 200,
            message: "clinick successfully updated", data: { clinick }
        });
    }

    async editRome(req: Express.Request, res: Express.Response): Promise<void> {
        const clinick = await Clinick.findOne({ user_id: req.user.id }).select("-user_id");
        if (!clinick) return response({
            req, res, sCode: 403, success: false,
            message: "this user is not a clinick!", data: { clinick: null }
        });

        let finedRome = false;
        const { name, hour } = req.body;
        const romeId = new Mongoose.Types.ObjectId(req.params.romeId);

        clinick.rome.map((r) => {
            if (r.id.equals(romeId)) {
                finedRome = true;
                r.name = name;
                r.hour = hour;
            }
        });

        if (!finedRome) return response({
            req, res, sCode: 404, success: false,
            message: "cannot find this rome id!", data: { clinick }
        });

        await clinick.save()

        response({
            req, res, success: true, sCode: 200,
            message: "clinick successfully updated", data: { clinick }
        });
    }

    async removeRome(req: Express.Request, res: Express.Response): Promise<void> {
        const clinick = await Clinick.findOne({ user_id: req.user.id }).select("-user_id");
        if (!clinick) return response({
            req, res, sCode: 403, success: false,
            message: "this user is not a clinick!", data: { clinick: null }
        });

        const romeId = new Mongoose.Types.ObjectId(req.params.romeId);

        let finedRome = false;

        const newRomes = clinick.rome.filter((r) => {
            if (r.id.equals(romeId)) {
                finedRome = true;
                return false;
            }
            else {
                return true;
            }
        });

        if (!finedRome) return response({
            req, res, sCode: 404, success: false,
            message: "cannot find this rome id!", data: { clinick }
        });

        clinick.rome = newRomes;
        await clinick.save()

        response({
            req, res, success: true, sCode: 200,
            message: "clinick successfully updated", data: { clinick }
        });
    }

    async addDoctorToRome(req: Express.Request, res: Express.Response): Promise<void> {
        const romeId = new Mongoose.Types.ObjectId(req.params.romeId);
        const doctorId = new Mongoose.Types.ObjectId(req.params.doctorId);
        const userClinickId = req.user.id as Mongoose.Types.ObjectId;

        const { clinick, doctor } = await checkDoctor8Clinick(req, res, userClinickId, doctorId);
        if (!clinick || !doctor) return;

        let finedRome = false;

        clinick.rome.map((r) => {
            if (r.id.equals(romeId)) {
                finedRome = true;
                r.doctors.forEach(d => {
                    if (d.equals(doctorId)) return response({
                        req, res, sCode: 400, success: false,
                        message: "this doctor id is already in this rome!", data: { clinick }
                    });
                });
                r.doctors.push(doctorId);
            }
        });

        if (!finedRome) return response({
            req, res, sCode: 404, success: false,
            message: "cannot find this rome id!", data: { clinick }
        });

        await clinick.save()

        response({
            req, res, success: true, sCode: 200,
            message: "clinick successfully updated", data: { clinick }
        });
    }

    async removeDoctorFromRome(req: Express.Request, res: Express.Response): Promise<void> {
        const romeId = new Mongoose.Types.ObjectId(req.params.romeId);
        const doctorId = new Mongoose.Types.ObjectId(req.params.doctorId);
        const userClinickId = req.user.id as Mongoose.Types.ObjectId;

        const { clinick, doctor } = await checkDoctor8Clinick(req, res, userClinickId, doctorId);
        if (!clinick || !doctor) return;

        let finedRome = false;

        clinick.rome.map((r) => {
            if (r.id.equals(romeId)) {

                finedRome = true;

                let finedDoctor = false;

                const newDoctors = r.doctors.filter(d => {
                    if (d.equals(doctorId)) {
                        finedDoctor = true;
                        return false;
                    } else {
                        return true;
                    }
                });

                if (!finedDoctor) return response({
                    req, res, sCode: 404, success: false,
                    message: "this doctor id is not in this rome!", data: { clinick }
                });

                r.doctors = newDoctors;
            }
        });

        if (!finedRome) return response({
            req, res, sCode: 404, success: false,
            message: "cannot find this rome id!", data: { clinick }
        });

        await clinick.save()

        response({
            req, res, success: true, sCode: 200,
            message: "clinick successfully updated", data: { clinick }
        });
    }

    async createVisit(req: Express.Request, res: Express.Response): Promise<void> {
        const { rome_id: getRomeId, hour_index, date } = req.body;
        const rome_id = new Mongoose.Types.ObjectId(getRomeId);

        const clinick = await Clinick.findOne({ user_id: req.user.id });
        if (!clinick) return response({
            req, res, sCode: 403, success: false,
            message: "this user is not a clinick!", data: { clinick: null }
        });

        let findRomeIndex: number = -1;
        let findRome: Mongoose.Types.ObjectId | false = false;
        let findHour: number | false = false;

        clinick.rome.forEach((r, i) => {
            if (r.id.equals(rome_id)) {
                findRome = r.id;
                findRomeIndex = i;
                if (r.hour[hour_index] !== undefined) {
                    findHour = Number(hour_index);
                }
            }
        });

        if (findRome === false) return response({
            req, res, success: false, sCode: 404,
            message: `cannot find this rome_id - ${rome_id}`, data: { visit: null }
        });

        if (findHour === false) return response({
            req, res, success: false, sCode: 404,
            message: `cannot find this hour_index - ${hour_index}`, data: { visit: null }
        });

        const visit = await Visit.create({
            doctor_id: clinick?.rome?.[findRomeIndex]?.doctors,
            clinick_id: clinick.id,
            rome_id: findRome,
            hour_index: findHour,
            date: date,
        });

        response({
            req, res, success: true, sCode: 200,
            message: "create visit successfully", data: { visit }
        });
    }

    async changeVisitState(req: Express.Request, res: Express.Response): Promise<void> {
        const visitId = new Mongoose.Types.ObjectId(req.params.visitId);
        const visitStateParam = req.params.state;

        const clinick = await Clinick.findOne({ user_id: req.user.id });
        if (!clinick) return response({
            req, res, sCode: 403, success: false,
            message: "this user is not a clinick!", data: { clinick: null, visit: null }
        });

        const visit = await Visit.findById(visitId);
        if (!visit) return response({
            req, res, sCode: 404, success: false,
            message: `cannot find this vist id! - ${req.params.visitId}`, data: { visit: null }
        });

        switch (visitStateParam) {
            case visitStateEnum[2]:
                // go to 'cancel' mode
                if (visit.state === visitStateEnum[3]) return response({
                    req, res, success: false, sCode: 400,
                    message: "this visit is 'done' before!", data: { visit }
                });
                visit.state = visitStateEnum[2];
                break;

            case visitStateEnum[3]:
                // go to 'done' mode
                if (visit.state === visitStateEnum[2]) return response({
                    req, res, success: false, sCode: 400,
                    message: "this visit is 'cancel' before!", data: { visit }
                });
                visit.state = visitStateEnum[3];
                break;
        }

        await visit.save();

        response({
            req, res, success: true, sCode: 200,
            message: `successfully change visit state to '${visitStateParam}'`, data: { visit }
        });
    }

})();

async function checkDoctor8Clinick(
    req: Express.Request,
    res: Express.Response,
    userClinickId: Mongoose.Types.ObjectId,
    doctorId: Mongoose.Types.ObjectId
) {

    const clinick = await Clinick.findOne({ user_id: userClinickId });
    if (!clinick) {
        response({
            req, res, sCode: 403, success: false,
            message: "this user is not a clinick!", data: { clinick: null, doctor: null }
        });
        return { clinick: null, doctor: null };
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        response({
            req, res, sCode: 404, success: false,
            message: "cannot find user with this user!", data: { clinick: null, doctor: null }
        });
        return { clinick: null, doctor: null };
    }

    return { clinick, doctor };
}