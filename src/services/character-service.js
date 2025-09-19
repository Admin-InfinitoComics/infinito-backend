import CharacterRepository from "../repository/character-repository.js";
import mongoose from "mongoose";

class CharacterService {
    constructor() {
        this.characterRepository = new CharacterRepository();
    }

    async createCharacter(data) {
        try {   // List of required fields
            const requiredFields = [
                { key: 'knownAs', value: data.knownAs },
                { key: 'birthDate', value: data.birthDate },
                { key: 'placeOfOrigin', value: data.placeOfOrigin },
                { key: 'storyLine.text', value: data.storyLine && data.storyLine.text },
                { key: 'about', value: data.about },
                { key: 'origin.text', value: data.origin && data.origin.text }
            ];
            const missingFields = requiredFields.filter(f => !f.value || f.value.toString().trim() === '').map(f => f.key);
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
            }
            // Validate birthDate
            if (isNaN(Date.parse(data.birthDate))) {
                throw new Error("Invalid birthDate format");
            }

            // Validate mongoose ObjectIds for referenced fields
            const idFields = [
                { key: 'creator', value: data.creator, isArray: true },
                { key: 'group', value: data.group },
                { key: 'family', value: data.family, isArray: true },
                { key: 'friends', value: data.friends, isArray: true },
                { key: 'Enemies', value: data.enemies, isArray: true },
                { key: 'comicsAppearedIn', value: data.comicsAppearedIn, isArray: true }
            ];
            for (const field of idFields) {
                if (!field.value) continue;
                if (field.isArray) {
                    for (const id of field.value) {
                        if (!mongoose.Types.ObjectId.isValid(id)) {
                            throw new Error(`Invalid ObjectId in field: ${field.key}`);
                        }
                    }
                } else {
                    if (!mongoose.Types.ObjectId.isValid(field.value)) {
                        throw new Error(`Invalid ObjectId in field: ${field.key}`);
                    }
                }
            }
            // Build the character object
const characterData = {
                knownAs : data.knownAs,
                originalName: data.originalName,
                birthDate: data.birthDate,
                placeOfOrigin: data.placeOfOrigin,
                characteristics: data.characteristics,
                interests: data.interests,
                weapon: data.weapon,
                capabilities: data.capabilities,
                powers: data.powers,
                height: data.height,
                weight: data.weight,
                age: data.age,
                species: data.species,
                eyes: data.eyes,
                hair: data.hair,
                limitations: data.limitations,
                description: data.description,
                creator : data.creator,
                group : data.group,
                family : data.family,
                friends : data.friends,
                enemies : data.enemies,
                comicsAppearedIn : data.comicsAppearedIn,
                storyLine: {
                    text: data.storyLine && data.storyLine.text,
                    image: data.storyLine && data.storyLine.image
                },
                about: data.about,
                origin: {
                    text: data.origin && data.origin.text,
                    image: data.origin && data.origin.image
                },
                imagesUrl: data.imagesUrl,
                gender : data.gender,
                mainImageUrl: data.mainImageUrl,
                mainLandscapeImageUrl: data.mainLandscapeImageUrl,
                power1ImageUrl: data.power1ImageUrl,
                power2ImageUrl: data.power2ImageUrl,
                power3ImageUrl: data.power3ImageUrl
            };
            const character = await this.characterRepository.create(characterData);
            return character;
        } catch (error) {
            throw new Error(`Character creation failed: ${error.message}`);
        }
    };

    async getAllCharacters() {
        try {
            return await this.characterRepository.getAll();
        } catch (error) {
            throw new Error(`Fetching all characters failed: ${error.message}`);
        }
    }

    // Service to get minimal character info for frontend (name, id, main image)
    async getCharacterList() {
        try {
            const characters = await this.characterRepository.getCharacterList();
            return characters.map(char => ({
                characterId: char._id,
                characterName: char.knownAs,
                characterOriginalName: char.originalName,
                characterMainImageUrl: char.mainImageUrl || null
            }));
        } catch (error) {
            throw new Error(`Fetching character list failed: ${error.message}`);
        }
    }

    async getCharacterById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid character ID");
            }
            const character = await this.characterRepository.getById(id);
            if (!character) {
                throw new Error("Character not found");
            }
            return character;
        } catch (error) {
            throw new Error(`Fetching character failed: ${error.message}`);
        }
    }

    async updateCharacter(id, data) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid character ID");
            }
            const updated = await this.characterRepository.findByIdandUpdate(id, data);
            console.log(updated);
            if (!updated) {
                throw new Error("Character not found or update failed");
            }
            return updated;
        } catch (error) {
            throw new Error(`Updating character failed: ${error.message}`);
        }
    }

    async deleteCharacter(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid character ID");
            }
            const deleted = await this.characterRepository.findByIdandDelete(id);
            if (!deleted) {
                throw new Error("Character not found or delete failed");
            }
            return deleted;
        } catch (error) {
            throw new Error(`Deleting character failed: ${error.message}`);
        }
    }
}

export default CharacterService;
