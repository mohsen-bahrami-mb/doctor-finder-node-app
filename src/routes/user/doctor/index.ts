// import modules
import express from "express";
import controller from "./controller";
import userController from "../controller";
import validator from "./validator";
// import middleware modules
// import modules types


const router = express.Router();

router.post("/addCategory", userController.addCategory);

export default router;

