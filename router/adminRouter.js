import {
  getAllUsers,
  getUserContacts,
  updateUserPassword,
  deleteContact,
  updateContact,
} from "../Controller/adminController.js";
import Express from "express";
import { verifyToken } from "../helper/helper.js";
const router = Express.Router();
const adminRouter = (upload) => {
  router.get("/fetch", getAllUsers);
  router.get("/fetch-contact", getUserContacts);
  router.patch("/update-password/:id", updateUserPassword);
  router.patch("/edit-user-profile/:id", upload.single("image"), updateContact);
  router.delete("/delete-contacts/:id", deleteContact);
  return router;
};

export default adminRouter;
