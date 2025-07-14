const ViewController = require('../controllers/ViewController');

class Router {
    constructor() {
        this.routes = {};
    }

    register(method, path, ...handlers) {
        const key = `${method.toUpperCase()} ${path}`;
        this.routes[key] = handlers;
    }

    async resolve(req, res) {
        const { url, method } = req;
        const cleanUrl = url.replace(/\/+$/, '');
        const key = `${method.toUpperCase()} ${cleanUrl}`;

        const handlers = this.routes[key];

        if(handlers) {
            let idx = 0;

            const next = () => {
                const handler = handlers[idx++];
                if (handler) return handler(req, res, next);
            };
            return next();
        }

        if (url.startsWith('/public') || url.startsWith('/views')) {
            return ViewController.serveStatic(req, res);
        }


        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 Not Found');
    }
}

module.exports = Router;