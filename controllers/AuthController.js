const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const JWT_SECRET = 'mySuperSecretKey123';

class AuthController {
    static login(req, res) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const credentials = JSON.parse(body);
            const result = await UserModel.loginUser(credentials);

            if(!result.success) {
                res.writeHead(401, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(result));
            }

            const token = jwt.sign(
                { username: result.username, userId: result.user._id},
                JWT_SECRET,
                { expiresIn: '1h'}
            );

            res.writeHead(200, {'Content-Type': 'application/json',
                'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600`
            });

            res.end(JSON.stringify({
                success: true,
                message: result.message,
                token
            }));
        });
    }

    static register(req, res) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const userRegistrationData = JSON.parse(body);
            const result = await UserModel.register(userRegistrationData);

            if(!result.success) {
                res.writeHead(401, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify(result));
            }

            const token = jwt.sign(
                { username: userRegistrationData.username, userId: result.UserData._id },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600`
            });

            res.end(JSON.stringify({
                success: true,
                message: result.message,
                token
            }));
        });
    }
    
    static logout(req, res) {
        
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': `token=; HttpOnly; Path=/; Max-Age=0`
        });
        res.end(JSON.stringify({ success: true, message: 'Logout successfully'}));
    }
}

module.exports = AuthController;