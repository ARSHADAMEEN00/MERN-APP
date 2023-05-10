import express from "express";
import * as UserController from "../controllers/user";

const router = express.Router();

router.get("/:type", UserController.getAllUsers);
router.get("/:userId", UserController.getUserDetails);
router.post("/create", UserController.createUser);
router.put("/update/:userId", UserController.updateUser);
router.patch("/update/:userId", UserController.updateUser);
router.delete("/delete/:userId", UserController.deleteUser);




export default router;
