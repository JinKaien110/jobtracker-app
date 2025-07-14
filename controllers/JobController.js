const JobModel = require('../models/JobModel');

class JobController {
    static addJob(req, res) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const jobData = JSON.parse(body);

            const fullJobData = {
                ...jobData,
                userId: req.user.userId
            };
            const result = await JobModel.addJob(fullJobData);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        });
    }
    static async allJobs(req, res) {
        try {
            const jobs = await JobModel.getAllJobs();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(jobs));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Error fetching jobs' }));
        }
    }
}

module.exports = JobController;