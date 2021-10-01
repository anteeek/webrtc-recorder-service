import { Router } from "express";
import { recorderRouter } from "./recorder";

const router = Router();

router.use(recorderRouter);

export default router;
