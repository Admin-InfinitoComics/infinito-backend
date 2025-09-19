import TimelineRepository from "../repository/timeline-repository.js";


/**
 * TimelineService handles business logic for timeline events.
 * All methods are wrapped in try-catch for robust error handling and logging.
 */
class TimelineService {
  constructor() {
    this.timelineRepository = new TimelineRepository();
  }

  
  async createEvent(data) {
    try {
      return await this.timelineRepository.create({
        title: data.title,
        eventDate: data.eventDate,
        category:data.category,
        description: data.description,
        imageUrl: data.imageUrl,
        eventNumber: data.eventNumber
      });
    } catch (error) {
      console.error(`[TimelineService] Error in createEvent:`, error);
      throw new Error('Failed to create event. Please try again later.');
    }
  }


  async getAllEvents() {
    try {
      return await this.timelineRepository.getAll();
    } catch (error) {
      console.error(`[TimelineService] Error in getAllEvents:`, error);
      throw new Error('Failed to fetch events. Please try again later.');
    }
  }


  async getEventById(id) {
    try {
      return await this.timelineRepository.getById(id);
    } catch (error) {
      console.error(`[TimelineService] Error in getEventById:`, error);
      throw new Error('Failed to fetch event. Please try again later.');
    }
  }


  async updateEvent(id, data) {
    try {
      return await this.timelineRepository.findByIdandUpdate(id, {
        title: data.title,
        eventDate: data.eventDate,
        category: data.category,
        description: data.description,
        imageUrl: data.imageUrl,
        eventNumber: data.eventNumber
      });
    } catch (error) {
      console.error(`[TimelineService] Error in updateEvent:`, error);
      throw new Error('Failed to update event. Please try again later.');
    }
  }

  async deleteEvent(id) {
    try {
      return await this.timelineRepository.findByIdandDelete(id);
    } catch (error) {
      console.error(`[TimelineService] Error in deleteEvent:`, error);
      throw new Error('Failed to delete event. Please try again later.');
    }
  }
}

export default TimelineService;
