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
import Tag from "../../models/tag";

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
        const user = await User.findById(req.user.id);
        (<any>user).role.push("doctor");
        doctor = await Doctor.create({ user_id: req.user.id });
        await (<any>user).save();
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
            message: "this user is not a doctor! first made it a doctor, then try it again",
            data: { clinick: null }
        });
        const user = await User.findById(req.user.id);
        (<any>user).role.push("clinick");
        clinick = await Clinick.create({ user_id: req.user.id });
        await (<any>user).save();
        response({ res, success: true, sCode: 200, message: "user successfully registred", data: { clinick } });
    }

    async addCategory(req: Express.Request, res: Express.Response): Promise<void> {
        const doctor = await Doctor.findOne({ user_id: req.user.id });
        if (!doctor) return response({
            req, res, success: false, sCode: 403,
            message: "this user cannot add a category!", data: { category: null }
        });

        const clincik = await Clinick.findOne({ user_id: req.user.id });

        let category = await Category.findOne({
            $or: [
                { name: req.body?.categoryName },
                { _id: req.body?.categoryId }
            ]
        });
        if (!category) {
            return response({
                req, res, success: false, sCode: 404,
                message: "caannot find this category!", data: { category: null }
            });
        }
        category.doctors.push(doctor.id);
        if (clincik) category.clinicks.push(clincik.id);

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
            req, res, success: false, sCode: 403,
            message: "this user is has no category!", data: { deletedCategory: null }
        });

        const category = await Category.findOne({ id: itemId });
        if (!category) return response({
            req, res, success: false, sCode: 404,
            message: `has no category with this id! - ${itemId}`, data: { deletedCategory: null }
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

    async addTag(req: Express.Request, res: Express.Response): Promise<void> {
        const doctor = await Doctor.findOne({ user_id: req.user.id });
        if (!doctor) return response({
            req, res, success: false, sCode: 403,
            message: "this user cannot add a tag!", data: { tag: null }
        });

        const clincik = await Clinick.findOne({ user_id: req.user.id });

        let tag = await Tag.findOne({
            $or: [
                { name: req.body?.tagName },
                { _id: req.body?.tagId }
            ]
        });

        if (!req.body.tagName && !tag) {
            return response({
                req, res, success: false, sCode: 400,
                message: "caannot find this tag! - for create a tag should add 'tagName'",
                data: { tag: null }
            });
        }
        if (!tag) tag = new Tag({ name: req.body.tagName });

        tag.doctors.push(doctor.id);
        if (clincik) tag.clinicks.push(clincik.id);

        doctor.tag.push(tag.id);
        clincik?.tag.push(tag.id);

        await tag.save();
        await doctor.save();
        await clincik?.save();

        response({
            req, res, success: true, sCode: 200,
            message: "successfully added tag for this user",
            data: { tag }
        });
    }

    async deleteTag(req: Express.Request, res: Express.Response): Promise<void> {
        const itemId = req.params.id;
        const doctor = await Doctor.findOne({ user_id: req.user.id });

        if (!doctor) return response({
            req, res, success: false, sCode: 403,
            message: "this user is has no tag!", data: { deletedTag: null }
        });

        const tag = await Tag.findOne({ id: itemId });
        if (!tag) return response({
            req, res, success: false, sCode: 404,
            message: `has no tag with this id! - ${itemId}`, data: { deletedTag: null }
        });

        const clinick = await Clinick.findOne({ user_id: req.user.id });

        const newCatDoctors = tag.doctors.filter((id) => id != doctor.id);
        const newCatClinicks = tag.clinicks.filter((id) => id != clinick?.id);

        const newDoctorTag = doctor.tag.filter((id) => id != tag.id);
        const newClinickTag = clinick?.tag.filter((id) => id != tag.id);

        tag.doctors = newCatDoctors;
        tag.clinicks = newCatClinicks;

        doctor.tag = newDoctorTag;
        if (clinick) clinick.tag = newClinickTag as Mongoose.Types.ObjectId[];

        await tag.save();
        await doctor.save();
        await clinick?.save();

        response({
            req, res, success: true, sCode: 200,
            message: "tag deleted for this user, successfully", data: {
                deletedTag: {
                    id: tag.id,
                    name: tag.name,
                }
            }
        });
    }

})();