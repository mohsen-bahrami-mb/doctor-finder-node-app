// import modules
import express from "express";
// import routes
import homeRouter from "./home";
import authRouter from "./auth";
import userRouter from "./user";
import searchRouter from "./search";
import categoryRouter from "./category";
import notFoundRouter from "./notFound";
// import anyRouter from "./any";
// import middleware
import errorApp from "../middlewares/error";
import session from "../middlewares/session";
import isLogin from "../middlewares/isLogin";
import isUnknownUser from "../middlewares/isUnknownUser";
import { accessRoute } from "../middlewares/routeControl";
import { isAdmin } from "../middlewares/isPermission";
// import types


const router = express.Router();
// add session to all routes
router.use(session)
// call routers
router.use("/api/", homeRouter);
router.use("/api/auth", isUnknownUser, authRouter);
router.use("/api/user", isLogin, userRouter);
router.use("/api/search", searchRouter);
router.use("/api/category", isAdmin, categoryRouter);
// router.use("/any", anyRouter);

router.use("/*", notFoundRouter);
router.use(errorApp);

export default router;