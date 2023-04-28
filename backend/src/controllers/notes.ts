import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertsIsDefined } from "../util/assertsIsDefined";

export const getNotes: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {
    assertsIsDefined(authenticatedUserId)

    const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;

  try {
    assertsIsDefined(authenticatedUserId)

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "invalid note id");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note!")
    }

    res.status(200).json(note);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

interface CreateNoteBody {
  title?: string;
  text?: string;
}

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;
  const authenticatedUserId = req.session.userId;

  try {
    assertsIsDefined(authenticatedUserId)

    if (!title) {
      throw createHttpError(400, "note must have a title");
    }
    const newNotes = await NoteModel.create({
      userId: authenticatedUserId,
      title,
      text,
    });
    res.status(201).json(newNotes);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

interface UpdateNoteBody {
  title?: string;
  text?: string;
}
interface UpdateNoteParams {
  noteId: string;
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
  const newTitle = req.body.title;
  const newText = req.body.text;
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;

  try {
    assertsIsDefined(authenticatedUserId)

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "invalid note id");
    }

    if (!newTitle) {
      throw createHttpError(400, "note must have a title");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note!")
    }

    // note.title = newTitle;
    // note.text = newText;

    // const updateNote = await note.save();

    // const note = await NoteModel.updateOne(
    //   { _id: noteId },
    //   {
    //     title: newTitle,
    //     text: newText,
    //   }
    // );



    //another method
    const updateNote = await NoteModel.findByIdAndUpdate(
      { _id: noteId },
      {
        title: newTitle,
        text: newText,
      }
    );
    res.status(200).json(updateNote);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;

  try {
    assertsIsDefined(authenticatedUserId)

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "invalid note id");
    }

    const note = await NoteModel.findByIdAndDelete(noteId)

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note!")
    }


    // const note = await NoteModel.findById(noteId).exec();
    // note.remove()

    res.sendStatus(204)
  } catch (error) {
    console.error(error);
    next(error);
  }
};
