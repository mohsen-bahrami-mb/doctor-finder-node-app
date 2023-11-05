// import modules
import express from "express";
import controller from "./controller";
// import middleware modules
// import modules types


const router = express.Router();

router.get("/allCategoryName", controller.allCategoryName);
router.get("/searchInNames/:name", controller.searchInNames);
router.get("/getCategoryDetail/:id", controller.getCategoryDetail);

export default router;

