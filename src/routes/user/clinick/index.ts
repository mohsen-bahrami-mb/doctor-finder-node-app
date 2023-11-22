// import modules
import express from "express";
import controller from "./controller";
import validator from "./validator";
// import middleware modules
// import modules types


const router = express.Router();

router.get("/addDoctor/:id", validator.checkId, controller.addDoctor);
router.delete("/removeDoctor/:id", validator.checkId, controller.removeDoctor);

router.post("/addRome", validator.addRome, controller.addRome);
router.put("/editRome/:id", validator.editRome, controller.editRome);
router.delete("/removeRome/:id", validator.checkId, controller.removeRome);
router.get("/addDoctorToRome/:romeId/:doctorId", validator.checkRome8doctorId, controller.addDoctorToRome);
router.delete("/removeDoctorFromRome/:romeId/:doctorId", validator.checkRome8doctorId, controller.removeDoctorFromRome);

router.post("/visit/create", validator.createVisit, controller.createVisit);
router.get("/visit/:state/:visitId", validator.changeVisitState, controller.changeVisitState);

export default router;

