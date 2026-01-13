const mongoose = require("mongoose");
const PGMedia = require("../Models/PGmediamodel");

// Controller to add photos to a PG
exports.AddPhotoToPG = async (req, res) => {
    try {
        const { pgId } = req.params;
        const { uploadedBy, mediaType, url } = req.body;
        const newMedia = new PGMedia({
            pgId,
            uploadedBy,
            mediaType,
            url
        });
        await newMedia.save();
        res.status(201).json({ message: 'Photo added successfully', media: newMedia });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add photo', error: error.message });
    }
};

exports.GetPhotosByPG = async (req, res) => {
    try {
        const { pgId } = req.params;
        const photos = await PGMedia.find({ pgId });
        res.status(200).json({ photos });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve photos', error: error.message });
    }
};