const JobModel = require('../models/JobModel');

class JobController {
    static async getJobById(req, res) {
        try {
            const result = await JobModel.getJobById(req.jobId);

            if (!result) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: 'Job Not Found' }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Server Error', error: err.message }));
        }
    }

    static async countJob(req, res) {
        try {
            const count = await JobModel.countJobs();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(count));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to get job count'}));
        }
    }

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
    static async editJob(req, res) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const parsed = JSON.parse(body);
                const jobId = req.jobId;
                
                const updatedJob = await JobModel.editJob(jobId, parsed);

                if(!updatedJob) {
                    res.writeHead(404, {'Content-Type': 'application/json'});
                    return res.end(JSON.stringify({ success: false, message: "Failed to update the job details"}));
                }

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ success: true, message: 'Job updated successfully', job: updatedJob}));
            } catch (err) {
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ success: false, message: "Server Error", error: err.message }));
            }
        });
    }
    static async deleteJob(req, res) {
        try {
            const jobId = req.jobId;
            const deletedJob = await JobModel.deleteJob(jobId);
            
            if(!deletedJob) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ success: false, message: "Failed to delete the job"}));
            }

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ success: true, message: 'Job deleted successfully', job: deletedJob}));
        } catch (err) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ success: false, message: "Server Error", error: err.message }));
        }
    }
}

module.exports = JobController;