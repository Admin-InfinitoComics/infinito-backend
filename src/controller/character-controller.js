import CharacterService from "../services/character-service.js";

const characterService = new CharacterService();

export const createCharacter = async (req, res) => {
  try {
    const { uploadToS3 } = await import('../utils/aws.js');


    // Upload all image fields
    const imageFields = [
      'mainImage',
      'storylineImage',
      'originImage',
      'mainLandscapeImage',
      'power1Image',
      'power2Image',
      'power3Image'
    ];
    const uploadedImages = {};
    for (const field of imageFields) {
      if (req.files && req.files[field] && req.files[field][0]) {
        const file = req.files[field][0];
        const result = await uploadToS3(file.buffer, file.originalname, file.mimetype);
        uploadedImages[field] = result.Location;
      }
    }

    // Build storyLine and origin objects
    let storyLine = {
      text: req.body.storylineText,
      image: uploadedImages['storylineImage'] || ""
    };
    let origin = {
      text: req.body.originText,
      image: uploadedImages['originImage'] || ""
    };

    // Build character data object
    const characterData = {
      ...req.body,
      storyLine,
      origin,
      mainImageUrl: uploadedImages['mainImage'] || "",
      mainLandscapeImageUrl: uploadedImages['mainLandscapeImage'] || "",
      power1ImageUrl: uploadedImages['power1Image'] || "",
      power2ImageUrl: uploadedImages['power2Image'] || "",
      power3ImageUrl: uploadedImages['power3Image'] || ""
    };

    const character = await characterService.createCharacter(characterData);
    res.status(201).json({ success: true, data: character });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllCharacters = async (req, res) => {
  try {
    const characters = await characterService.getAllCharacters();
    res.status(200).json({ success: true, data: characters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCharacterById = async (req, res) => {
  try {
    const character = await characterService.getCharacterById(req.params.id);
    if (!character) {
      return res.status(404).json({ success: false, message: "Character not found" });
    }
    res.status(200).json({ success: true, data: character });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateCharacter = async (req, res) => {
  try {
    const { uploadToS3 } = await import('../utils/aws.js');

    // Fetch existing character data
    const existingCharacter = await characterService.getCharacterById(req.params.id);
    if (!existingCharacter) {
      return res.status(404).json({ success: false, message: "Character not found" });
    }

    // Handle all image fields
    const imageFields = [
      'mainImage',
      'storylineImage',
      'originImage',
      'mainLandscapeImage',
      'power1Image',
      'power2Image',
      'power3Image'
    ];
    const uploadedImages = {};
    for (const field of imageFields) {
      if (req.files && req.files[field] && req.files[field][0]) {
        const file = req.files[field][0];
        const result = await uploadToS3(file.buffer, file.originalname, file.mimetype);
        uploadedImages[field] = result.Location;
      }
    }

    // Build storyLine and origin objects
    let storyLine = {
      text: req.body.storylineText ?? existingCharacter.storyLine.text,
      image: uploadedImages['storylineImage'] || existingCharacter.storyLine.image
    };
    let origin = {
      text: req.body.originText ?? existingCharacter.origin.text,
      image: uploadedImages['originImage'] || existingCharacter.origin.image
    };

    // Prepare updated data
    const updatedData = {
      ...req.body,
      mainImageUrl: uploadedImages['mainImage'] || existingCharacter.mainImageUrl,
      mainLandscapeImageUrl: uploadedImages['mainLandscapeImage'] || existingCharacter.mainLandscapeImage,
      power1ImageUrl: uploadedImages['power1Image'] || existingCharacter.power1Image,
      power2ImageUrl: uploadedImages['power2Image'] || existingCharacter.power2Image,
      power3ImageUrl: uploadedImages['power3Image'] || existingCharacter.power3Image,
      storyLine,
      origin
    };

    const character = await characterService.updateCharacter(req.params.id, updatedData);
    res.status(200).json({ success: true, data: character });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCharacter = async (req, res) => {
  try {
    await characterService.deleteCharacter(req.params.id);
    res.status(200).json({ success: true, message: "Character deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCharacterList = async (req, res) => {
  try {
    const characters = await characterService.getCharacterList();
    res.status(200).json({ success: true, data: characters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
