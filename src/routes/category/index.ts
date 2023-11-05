// import modules
import express from "express";
import controller from "./controller";
import validator from "./validator";
// import middleware modules
// import modules types


const router = express.Router();

router.post("/adminCreateCategory", validator.adminCreateCategory, controller.adminCreateCategory);
router.get("/adminRemoveCategory/:id", validator.adminRemoveCategory, controller.adminRemoveCategory);

export default router;

