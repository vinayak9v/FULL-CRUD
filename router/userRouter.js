import express from "express";
import {
  deleteUser,
  getUser,
  loginUser,
  postUser,
} from "../Controller/userControler.js";

import { userValidate, validate } from "../validatorFn/validator.js";
import { verifyToken } from "../helper/helper.js";

var route = express.Router();

const userRouter = (upload) => {
  route.get("/fetch", getUser);
  route.post(
    "/save",
    upload.single("image"),
    userValidate(),
    validate,
    postUser
  );
  route.post("/login", loginUser);

  route.delete("/delete/:id", deleteUser);

  return route;
};

export default userRouter;
