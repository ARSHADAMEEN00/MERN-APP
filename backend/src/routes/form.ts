import express from "express";
import * as FromController from "../controllers/form";

const router = express.Router();

router.get("/", FromController.getFormData);
router.post("/create", FromController.createForm);


export default router;
