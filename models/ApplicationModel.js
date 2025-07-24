const connectDB = require('../utils/db');
const { ObjectId } = require('mongodb'); 

class ApplicationModel {
    static async apply(applicationData) {
        const db = await connectDB();
        const result = await db.collection('applications').insertOne(applicationData);

        if(!result.insertedId) {
            return null;
        }
        return result;
    }
}

module.exports = ApplicationModel;