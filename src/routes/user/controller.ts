// import modules
import Controller from "../../controllers";
// import middleware modules
import { response } from "../../controllers";
import Mongoose from "mongoose";
// import modules types
import Express from "express";
// import models types
import User from "../../models/user";
import Doctor from "../../models/doctor";
import Clinick from "../../models/clinick";
import Category from "../../models/category";

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

    async addCategory(req: Express.Request, res: Express.Response): Promise<void> {
        const doctor = await Doctor.findOne({ user_id: req.user.id });
        if (!doctor) return response({
            req, res, success: false, sCode: 403, message: "this user cannot add a category!", data: {}
        });

        const clincik = await Clinick.findOne({ user_id: req.user.id });

        let category = await Category.findOne({ name: req.body?.categoryName }).or([{ id: req.body?.categoryId }]);
        if (!category) {
            return response({
                req, res, success: false, sCode: 404, message: "caannot find this category!", data: {}
            });
        } else {
            category = await new Category({
                name: req.body.categoryName,
                doctors: [doctor.id],
                clinicks: [clincik?.id]
            });
        }
        category.doctors.push(doctor.id);
        category.clinicks.push(clincik?.id);

        doctor.category.push(category.id);
        clincik?.category.push(category.id);

        await category.save();
        await doctor.save();
        await clincik?.save();

        response({
            req, res, success: true, sCode: 200,
            message: "successfully added category for this user",
            data: { category }
        });
    }

    async deleteCategory(req: Express.Request, res: Express.Response): Promise<void> {
        const itemId = req.params.id;
        const doctor = await Doctor.findOne({ user_id: req.user.id });

        if (!doctor) return response({
            req, res, success: false, sCode: 403, message: "this user is has no category!"
        });

        const category = await Category.findOne({ id: itemId });
        if (!category) return response({
            req, res, success: false, sCode: 404,
            message: "has no category with this name!", data: { notFound: itemId }
        });

        const clinick = await Clinick.findOne({ user_id: req.user.id });

        const newCatDoctors = category.doctors.filter((id) => id != doctor.id);
        const newCatClinicks = category.clinicks.filter((id) => id != clinick?.id);

        const newDoctorCategory = doctor.category.filter((id) => id != category.id);
        const newClinickCategory = clinick?.category.filter((id) => id != category.id);

        category.doctors = newCatDoctors;
        category.clinicks = newCatClinicks;

        doctor.category = newDoctorCategory;
        if (clinick) clinick.category = newClinickCategory as Mongoose.Types.ObjectId[];

        await category.save();
        await doctor.save();
        await clinick?.save();

        response({
            req, res, success: true, sCode: 200,
            message: "category deleted for this user, successfully", data: {
                deletedCategory: {
                    id: category.id,
                    name: category.name,
                }
            }
        });
    }

})();