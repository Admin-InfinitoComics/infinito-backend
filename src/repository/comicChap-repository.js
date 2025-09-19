import CrudRepository from "./crud-repository.js";
import Comic from "../models/Comics.js";

class chapRepository extends CrudRepository {
  constructor() {
    super(Comic);
  }
  async addChapterToComic(comicId, chapterData) {
    try {
      const updatedComic = await Comic.findByIdAndUpdate(
        comicId,
        { $push: { chapters: chapterData } },
        { new: true, runValidators: false }
      );
      return updatedComic;
    } catch (error) {
      console.error("Error in addChapterToComic:", error);
      throw error;
    }
  }

  async getChaptersByComicId(comicId) {
  try {
    const comic = await this.model.findById(comicId).select("chapters");
    if (!comic) throw new Error("Comic not found");
    return comic.chapters;
  } catch (error) {
    console.error("Error in getChaptersByComicId:", error);
    throw error;
  }
}

async deleteChapterById(comicId, chapterId) {
  try {
    const updatedComic = await this.model.findByIdAndUpdate(
      comicId,
      { $pull: { chapters: { _id: chapterId } } }, 
      { new: true }
    );

    return updatedComic;
  } catch (error) {
    console.error("Error in deleteChapterById:", error);
    throw error;
  }
}

async updateChapterInComic(comicId, chapterId, data) {
    try {
      const updatedComic = await Comic.findOneAndUpdate(
        { _id: comicId, "chapters._id": chapterId },
        {
          $set: {
            "chapters.$.title": data.title,
            "chapters.$.chapNum": data.chapNum,
            "chapters.$.releaseDate": data.releaseDate,
            "chapters.$.chapImage": data.chapImage,
            "chapters.$.chapPdf": data.chapPdf,
          },
        },
        { new: true }
      );
      return updatedComic;
    } catch (error) {
      console.error("Error in updateChapterInComic:", error);
      throw error;
    }
  }

  async findById(comicId) {
    try {
      return await Comic.findById(comicId);
    } catch (error) {
      console.error("Error in findById:", error);
      throw error;
    }
  }
}

export default chapRepository;
