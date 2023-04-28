import express from "express";
import * as UserController from "../controllers/user";

const router = express.Router();

router.get("/", UserController.getAuthenticatedUser);
router.post("/register", UserController.signUp);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);

// router.get("/:noteId", NotesController.getNote);
// router.post("/", NotesController.createNote);
// router.patch("/:noteId", NotesController.updateNote);
// router.delete("/:noteId", NotesController.deleteNote);

export default router;
