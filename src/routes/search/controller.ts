// import modules
import Controller from "../../controllers";
// import middleware modules
import { response } from "../../controllers";
// import modules types
import Express from "express";
import Mongoose from "mongoose";
// import models
import Category from "../../models/category";
import Tag from "../../models/tag";
import Doctor from "../../models/doctor";
import User, { userRoleEnum } from "../../models/user";

export default new (class extends Controller {
    // make all route logic as middleware function

    async allCategoryName(req: Express.Request, res: Express.Response): Promise<void> {
        const querySort = Number(req.query.sort) != 1 ? -1 : 1;
        const queryLimit = !isNaN(Number(req.query.limit)) ? Number(req.query.limit) : 100;
        const querySkip = !isNaN(Number(req.query.skip)) ? Number(req.query.skip) : 0;
        const allCategory = await Category.find()
            .select({ _id: 1, name: 1 })
            .sort({ name: querySort })
            .skip(querySkip)
            .limit(queryLimit);
        response({ req, res, success: true, sCode: 200, message: "all category", data: { allCategory } });
    }

    async allTagName(req: Express.Request, res: Express.Response): Promise<void> {
        const querySort = Number(req.query.sort) != 1 ? -1 : 1;
        const queryLimit = !isNaN(Number(req.query.limit)) ? Number(req.query.limit) : 100;
        const querySkip = !isNaN(Number(req.query.skip)) ? Number(req.query.skip) : 0;
        const allTag = await Tag.find()
            .select({ _id: 1, name: 1 })
            .sort({ name: querySort })
            .skip(querySkip)
            .limit(queryLimit);
        response({ req, res, success: true, sCode: 200, message: "all category", data: { allTag } });
    }

    async searchInNames(req: Express.Request, res: Express.Response): Promise<void> {
        const queryDetail: 0 | 1 = Number(req.query.detail) === 1 ? 1 : 0;
        const queryLimit = !isNaN(Number(req.query.limit)) ? Number(req.query.limit) : 100;
        const querySkip = !isNaN(Number(req.query.skip)) ? Number(req.query.skip) : 0;
        const searchName = req.params.name;
        const regex = new RegExp(searchName, "g");

        let result;

        if (queryDetail === 0) {
            const matchCategory = await Category.find({ name: regex })
                .select({ _id: 1, name: 1, doctors: -1, clinicks: -1, articles: -1 })
                .skip(querySkip).limit(queryLimit);
            const matchTag = await Tag.find({ name: regex })
                .select({ _id: 1, name: 1, doctors: -1, clinicks: -1, articles: -1 })
                .skip(querySkip).limit(queryLimit);
            result = { matchCategory, matchTag };
        } else {
            const matchCategory = await searchNameFunc(regex, "category", queryLimit, querySkip);
            const matchTag = await searchNameFunc(regex, "tag", queryLimit, querySkip);
            result = { matchCategory, matchTag };
        }
        if (!result.matchCategory.length && !result.matchTag.length) return response({
            req, res, success: true, sCode: 404, message: "not found any result", data: { ...result }
        });
        response({ req, res, success: true, sCode: 200, message: "all result", data: { ...result } });
    }

    async getCategoryDetail(req: Express.Request, res: Express.Response): Promise<void> {
        const searchId = req.params.id;
        const category = await searchIdFunc(new Mongoose.Types.ObjectId(searchId), "category");

        if (!category.length) return response({
            req, res, success: false, sCode: 404,
            message: `not found this category with this id! - ${searchId}`, data: { category: null }
        });

        response({
            req, res, success: true, sCode: 200,
            message: "find category detail", data: { category: category[0] }
        });
    }

    async getTagDetail(req: Express.Request, res: Express.Response): Promise<void> {
        const searchId = req.params.id;
        const tag = await searchIdFunc(new Mongoose.Types.ObjectId(searchId), "tag");

        if (!tag.length) return response({
            req, res, success: false, sCode: 404,
            message: `not found this tag with this id! - ${searchId}`, data: { tag: null }
        });

        response({
            req, res, success: true, sCode: 200,
            message: "find tag detail", data: { tag: tag[0] }
        });
    }

    async searchInDoctors(req: Express.Request, res: Express.Response): Promise<void> {
        const { first_name, last_name, medical_serial } = req.query;

        const users = await User.find({
            $or: [
                { first_name, role: { $in: [userRoleEnum[3]] } },
                { last_name, role: { $in: [userRoleEnum[3]] } }
            ]
        });
        const usersId = users.map(u => u.id)

        const doctors = await Doctor.find({
            $or: [
                { _id: { $in: usersId } },
                { medical_serial }
            ]
        }).populate("user_id", "-_id -__v -updatedAt -createdAt phone -email -password -verify -birth_date");

        if (!doctors.length) return response({
            req, res, success: false, sCode: 404,
            message: "not found any doctor with this data!", data: { doctors }
        });

        response({
            req, res, success: true, sCode: 200,
            message: "find doctors data", data: { doctors }
        });
    }

})();

async function searchIdFunc(
    searchId: Mongoose.Types.ObjectId,
    modelType: "tag" | "category",
) {
    if (modelType === "category") {
        const category = await Category.aggregate([
            { $match: { _id: searchId } },
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
        ])
        return category;
    }
    if (modelType === "tag") {
        const tag = await Tag.aggregate([
            { $match: { _id: searchId } },
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
        ])
        return tag;
    }
    return [];
}

async function searchNameFunc(
    searchName: RegExp,
    modelType: "tag" | "category",
    limit: number,
    skip: number
) {
    if (modelType === "category") {
        const category = await Category.aggregate([
            { $match: { name: searchName } },
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
        ]).skip(skip).limit(limit);
        return category;
    }
    if (modelType === "tag") {
        const tag = await Tag.aggregate([
            { $match: { name: searchName } },
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
        ]).skip(skip).limit(limit);
        return tag;
    }
    return [];
}