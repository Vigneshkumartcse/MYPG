// Fix MongoDB phone index to allow multiple users without phone numbers
// Run this ONCE to fix the duplicate key error: node fixPhoneIndex.js

require('dotenv').config();
const mongoose = require('mongoose');

async function fixPhoneIndex() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/MYPG';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        // Check existing indexes
        console.log('\n📋 Current indexes:');
        const indexes = await collection.indexes();
        indexes.forEach(index => {
            console.log(`  - ${index.name}:`, JSON.stringify(index.key));
        });

        // Drop the old phone index if it exists
        console.log('\n🗑️  Dropping old phone_1 index...');
        try {
            await collection.dropIndex('phone_1');
            console.log('✅ Old phone index dropped');
        } catch (error) {
            if (error.code === 27) {
                console.log('ℹ️  Index phone_1 does not exist (already dropped or never created)');
            } else {
                throw error;
            }
        }

        // Create new sparse unique index for phone
        console.log('\n📝 Creating new sparse unique index for phone...');
        await collection.createIndex(
            { phone: 1 }, 
            { 
                unique: true, 
                sparse: true,  // This allows multiple documents without phone field
                name: 'phone_1'
            }
        );
        console.log('✅ New sparse index created');

        // Update all users with phone: null to remove the phone field
        console.log('\n🔄 Removing phone: null from existing users...');
        const result = await collection.updateMany(
            { phone: null },
            { $unset: { phone: "" } }
        );
        console.log(`✅ Updated ${result.modifiedCount} users (removed phone: null)`);

        // Verify indexes
        console.log('\n✅ Final indexes:');
        const finalIndexes = await collection.indexes();
        finalIndexes.forEach(index => {
            console.log(`  - ${index.name}:`, JSON.stringify(index.key), index.sparse ? '(sparse)' : '');
        });

        console.log('\n🎉 Phone index fixed successfully!');
        console.log('✅ Users can now signup without phone numbers');
        
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error fixing index:', error.message);
        console.error(error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

fixPhoneIndex();
