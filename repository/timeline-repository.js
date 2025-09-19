import CrudRepository from "./crud-repository.js";
import Timeline from "../models/Timeline.js";

class TimelineRepository extends CrudRepository {
  constructor() {
    super(Timeline);
  }
}

export default TimelineRepository;
