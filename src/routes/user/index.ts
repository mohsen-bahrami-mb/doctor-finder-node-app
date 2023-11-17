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
// ادیت پروفایل مانده
router.get("/madeToDoctorRole", controller.madeToDoctorRole);
router.get("/madeToClinickRole", controller.madeToClinickRole);

router.post("/addCategory", validator.addCategory, controller.addCategory);
router.delete("/deleteCategory/:id", validator.checkId, controller.deleteCategory);

router.post("/addTag", validator.addTag, controller.addTag);
router.delete("/deleteTag/:id", validator.checkId, controller.deleteTag);

router.get("/setVisit/:id", validator.checkId, controller.setVisit);
router.get("/myVisits", validator.addCategory, controller.myVisits);

router.use("/doctor", doctorRouter);
router.use("/clinick", clinickRouter);

export default router;

