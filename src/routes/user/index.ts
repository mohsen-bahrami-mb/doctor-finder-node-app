// import routes
import doctorRouter from "./doctor";
import clinickRouter from "./clinick";
// import modules
import express from "express";
import controller from "./controller";
import validator from "./validator";
// import middleware modules
// import modules types


const router = express.Router();

router.get("/profile", controller.getProfile);
router.get("/madeToDoctorRole", controller.madeToDoctorRole);
router.get("/madeToClinickRole", controller.madeToClinickRole);

router.post("/addCategory", validator.addCategory, controller.addCategory);
router.delete("/deleteCategory/:id", controller.deleteCategory);

router.use("/doctor", doctorRouter);
router.use("/clincik", clinickRouter);

export default router;

