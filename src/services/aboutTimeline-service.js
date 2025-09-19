import TimelineAboutRepository from "../repository/aboutTimeline-repository.js";

class TimelineAboutService {
  constructor() {
    this.timelineAboutRepository = new TimelineAboutRepository();
  }

  async createAboutEvent(data) {
    try {
      return await this.timelineAboutRepository.create({
        title: data.title,
        category:data.category,
        description: data.description,
        month: data.month,
        year: data.year,
        eventNumber: data.eventNumber
      });
    } catch (error) {
      console.error(`[TimelineService] Error in createEvent:`, error);
      throw new Error('Failed to create event. Please try again later.');
    }
  }

  async getAllAboutEvents() {
    try {
      return await this.timelineAboutRepository.getAll();
    } catch (error) {
      console.error(`[TimelineService] Error in getAllEvents:`, error);
      throw new Error('Failed to fetch events. Please try again later.');
    }
  }

  async updateAboutEvent(id, data) {
    try {
      return await this.timelineAboutRepository.findByIdandUpdate(id, {
        title: data.title,
        category: data.category,
        description: data.description,
        month: data.month,
        year: data.year,
        eventNumber: data.eventNumber
      });
    } catch (error) {
      console.error(`[TimelineService] Error in updateEvent:`, error);
      throw new Error('Failed to update event. Please try again later.');
    }
  }

  async deleteAboutEvent(id) {
    try {
      return await this.timelineAboutRepository.findByIdandDelete(id);
    } catch (error) {
      console.error(`[TimelineService] Error in deleteEvent:`, error);
      throw new Error('Failed to delete event. Please try again later.');
    }
  }
}

export default TimelineAboutService;