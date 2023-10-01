// import modules
import express from "express";
import controller from "./controller";
import validator from "./validator";
// import middleware modules
// import modules types


const router = express.Router();

router.get("/profile",
    controller.getProfile
);

export default router;

