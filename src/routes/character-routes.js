import express from 'express';
import upload from '../middleware/multer.js';
import {
    createCharacter,
    getAllCharacters,
    getCharacterById,
    updateCharacter,
    deleteCharacter,
    getCharacterList
} from '../controller/character-controller.js';
import { adminauthenticate } from '../middleware/adminauth.js';

const router = express.Router();

router.get('/getAll', getAllCharacters);

router.get('/get/:id', getCharacterById);

// Route for minimal character info for frontend   
router.get('/list', getCharacterList);       

router.post(
  '/create', adminauthenticate,
  upload.fields([
  { name: 'mainImage', maxCount: 1 },
    { name: 'storylineImage', maxCount: 1 },
    { name: 'originImage', maxCount: 1 },
    { name : 'mainLandscapeImage', maxCount : 1},
    { name : 'power1Image', maxCount : 1},
    { name : 'power2Image', maxCount : 1},
    { name : 'power3Image', maxCount : 1},
  ]),
  createCharacter
);

router.patch('/update/:id', adminauthenticate, upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'storylineImage', maxCount: 1 },
    { name: 'originImage', maxCount: 1 },
     { name : 'mainLandscapeImage', maxCount : 1},
    { name : 'power1Image', maxCount : 1},
    { name : 'power2Image', maxCount : 1},
    { name : 'power3Image', maxCount : 1},
  ]), updateCharacter);
router.delete('/delete/:id', adminauthenticate, deleteCharacter);

export default router;
