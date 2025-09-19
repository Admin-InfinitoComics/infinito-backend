import ComicService from "../services/comic-service.js";
import { uploadToS3 } from "../utils/aws.js";
const comicService = new ComicService();

const createComic = async (req, res) => {
    try {
        let { chapters } = req.body;
        const { title, releasedYear } = req.body;
        let { authors } = req.body;

        if (typeof authors === "string") {
            try {
                authors = JSON.parse(authors);
            } catch (e) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid format for authors. Expected JSON array."
                });
            }
        }

        if(chapters) chapters = JSON.parse(chapters);

        //authors validation
        if (!Array.isArray(authors) || authors.length === 0 || authors.some(a => typeof a !== 'string' || !a.trim())) {
            return res.status(400).json({
                success: false,
                message: "Authors must be a non-empty array of strings"
            });
        }


        if (!title || !authors || !releasedYear) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        
        // Validate files
        if (!req.files?.coverImg || !req.files?.bannerImg) {
            return res.status(400).json({ success: false, message: "Both cover and banner images are required." });
        }

        // Upload both images
        const coverUpload = await uploadToS3(
            req.files.coverImg[0].buffer,
            req.files.coverImg[0].originalname,
            req.files.coverImg[0].mimetype
        );

        const bannerUpload = await uploadToS3(
            req.files.bannerImg[0].buffer,
            req.files.bannerImg[0].originalname,
            req.files.bannerImg[0].mimetype
        );

        const comicObj = {
            coverImg: coverUpload.Location,
            bannerImg: bannerUpload.Location,
            title,
            authors,
            releasedYear,
        }

        if (chapters) comicObj.chapters = chapters;

        const savedComic = await comicService.createComic(comicObj);
        res.status(200).json({
            success: true,
            message: "successfully created comic!",
            data: savedComic
        })
    }
    catch (err) {
        console.log("Error in creating comic", err);
        return res.status(500).json({
            success: false,
            message: "Failed to create comic. Please try again!"
        })
    }
}

const updateComic = async (req, res) => {
    try {
        const comicId = req.params.id;

        const existingComic = await comicService.getComicById(comicId);
        if (!existingComic) {
            return res.status(202).json({ success: false, message: "Comic doesn't exists!" })
        }

        const { title, releasedYear } = req.body;
        let { authors } = req.body;

        if (typeof authors === "string") {
            try {
                authors = JSON.parse(authors);
            } catch (e) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid format for authors. Expected JSON array."
                });
            }
        }

        //authors validation
        if (!Array.isArray(authors) || authors.length === 0 || authors.some(a => typeof a !== 'string' || !a.trim())) {
            return res.status(400).json({
                success: false,
                message: "Authors must be a non-empty array of strings"
            });
        }



        const comicObj = {};
        if (title) comicObj.title = title;
        if (authors) comicObj.authors = authors;
        if (releasedYear) comicObj.releasedYear = releasedYear;
        // if (chapters) comicObj.chapters = chapters;

        // let imageurl;
        // if (req.file) {
        //     const uploadResult = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
        //     imageurl = uploadResult.Location;
        // } else if (req.body.coverImg) {
        //     imageurl = req.body.coverImg;
        // }
        // if (imageurl) comicObj.coverImg = imageurl;

        // COVER IMAGE update (via req.files or fallback to body)
        if (req.files?.coverImg) {
            const coverUpload = await uploadToS3(
                req.files.coverImg[0].buffer,
                req.files.coverImg[0].originalname,
                req.files.coverImg[0].mimetype
            );
            comicObj.coverImg = coverUpload.Location;
        } else if (req.body.coverImg) {
            comicObj.coverImg = req.body.coverImg;
        }

        // BANNER IMAGE update (same logic)
        if (req.files?.bannerImg) {
            const bannerUpload = await uploadToS3(
                req.files.bannerImg[0].buffer,
                req.files.bannerImg[0].originalname,
                req.files.bannerImg[0].mimetype
            );
            comicObj.bannerImg = bannerUpload.Location;
        } else if (req.body.bannerImg) {
            comicObj.bannerImg = req.body.bannerImg;
        }

        // Update in DB
        const updatedComic = await comicService.updateComic(comicId, comicObj);
        if (!updatedComic) {
            res.status(404).json({ success: false, message: "Comic not found!" });
        }

        res.status(200).json({ success: true, message: "Comic updated successfully!", data: updatedComic })
    }
    catch (err) {
        console.log("Error updating comic: ", err);
        res.status(500).json({
            success: false,
            message: "Error updating comic. Please try again!"
        })
    }
}

const getAllComics = async (req, res) => {
    try {
        const allcomics = await comicService.getAllComics();
        if (allcomics.length === 0) {
            return res.status(202).json({
                success: true,
                message: "No comics available. Please add comics to see the list"
            })
        }
        res.status(200).json({
            success: true,
            message: "All comics fetched successfully!",
            data: allcomics
        })
    }
    catch (err) {
        console.log("Error fetching all comics", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch all comics. Please try again!"
        })
    }
}

const getComicById = async (req, res) => {
    try {
        const comicId = req.params.id;

        const reqcomic = await comicService.getComicById(comicId);
        if (!reqcomic) {
            return res.status(404).json({
                success: false,
                message: "Comic not found with provided comic id"
            })
        }

        res.status(200).json({
            success: true,
            message: "Comic fetched successfully!",
            data: reqcomic
        })

    }
    catch (err) {
        console.log("Error fetching comic by id: ", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch comic by Id. Please try again!"
        })
    }
}

const deleteComic = async (req, res) => {
    try {
        const comicId = req.params.id;

        const deletedComic = await comicService.deleteComic(comicId);
        if (!deletedComic) {
            return res.status(400).json({
                success: false,
                message: "No comic exits for provided comic id."
            })
        }
        res.status(200).json({
            success: true,
            message: "Comic deleted successfully!",
            data: deletedComic
        })

    }
    catch (err) {
        console.log("Error deleting comic: ", err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete comic. Please try again!"
        })
    }
}

export default {
    createComic,
    updateComic,
    getAllComics,
    getComicById,
    deleteComic
}