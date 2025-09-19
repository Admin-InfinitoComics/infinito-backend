import TimelineAboutService from "../services/aboutTimeline-service.js";
const timelineAboutService = new TimelineAboutService();

export const createAboutEvent = async (req, res) => {
  try {
    const {title, category, description, month, year, eventNumber } = req.body;
    if (!title || !description || !month || !category || !eventNumber || !year ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const event = await timelineAboutService.createAboutEvent({title, category, description, month, year, eventNumber });
    res.status(201).json({ data: event, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const getAllAboutEvents = async (req, res) => {
  try {
    const events = await timelineAboutService.getAllAboutEvents();
    res.status(200).json({ data: events, success: true, message: "All timelines fetched successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const updateAboutEvent = async (req, res) => {
  try {
    const { title, category, description, month, year, eventNumber } = req.body;

    const update = { title, category, description, month, year, eventNumber};
    const event = await timelineAboutService.updateAboutEvent(req.params.id, update);
    if (!event) return res.status(404).json({ message: "Event not found", success: false });
    res.status(200).json({ data: event, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const deleteAboutEvent = async (req, res) => {
  try {
    const event = await timelineAboutService.deleteAboutEvent(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found", success: false });
    res.status(200).json({ message: "Event deleted", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};