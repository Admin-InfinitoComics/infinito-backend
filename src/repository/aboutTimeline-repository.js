import CrudRepository from "./crud-repository.js";
import Timeline from "../models/Timeline.js";

class TimelineAboutRepository extends CrudRepository {
  constructor() {
    super(Timeline);
  }
}

export default TimelineAboutRepository;