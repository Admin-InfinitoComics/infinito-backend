import FAQRepository from '../repository/faq-repository.js';
import FAQ from '../models/Faq.js';

class FAQService {
  constructor() {
    this.faqRepository = new FAQRepository();
  }

  async getAll(category) {
    try {
      const filter = category ? { category } : {};
      return await FAQ.find(filter).sort({ order: 1 });
    } catch (error) {
      console.log("Error in getAll - FAQService");
      throw error;
    }
  }

  async create(data) {
    try {
      return await this.faqRepository.create(data);
    } catch (error) {
      console.log("Error in create - FAQService");
      throw error;
    }
  }

  async update(id, data) {
    try {
      return await this.faqRepository.findByIdandUpdate(id, data);
    } catch (error) {
      console.log("Error in update - FAQService");
      throw error;
    }
  }

  async delete(id) {
    try {
      return await this.faqRepository.findByIdandDelete(id);
    } catch (error) {
      console.log("Error in delete - FAQService");
      throw error;
    }
  }
}

export default FAQService;
