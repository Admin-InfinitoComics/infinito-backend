import chapRepository from "../repository/comicChap-repository.js";

class ChapServices {
  constructor() {
    this.comicChapRepository = new chapRepository();
  }

  async createChapter(data) {
  try {
    const updatedComic = await this.comicChapRepository.addChapterToComic(
      data.comicId,
      {
        chapNum: data.chapNum,
        title: data.title,
        releaseDate: data.releaseDate,
        chapImage: data.chapImage,
        chapPdf: data.chapPdf,
      }
    );

    if (!updatedComic) throw new Error("Comic not found");
    return updatedComic;
  } catch (error) {
    console.error("[chapServices] Error in createChapter:", error);
    throw new Error("Failed to create chapter. Please try again later.");
  }
}

async getChaptersByComicId(comicId) {
  try {
    return await this.comicChapRepository.getChaptersByComicId(comicId);
  } catch (error) {
    console.error("[ChapService] Error in getChaptersByComicId:", error);
    throw new Error("Failed to fetch chapters. Please try again later.");
  }
}

async deleteChapter(comicId, chapterId) {
  try {
    return await this.comicChapRepository.deleteChapterById(comicId, chapterId);
  } catch (error) {
    console.error("[ChapService] Error in deleteChapter:", error);
    throw new Error("Failed to delete chapter. Please try again later.");
  }
}

 async updateChapter(comicId, chapterId, data) {
    try {
      return await this.comicChapRepository.updateChapterInComic(
        comicId,
        chapterId,
        data
      );
    } catch (error) {
      console.error("[ChapServices] Error in updateChapter:", error);
      throw new Error("Failed to update chapter. Please try again later.");
    }
  }

  async getComicById(comicId) {
    try {
      return await this.comicChapRepository.findById(comicId);
    } catch (error) {
      console.error("[ComicService] Error in getComicById:", error);
      throw new Error("Failed to fetch comic.");
    }
  }
}

export default ChapServices;
