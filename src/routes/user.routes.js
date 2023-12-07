import { Router } from "express";
import passport from "passport";
import {
  userPremium,
  uploadDocuments,
  uploadDocumentView,
  getUsers,
} from "../controllers/users.controllers.js";
import upload from "../middlewares/multer.js";

const router = Router();

router.get(
  "/premium/:uid",
  passport.authenticate("jwt", { session: false }),
  userPremium
);

router.post(
  "/api/users/:uid/documents",
  passport.authenticate("jwt", { session: false }),
  upload.array("document", 5),
  uploadDocuments
);

router.get("/", passport.authenticate("jwt", { session: false }), getUsers);

router.get(
  "/uploadDocuments",
  passport.authenticate("jwt", { session: false }),
  uploadDocumentView
);

export default router;
