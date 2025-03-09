import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

import { generateToken} from '../lib/utils.js';

export const signup = async (req, res) => {
    const { username, fullname, email, password } = req.body;
    try {
        if (!username || !fullname || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user already exists, if so, return an error, else create a new user
        const exstingUser = await User.findOne({ username });
        if (exstingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const exstingEmail = await User.findOne({ email });
        if (exstingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            username: username,
            fullname: fullname,
            email: email, 
            password: hashedPassword 
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({ 
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else {
            res.status(400).json({ message: 'User not created' });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message );
        res.status(500).json({ message: error.message });
        return;
    }
}

export const login = async (req, res) => {
    res.send('Login route');
}

export const logout = async (req, res) => {
    res.send('Logout route');
}