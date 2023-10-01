// import modules
import express from "express";
import controller from "./controller";
import validator from "./validator";
// import middleware modules
// import modules types


const router = express.Router();

router.get("/profile", controller.getProfile);
router.get("/made-to-doctor-role", controller.madeToDcotorRole);

export default router;

