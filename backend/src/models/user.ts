import { Document, InferSchemaType, Schema, model } from "mongoose";

// export type UserDocument = Document & {
//   username: string;
//   email: string;
//   password: string;
//   googleId: string;
// };

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String
    },
    googleId: {
      type: String
    },
  }
);

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
