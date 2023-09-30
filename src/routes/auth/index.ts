// import modules
import express from "express";
import controller from "./controller";
import validator from "./validator";
// import middleware modules
// import modules types


const router = express.Router();

router.post("/register",
    validator.registerValidator,
    controller.register
);

router.post("/login",
    validator.loginValidator,
    controller.login
);

export default router;

