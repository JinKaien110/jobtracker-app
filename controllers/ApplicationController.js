const ApplicationModel = require("../models/ApplicationModel");

class ApplicationController {
    static async apply(req, res) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const applicationData = JSON.parse(body);
                const result = await ApplicationModel.apply(applicationData);

                if(!result) {
                    res.writeHead(404, {'Content-Type': 'application/json'});
                    return res.end(JSON.stringify({ success: false, message: 'Failed to submit application'}));
                }
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ success: true, message: 'Application has been submitted'}));
            } catch (err) {
                res.writeHead(500, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ success: false, message: 'Ito ba yon? Error', err }));
            }
        });
    }
}

module.exports = ApplicationController;