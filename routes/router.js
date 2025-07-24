const ApplicationController = require('../controllers/ApplicationController');
const JobController = require('../controllers/JobController');
const ViewController = require('../controllers/ViewController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

class Router {
    constructor() {
        this.routes = {};
        this.protectedViews = new Set(['/views/dashboard.html']);
    }

    register(method, path, ...handlers) {
        const key = `${method.toUpperCase()} ${path}`;
        this.routes[key] = handlers;
    }

    async resolve(req, res) {
        const { url, method } = req;
        const urlObj = new URL(url, `http://${req.headers.host}`);
        const cleanPath = urlObj.pathname;
        const key = `${method.toUpperCase()} ${cleanPath}`;

        if(method === 'PUT' && url.startsWith('/job/')) {
            const id = url.split('/')[2];
            req.jobId = id;
            return JobController.editJob(req, res);
        }
  
        if(method === 'GET' && url.startsWith('/jobs/')) {
            const id = url.split('/')[2];
            req.jobId = id;
            return JobController.getJobById(req, res);
        }

        if(method === 'DELETE' && url.startsWith('/job/')) {
            const id = url.split('/')[2];
            req.jobId = id;
            return JobController.deleteJob(req, res);
        }

        if(method === 'POST' && url.startsWith('/apply')) {
            return AuthMiddleware(req, res, () => ApplicationController.apply(req, res));
        }

        if(method === 'GET' && url.includes('/job-application-form.html')) {
            const urlObj = new URL(url, `http://${req.headers.host}`);
            const jobId = urlObj.searchParams.get("jobId");

            const filePath = path.join(__dirname, '..', 'views', 'components', 'job-application-form.html');
            fs.readFile(filePath, 'utf8', (err, data) => {
                if(err) {
                    console.log(err)
                    if(!res.headersSent) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        return res.end('Error loading form');
                    } else {
                        return;
                    }
                }

                const html = data.replace("{{jobId}}", jobId || '');
                if(!res.headersSent) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                }
                res.end(html);
            });
            return;
        };
        
        const handlers = this.routes[key];

        if(handlers) {
            let idx = 0;

            const next = () => {
                const handler = handlers[idx++];
                if (handler) return handler(req, res, next);
            };
            return next();
        }

        if(url.startsWith('/views')) {
            if(this.protectedViews.has(url)) {
                return AuthMiddleware(req, res, () => ViewController.serveStatic(req, res));
            } else {
                return ViewController.serveStatic(req, res);
            }
        }

        if (url.startsWith('/public')) {
            return ViewController.serveStatic(req, res);
        }


        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 Not Found INDEX');
    }
}

module.exports = Router;