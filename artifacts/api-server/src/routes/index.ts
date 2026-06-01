import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import postsRouter from "./posts";
import bannersRouter from "./banners";
import settingsRouter from "./settings";
import associatesRouter from "./associates";
import storageRouter from "./storage";
import sponsorsRouter from "./sponsors";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(postsRouter);
router.use(bannersRouter);
router.use(settingsRouter);
router.use(associatesRouter);
router.use(storageRouter);
router.use(sponsorsRouter);
router.use(uploadRouter);

export default router;
