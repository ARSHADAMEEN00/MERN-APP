import { InferSchemaType, Schema, model } from "mongoose";
import mongoose from 'mongoose';
// import AutoIncrementFactory from 'mongoose-sequence';

// const AutoIncrement = AutoIncrementFactory(mongoose as any);

const noteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    title: {
      type: String,
      required: true,
    },
    text: { type: String },
    letterCount: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    isSaved: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);



// noteSchema.plugin(AutoIncrement as any, {
//   inc_field: 'ticket',
//   id: 'ticketNumbs',
//   start_seq: 500
// })


type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>("Note", noteSchema);
