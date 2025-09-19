import CrudRepository from "./crud-repository.js";
import ErrorReport from "../models/ErrorReport.js";

class ErrorReportRepository extends CrudRepository {
  constructor() {
    super(ErrorReport); // inherit create(), getAll(), etc.
  }
}

export default new ErrorReportRepository();
