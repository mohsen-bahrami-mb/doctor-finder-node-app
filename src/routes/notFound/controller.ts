// import modules
import Controller from "../../controllers";
// import middleware modules
import { response } from "../../controllers";
// import modules types
import Express from "express";

export default new (class extends Controller {
    // make all route logic as middleware function

    async notFound(req: Express.Request, res: Express.Response): Promise<void> {
        response({
            res, success: false, sCode: 404, message: "not found page!",
            data: { not_found_address: req.originalUrl },
            req,
            // type: "redirect-nodb", view: "/notFound"
        });
    }

})();