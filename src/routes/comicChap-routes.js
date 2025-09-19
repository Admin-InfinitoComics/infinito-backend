import express from "express";
import upload from "../middleware/multer.js";

import{
    createChapter,
    getChaptersByComicId,
    deleteChapter,
    updateChapter
} from '../controller/comicChap-controller.js'

import { adminauthenticate } from "../middleware/adminauth.js";

const router = express.Router();

router.post("/:comicId/chapters", adminauthenticate, upload.fields([
  { name: "chapterImage", maxCount: 1 },
  { name: "chapterPdf", maxCount: 1 },
]), createChapter);

router.get("/:comicId/chapters", getChaptersByComicId);

router.delete("/:comicId/chapters/:chapterId", deleteChapter)

router.put("/:comicId/chapters/:chapterId", adminauthenticate, upload.fields([
    { name: "chapterImage", maxCount: 1 },
    { name: "chapterPdf", maxCount: 1 },
  ]),
  updateChapter
);

export default router;