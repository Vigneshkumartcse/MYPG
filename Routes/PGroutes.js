const express = require('express');
const PGRouter = express.Router();
const PGModel = require('../Models/PGmodel');
const { AddPG,GetPG,EditPG ,GetPGById,AddToFav } = require('../Controllers/PGcontrollers');
const PG = require('../Models/PGmodel');
const { AddPhotoToPG, GetPhotosByPG } = require('../Controllers/PGMediaController');
// Route to create a new PG entry
PGRouter.use('/AddPG', AddPG);
PGRouter.use('/GetPG',GetPG )
PGRouter.use('/EditPG/:pgId',EditPG )
PGRouter.use('/GetPG/:pgId',GetPGById )
PGRouter.use('/AffToFav/:pgId/:userId',AddToFav)
PGRouter.use('/AddPhotos/:pgId',AddPhotoToPG);
PGRouter.use('/GetPhotos/:pgId',GetPhotosByPG);



module.exports = PGRouter;