import FAQService from "../services/faq-service.js";
const faqService = new FAQService();

// GET all FAQs (optionally filtered by category)
export const getFAQs = async (req, res) => {
  try {
    const { category } = req.query;
    const faqs = await faqService.getAll(category);
    res.status(200).json({ success: true, data: faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE FAQ
export const createFAQ = async (req, res) => {
  try {
    const { category } = req.body;

    // Validate category
    if (!['research', 'ultimate'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Allowed values are 'research' or 'ultimate'."
      });
    }

    const faq = await faqService.create(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE FAQ
export const updateFAQ = async (req, res) => {
  try {
    const { category } = req.body;

    if (category && !['research', 'ultimate'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Allowed values are 'research' or 'ultimate'."
      });
    }

    const updated = await faqService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE FAQ
export const deleteFAQ = async (req, res) => {
  try {
    const deleted = await faqService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }

    res.status(200).json({ success: true, message: "FAQ deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
