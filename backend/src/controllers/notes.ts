import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";
// import { assertsIsDefined } from "../util/assertsIsDefined";


export const getNotes: RequestHandler = async (req, res, next) => {
  const userId = req.body.userId;
  const page = req.query.page
  const search = req.query.search
  const limit = req.query.limit || '10'
  const maxCount = req.query.maxCount
  const minCount = req.query.minCount
  const type = req.params.type

  const d = new Date()
  // const from = req.query.from
  // const to = req.query.to


  const queryData: any = {
    $or: [
      { title: { $regex: search ? search : "", $options: "i" } },
    ]

    // { letterCount: { $gte: 50 } }
    //   { letterCount: { $lt: maxCount } },
    //   { letterCount: { $gt: minCount } }
    // letterCount: { '$gt': minCount, '$lt': maxCount },
    // $or: [{ letterCount: { $gt: minCount ? minCount : 0 } }, { letterCount: { $in: [12, 37] } }]
  }
  if (userId) {
    queryData["userId"] = userId;
  }

  if (maxCount) {
    queryData['letterCount'] = { "$lte": maxCount ? maxCount : 0 }
  }

  if (minCount) {
    queryData['letterCount'] = { "$gte": minCount ? minCount : 0 }
  }

  if (maxCount && minCount) {
    queryData['letterCount'] = { '$gte': minCount, '$lte': maxCount }
  }

  // if (type === 'recent') {
  //   queryData['createdAt'] = { "$lt": new Date(), $gt: new Date(d.getFullYear() + ',' + d.getMonth() + ',' + d.getDate()) }
  // }

  // created: { $lt: new Date(), $gt: new Date(year+','+month+','+day) }

  try {
    // assertsIsDefined(authenticatedUserId)
    const notes = await NoteModel.find(queryData).sort({ title: 1 }).limit(Number(limit)).skip((Number(page ? page : 1) - 1) * Number(limit)).exec();

    if (type === 'recent') {
      // NoteModel.aggregate(['createdAt':{'$gte':  d.setDate(d.getDate() - 1), '$lte':  new Date() }])
    }


    // const notes = await NoteModel.find().exec();
    res.status(200).json(notes);

  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const userId = req.body.userId;

  try {
    // assertsIsDefined(authenticatedUserId)

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "invalid note id");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (note?.userId.toString() !== userId) {
      throw createHttpError(404, "You do not have access to this note");
    }

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    // if (!note.userId.equals(authenticatedUserId)) {
    //   throw createHttpError(401, "You cannot access this note!")
    // }
    res.status(200).json(note);

  } catch (error) {
    console.error(error);
    next(error);
  }
};

interface CreateNoteBody {
  title?: string;
  text?: string;
  letterCount?: number;
  userId: string
}

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;
  const letterCount = req.body.letterCount;

  const userId = req.body.userId;

  try {
    // assertsIsDefined(authenticatedUserId)

    if (!title) {
      throw createHttpError(400, "note must have a title");
    }
    const newNotes = await NoteModel.create({
      userId,
      title,
      text,
      letterCount
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
  userId: string
  letterCount?: number
}
interface UpdateNoteParams {
  noteId: string;
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
  const newTitle = req.body.title;
  const newText = req.body.text;
  const newLetterCount = req.body.letterCount;
  const noteId = req.params.noteId;
  const userId = req.body.userId;

  try {
    // assertsIsDefined(authenticatedUserId)

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "invalid note id");
    }

    if (!newTitle) {
      throw createHttpError(400, "note must have a title");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (note?.userId.toString() !== userId) {
      throw createHttpError(404, "You do not have access to this note");
    }

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    // if (!note.userId.equals(authenticatedUserId)) {
    //   throw createHttpError(401, "You cannot access this note!")
    // }

    note.title = newTitle;
    note.text = newText;
    note.letterCount = newLetterCount;

    const updateNote = await note.save();

    // const note = await NoteModel.updateOne(
    //   { _id: noteId },
    //   {
    //     title: newTitle,
    //     text: newText,
    //   }
    // );



    //another method
    // const updateNote = await NoteModel.findByIdAndUpdate(
    //   { _id: noteId },
    //   {
    //     title: newTitle,
    //     text: newText,
    //   }
    // );
    res.status(200).json(updateNote);

  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const userId = req.body.userId;

  // const authenticatedUserId = req.session.userId;

  try {
    // assertsIsDefined(authenticatedUserId)

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "invalid note id");
    }

    const note = await NoteModel.findByIdAndDelete(noteId)

    if (note?.userId.toString() !== userId) {
      throw createHttpError(404, "You do not have access to this note");
    }

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    // if (!note.userId.equals(authenticatedUserId)) {
    //   throw createHttpError(401, "You cannot access this note!")
    // }


    // const note = await NoteModel.findById(noteId).exec();
    // note.remove()

    res.status(204).json({
      noteId: noteId
    })
  } catch (error) {
    console.error(error);
    next(error);
  }
};
