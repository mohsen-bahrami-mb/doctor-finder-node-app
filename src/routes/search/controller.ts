// import modules
import Controller from "../../controllers";
// import middleware modules
import { response } from "../../controllers";
// import modules types
import Express from "express";
import Mongoose from "mongoose";
// import models
import Category from "../../models/category";
import Doctor from "../../models/doctor";
import User from "../../models/user";

export default new (class extends Controller {
    // make all route logic as middleware function

    async allCategoryName(req: Express.Request, res: Express.Response): Promise<void> {
        const queryNumber = Number(req.query.sort) != 1 ? -1 : 1;
        const querylimit = !Number.isNaN(req.query.sort) ? Number(req.query.sort) : 0;
        const allCategory = await Category.find()
            .select({ _id: 1, name: 1 })
            .sort({ name: queryNumber })
            .limit(querylimit);
        response({ req, res, success: true, sCode: 200, message: "all category", data: { allCategory } });
    }

    async searchInNames(req: Express.Request, res: Express.Response): Promise<void> {
        const searchName = req.params.name;
        const regex = new RegExp(searchName, "g");
        const matchCategory = await Category.find({ name: regex })
            .select({ _id: 1, name: 1, doctors: 0, clinicks: 0 });

        if (!matchCategory.length) return response({
            req, res, success: true, sCode: 204, message: "not found any category", data: { matchCategory }
        });
        response({ req, res, success: true, sCode: 200, message: "all category", data: { matchCategory } });
    }

    async getCategoryDetail(req: Express.Request, res: Express.Response): Promise<void> {
        const searchId = req.params.id;
        const category = await Category.aggregate([
            { $match: { _id: new Mongoose.Types.ObjectId(searchId) } },
            {
                $lookup: {
                    from: "doctors",
                    localField: "doctors",
                    foreignField: "_id",
                    as: "doctors"
                }
            },
            {
                $unwind: "$doctors"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "doctors.user_id",
                    foreignField: "_id",
                    as: "doctors.user"
                }
            },
            {
                $lookup: {
                    from: "clinicks",
                    localField: "clinicks",
                    foreignField: "_id",
                    as: "clinicks"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    clinicks: { $first: "$clinicks" },
                    articles: { $first: "$articles" },
                    doctors: { $push: "$doctors" }
                }
            },
            {
                $project: {
                    "user_id": 0,
                    "updatedAt": 0,
                    "createdAt": 0,
                    "__v": 0,
                    "articles.user_id": 0,
                    "articles.updatedAt": 0,
                    "articles.createdAt": 0,
                    "articles.__v": 0,
                    "clinicks.user_id": 0,
                    "clinicks.updatedAt": 0,
                    "clinicks.createdAt": 0,
                    "clinicks.__v": 0,
                    "doctors.user_id": 0,
                    "doctors.updatedAt": 0,
                    "doctors.createdAt": 0,
                    "doctors.__v": 0,
                    "doctors.user._id": 0,
                    "doctors.user.phone": 0,
                    "doctors.user.email": 0,
                    "doctors.user.national_code": 0,
                    "doctors.user.password": 0,
                    "doctors.user.verify": 0,
                    "doctors.user.birth_date": 0,
                    "doctors.user.location": 0,
                    "doctors.user.updatedAt": 0,
                    "doctors.user.createdAt": 0,
                    "doctors.user.__v": 0,
                }
            }
        ]);

        if (!category || !category.length) return response({
            req, res, success: false, sCode: 404,
            message: `not found this category with this id! - ${searchId}`, data: { category: null }
        });

        response({ req, res, success: true, sCode: 200, message: "find category detail", data: { category } });
    }

})();