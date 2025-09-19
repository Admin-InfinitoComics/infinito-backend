import FAQ from '../models/Faq.js';
import CrudRepository from './crud-repository.js';

class FAQRepository extends CrudRepository {
  constructor() {
    super(FAQ);
  }
}

export default FAQRepository;
