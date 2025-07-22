const http = require('http');
const fs = require('fs');
const path = require('path');
const Router = require('./routes/router');
const AuthController = require('./controllers/AuthController');
const AuthMiddleware = require('./middlewares/AuthMiddleware');
const ViewController = require('./controllers/ViewController');
const JobController = require('./controllers/JobController');
const PORT = 3000;

const router = new Router();

router.register('POST', '/login', AuthController.login);
router.register('POST', '/register', AuthController.register)
router.register('GET', '/', ViewController.serveHome);
router.register('POST', '/add-job', AuthMiddleware, JobController.addJob);
router.register('GET', '/jobs', JobController.allJobs);
router.register('GET', '/jobs/:id', JobController.getJobById);
router.register('PUT', '/job/:id', JobController.editJob);
router.register('GET', '/logout', AuthController.logout);
router.register('DELETE', '/job/:id', JobController.deleteJob);
router.register('GET', '/job-count', JobController.countJob);
router.register('GET', '/user-count', ViewController.countUser);

const server = http.createServer((req, res) => {
    router.resolve(req, res);
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});