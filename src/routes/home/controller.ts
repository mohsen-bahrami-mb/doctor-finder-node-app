// import controllers
import Controller, { response } from "../../controllers";
// import middleware
// import modules types
import Express from "express";

export default new (class extends Controller {
    // make all route logic as middleware function
    // redirect to / (home)
    async redirectToHome(req: Express.Request, res: Express.Response): Promise<void> {
        return response({
            res, success: true, sCode: 301, message: "redirect to / path", data: {},
            req, type: "redirect", view: "/"
        });
    }
    // get / (home)
    async getHome(req: Express.Request, res: Express.Response): Promise<void> {
        return response({ req, res, type: "render", view: "home" });
    }

})();