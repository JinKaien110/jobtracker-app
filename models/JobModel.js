const connectDB = require('../utils/db');

class JobModel {
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
}

module.exports = JobModel;