import CrudRepository from "./crud-repository.js";
import Feedback from "../models/Feedback.js";

class FeedbackRepository extends CrudRepository {
  constructor() {
    super(Feedback);
  }
}

export default new FeedbackRepository();
