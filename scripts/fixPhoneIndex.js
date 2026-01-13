// Remove unique constraint from phone field
require('dotenv').config();
const mongoose = require('mongoose');

async function removePhoneIndex() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/MYPG');
        
        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');
        
        console.log('Dropping phone index...');
        try {
            await usersCollection.dropIndex('phone_1');
            console.log('✅ Phone index removed');
        } catch (e) {
            if (e.code === 27) {
                console.log('✅ Index does not exist, already removed');
            } else {
                throw e;
            }
        }
        
        console.log('\n🎉 Done! Phone numbers are no longer unique.');
        console.log('Multiple users can now have the same phone number or no phone number.');
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

removePhoneIndex();
