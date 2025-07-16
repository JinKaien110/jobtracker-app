const connectDB = require('../utils/db');
const { ObjectId } = require('mongodb');

class JobModel {
    static async getJobById(jobId) {
        const db = await connectDB();
        const job = await db.collection('jobs').findOne({ _id: new ObjectId(jobId) });
        return job;
    }

    static async getAllJobs() {
        const db = await connectDB();
        const jobs = await db.collection('jobs').find({}).toArray();
        return jobs;
    }

    static async addJob(jobData) {
       const db = await connectDB();
       const result = await db.collection('jobs').insertOne(jobData);
       return {
        success: true,
        message: 'Job has been successfully added!',
        jobId: result.insertedId,
        jobData
       }
    }

    static async editJob(jobId, newData) {
        const db = await connectDB();

        if (!ObjectId.isValid(jobId)) {
            throw new Error('Invalid Job ID format');
        }

        const result = await db.collection('jobs').findOneAndUpdate(
            { _id: new ObjectId(jobId) },
            { $set: newData },
            { returnDocument: 'after'}
        );
        return result;
    }

    static async deleteJob(jobId) {
        const db = await connectDB();

        const result = await db.collection('jobs').findOneAndDelete(
            { _id: new ObjectId(jobId) },
        );
        return result;
    }
}

module.exports = JobModel;