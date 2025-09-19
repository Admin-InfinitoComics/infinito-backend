import CrudRepository from "./crud-repository.js";
import Character from "../models/Character.js";

class CharacterRepository extends CrudRepository {
    constructor() {
        super(Character);
    }

    // Fetch only minimal character info for frontend
    async getCharacterList() {
        // Only select _id, knownAs, imagesUrl
        return await Character.find({}, { _id: 1, knownAs: 1, mainImageUrl: 1, originalName : 1});
    }
}

export default CharacterRepository;
