import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js';
import bcrypt from 'bcryptjs';

import { generateToken } from '../lib/utils.js';

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
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        generateToken(user._id, res);
        res.status(200).json({ 
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error in login controller", error.message );
        res.status(500).json({ message: error.message });
        return;
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message );
        res.status(500).json({ message: error.message });
        return;
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: 'Profile picture is required' });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate
        (userId, { profilePic: uploadResponse.secure_url }, { new: true });

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in updateProfile controller", error.message );
        res.status(500).json({ message: error.message });
        return;
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth route", error.message);
        res.status(500).json({ message: error.message });
    } 
}