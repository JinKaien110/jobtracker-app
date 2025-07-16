const JobController = require('../controllers/JobController');
const ViewController = require('../controllers/ViewController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');

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
        const key = `${method.toUpperCase()} ${url}`;
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