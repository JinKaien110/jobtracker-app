const connectDB = require('../utils/db');

class UserModel {
    async getAllUser() {
        const db = await connectDB();
        return db.collection('users').find().toArray();
    }

    async register(UserData) {
        const db = await connectDB();

        const existingUser = await db.collection('users').findOne({ username: UserData.username });

        if(existingUser) {
            return {success: false, message: 'Username has already been used'}; // all situational validation will be held in controller
        }

        await db.collection('users').insertOne(UserData);
        return {success: true, message: 'User registered successfully', UserData};
    }

    async loginUser({ username, password }) {
        const db = await connectDB();

        const existingUser = await db.collection('users').findOne({username});
        const capitalized = username.charAt(0).toUpperCase() + username.slice(1); 
        if(!existingUser) {
            return { success: false, message: 'User does not exist'};
        } else if(existingUser.password !== password) {
            return { success: false, message: 'Incorrect password'};
        } else {
            return {
                success: true,
                message: `Hello, ${capitalized}`,
                user: existingUser
            }
        }
    }
}   

module.exports = new UserModel();