import express from "express";
import {
  deleteContact,
  getContact,
  saveContact,
  updateContact,
  uploadExcel,
} from "../Controller/contactController.js";

import { verifyToken } from "../helper/helper.js";

var route = express.Router();

const contactRouter = (upload) => {
  route.get("/fetch", verifyToken, getContact);
  route.post("/save", upload.single("profile"), verifyToken, saveContact);
  route.delete("/delete/:id", verifyToken, deleteContact);
  route.patch(
    "/update/:id",
    verifyToken,
    upload.single("profile"),
    updateContact
  );
  route.post(
    "/save-excel-sheet",
    upload.single("excel"),
    verifyToken,
    uploadExcel
  );

  return route;
};

export default contactRouter;
