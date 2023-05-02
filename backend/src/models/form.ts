import { InferSchemaType, Schema, model } from "mongoose";


const formSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    idType: {
      type: String,
    },
    idNumber: {
      type: String,
    },
    guardianLabel: {
      type: String,
    },
    guardianName: {
      type: String,
    },
    email: {
      type: String,
    },
    emergencyContact: {
      type: String,
    },
    address: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    pinCode: {
      type: String,
    },
    country: {
      type: String,
    },
    occupation: {
      type: String,
    },
    religion: {
      type: String,
    },
    maritalStatus: {
      type: String,
    },
    bloodGroup: {
      type: String,
    },
    nationality: {
      type: String,
    },

  }
);

type From = InferSchemaType<typeof formSchema>;

export default model<From>("Form", formSchema);
