const jwt = require('jsonwebtoken');
const JWT_SECRET = 'mySuperSecretKey123';

function AuthMiddleware(req, res, next) {
    const cookie = req.headers.cookie || '';
    const token = cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    if(!token) {
        res.writeHead(401, {'Content-Type': 'text/plain'});
        return res.end('404 Not Found');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.writeHead(403, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ success: false, message: 'Invalid or expired token'}));
    }
}

module.exports = AuthMiddleware;