import mongoose from "mongoose";

const userModel = mongoose.model(
  "users",
  new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: String,
    password: String,
    cartId: [
      {
        cid: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
      },
    ],
    rol: {
      type: String,
      enum: ["user", "admin", "premium"],
      default: "user",
    },
    status: {
      type: "String",
      enum: ["verified", "not verified"],
      default: "not verified",
    },
    verificationCode: String,
    documents: [
      {
        name: String,
        reference: String,
      },
    ],
    last_connection: {
      type: Date,
      default: null,
    },
    ticketId: [
      {
        tic: {type: mongoose.Schema.Types.ObjectId,ref: "tickets"}
      }
    ],
  })
);

export default userModel;
