// import modules
import express from "express";
import controller from "./controller";
// import middleware modules
// import modules types


const router = express.Router();

router.get("/allCategoryName", controller.allCategoryName);
router.get("/allTagName", controller.allTagName);
router.get("/searchInNames/:name", controller.searchInNames);   // add city in future
router.get("/getCategoryDetail/:id", controller.getCategoryDetail);
router.get("/getTagDetail/:id", controller.getTagDetail);

// router.get("/allCityName", controller.allCategoryName);
// router.get("/getCityDetail/:id", controller.getCategoryDetail);

export default router;

