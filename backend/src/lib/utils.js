import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days - in milliseconds
        httpOnly: true, // prevent cookie access from JavaScript
        sameSite: "strict",  // cookie will only be sent in a first-party context
        secure: process.env.NODE_ENV !== "devlopment",
    })

    return token;
}