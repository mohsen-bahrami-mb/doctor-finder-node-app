// import modules
import express from "express";
import controller from "./controller";
// import middleware modules
// import modules types


const router = express.Router();

router.get("/home", controller.redirectToHome);
router.get("/", controller.getHome);

export default router;

