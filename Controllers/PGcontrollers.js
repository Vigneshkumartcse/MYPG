const express = require('express');
const PGModel = require('../Models/PGmodel');

exports.AddPG = async (req, res) => {
    
    try {
        const {name, location , city, area, address, priceRange, genderType, amenities, pgRules, foodDetails, ownerID,roomType} = req.body;
        if (!name || !location || !city || !area || !address || !priceRange || !genderType || !amenities || !ownerID ) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Duplicate check
        const existingPG = await PGModel.findOne({
            name: name.trim(),
            city: city.trim(),
            address: address.trim(),
            genderType: genderType.trim()
        });
        if (existingPG) {
            return res.status(409).json({ message: 'Duplicate PG details found. This PG already exists.' });
        }

        const newPG = new PGModel({
            name,
            location,
            roomType,
            city,
            area,
            address,
            priceRange,
            genderType,
            amenities,
            pgRules,
            foodDetails,
            ownerID
        });
        await newPG.save();
        res.status(201).json({ message: 'PG added successfully', pg: newPG });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add PG', error: error.message });
    }
}



exports.GetPG = async (req, res) => {
    try {
        console.log("GetPG called");
        const pgList = await PGModel.find();
        res.status(200).json({ pgList });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve PG list', error: error.message });
    }
}




exports.EditPG = async (req, res) => {
    try {
        const { pgId } = req.params;
        const {  updateData } = req.body;
        const updatedPG = await PGModel.findByIdAndUpdate(pgId, updateData, { new: true });
        if (!updatedPG) {
            return res.status(404).json({ message: 'PG not found' });
        }
        res.status(200).json({ message: 'PG updated successfully', pg: updatedPG });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update PG', error: error.message });
    }
}


exports.GetPGById = async (req, res) => {
    try {
        const { pgId } = req.params;
        const pg = await PGModel.findById(pgId);
        if (!pg) {
            return res.status(404).json({ message: 'PG not found' });
        }
        res.status(200).json({ pg });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve PG', error: error.message });
    }   
}


exports.AddToFav = async (req, res) => {
    try {
        const { pgId, userId } = req.params;
        const FavoritePG = require('../Models/userFavoritePG');
        const existingFavorite = await FavoritePG.findOne({ userId, pgId });
        if (existingFavorite) {
            return res.status(400).json({ message: 'PG is already in favorites' });
        }
        const newFavorite = new FavoritePG({ userId, pgId });
        await newFavorite.save();
        res.status(201).json({ message: 'PG added to favorites', favorite: newFavorite });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add PG to favorites', error: error.message });
    }
}