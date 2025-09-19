import TimelineService from "../services/timeline-service.js";
import { uploadToS3 } from "../utils/aws.js";

const timelineService = new TimelineService();

export const createEvent = async (req, res) => {
  try {
    const { title, eventDate, category , description, eventNumber } = req.body;
    if (!title || !eventDate || !description || !category || !eventNumber ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "An image is required." });
    }
    const uploadResult = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
    const imageUrl = uploadResult.Location;

    const event = await timelineService.createEvent({ title, eventDate, category, description, imageUrl, eventNumber });
    res.status(201).json({ data: event, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await timelineService.getAllEvents();
    res.status(200).json({ data: events, success: true, message: "All timelines fetched successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await timelineService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found", success: false });
    res.status(200).json({ data: event, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { title, eventDate, category, description, eventNumber } = req.body;
    let imageUrl;

    if (req.file) {
      const uploadResult = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
      imageUrl = uploadResult.Location;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const update = { title, eventDate, category, description, imageUrl , eventNumber};
    const event = await timelineService.updateEvent(req.params.id, update);
    if (!event) return res.status(404).json({ message: "Event not found", success: false });
    res.status(200).json({ data: event, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await timelineService.deleteEvent(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found", success: false });
    res.status(200).json({ message: "Event deleted", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};
