import chapServices from '../services/comicChap-service.js';
import { uploadToS3 } from "../utils/aws.js";

const comicChapServices = new chapServices();

export const createChapter = async (req, res) => {
  try {
    const { chapNum, title, releaseDate } = req.body;
    const { comicId } = req.params;

    if (!chapNum || !title || !releaseDate) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
    if (!req.files?.chapterImage || !req.files?.chapterPdf) {
      return res.status(400).json({ success: false, message: "Both image and PDF are required." });
    }

    const comic = await comicChapServices.getComicById(comicId);
    if (!comic) {
      return res
        .status(404)
        .json({ success: false, message: "Comic not found" });
    }
    const existingChapter = comic.chapters.find(
      (chap) => chap.chapNum === chapNum
    );
    if (existingChapter) {
      return res.status(400).json({
        success: false,
        message: "Chapter number already exists. Enter another number.",
      });
    }

    const imageFile = req.files.chapterImage[0];
    const pdfFile = req.files.chapterPdf[0];

    const uploadedImage = await uploadToS3(
      imageFile.buffer,
      imageFile.originalname,
      imageFile.mimetype
    );

    const uploadedPdf = await uploadToS3(
      pdfFile.buffer,
      pdfFile.originalname,
      pdfFile.mimetype
    );

    const newChapter = await comicChapServices.createChapter({
      comicId,
      chapNum,
      title,
      releaseDate,
      chapImage: uploadedImage.Location,
      chapPdf: uploadedPdf.Location,
    });

    res.status(201).json({
      success: true,
      message: "Chapter created successfully!",
      data: newChapter,
    });
  } catch (error) {
    console.error("[createChapter] Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChaptersByComicId = async (req, res) => {
  try {
    const { comicId } = req.params;
    const chapters = await comicChapServices.getChaptersByComicId(comicId);

    res.status(200).json({
      success: true,
      message: "Chapters fetched successfully!",
      data: chapters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch chapters",
    });
  }
};

export const deleteChapter = async (req, res) => {
  try {
    const { comicId, chapterId } = req.params;

    const updatedComic = await comicChapServices.deleteChapter(comicId, chapterId);

    if (!updatedComic) {
      return res.status(404).json({ success: false, message: "Comic or chapter not found" });
    }

    res.status(200).json({ success: true, message: "Chapter deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateChapter = async (req, res) => {
  try {
    const { title, chapNum, releaseDate } = req.body;
    const { comicId, chapterId } = req.params;

    let chapImage, chapPdf;

    const comic = await comicChapServices.getComicById(comicId);
    if (!comic) {
      return res.status(404).json({ success: false, message: "Comic not found" });
    }

    const duplicateChapter = comic.chapters.find(
      (chap) => chap.chapNum === chapNum && chap._id.toString() !== chapterId
    );

    if (duplicateChapter) {
      return res.status(400).json({
        success: false,
        message: "Chapter number already exists. Enter another number.",
      });
    }

    if (req.files?.chapterImage?.[0]) {
      const uploadImg = await uploadToS3(
        req.files.chapterImage[0].buffer,
        req.files.chapterImage[0].originalname,
        req.files.chapterImage[0].mimetype
      );
      chapImage = uploadImg.Location;
    } else if (req.body.chapterImageUrl) {
      chapImage = req.body.chapterImageUrl;
    }

    if (req.files?.chapterPdf?.[0]) {
      const uploadPdf = await uploadToS3(
        req.files.chapterPdf[0].buffer,
        req.files.chapterPdf[0].originalname,
        req.files.chapterPdf[0].mimetype
      );
      chapPdf = uploadPdf.Location;
    } else if (req.body.chapterPdfUrl) {
      chapPdf = req.body.chapterPdfUrl;
    }

    const updateData = { title, chapNum, releaseDate, chapImage, chapPdf };

    const updatedChapter = await comicChapServices.updateChapter(
      comicId,
      chapterId,
      updateData
    );

    if (!updatedChapter) {
      return res
        .status(404)
        .json({ message: "Chapter not found", success: false });
    }

    res
      .status(200)
      .json({ data: updatedChapter, success: true, message: "Chapter updated successfully" });
  } catch (error) {
    console.error("Error in updateChapter:", error);
    res.status(400).json({ message: error.message, success: false });
  }
};








