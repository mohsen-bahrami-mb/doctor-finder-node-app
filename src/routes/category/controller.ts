// import modules
import Controller from "../../controllers";
// import middleware modules
import { response } from "../../controllers";
// import modules types
import Express from "express";
// import models
import Category from "../../models/category";
import Doctor from "../../models/doctor";
import Clinick from "../../models/clinick";
import Article from "../../models/article";
import User from "../../models/user";

export default new (class extends Controller {
    // make all route logic as middleware function

    async adminCreateCategory(req: Express.Request, res: Express.Response): Promise<void> {
        let category = await Category.findOne({ name: req.body.categoryName });
        if (category) return response({
            req, res, success: false, sCode: 400, message: "this category is already existed!", data: { category }
        });

        category = await Category.create({ name: req.body.categoryName });

        response({
            req, res, success: true, sCode: 200,
            message: "successfully create category for this user",
            data: { category }
        });
    }

    async adminRemoveCategory(req: Express.Request, res: Express.Response): Promise<void> {
        const itemId = req.params.id;

        const category = await Category.findById(itemId);
        if (!category) return response({
            req, res, success: false, sCode: 404,
            message: "not found this category!", data: { notFound: itemId }
        });

        await category.deleteOne();

        await Doctor.updateMany(
            { _id: { $in: category.doctors } },
            { $pull: { category: { $in: [category.id] } } }
        );

        await Clinick.updateMany(
            { _id: { $in: category.clinicks } },
            { $pull: { category: { $in: [category.id] } } }
        );

        await Article.updateMany(
            { _id: { $in: category.articles } },
            { $pull: { category: { $in: [category.id] } } }
        );

        response({
            req, res, success: true, sCode: 200,
            message: "category removed on database", data: { deletedCategory: category }
        });
    }

})();