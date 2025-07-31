const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        else {
            const profilePicture = "https://res.cloudinary.com/dqbddypvk/image/upload/v1753532803/TODOS_APP_NODE_NEXT/igzjku9msek2ep4syfih.png"; 
            const user = await User.create({ name, email, password, profilePicture});
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            });

            res.cookie('token', token, { httpOnly: true, expiresIn: '1d', secure: true, sameSite: 'strict' });

            res.status(201).json({
                success: true,
                user: { _id: user._id, name: user.name, email: user.email, profilePicture: user.profilePicture }
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: `Server Error : ${error.message}` });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day 
            secure: true, sameSite: 'strict'
        });
        res.status(200).json({ success: true, user: { _id: user._id, name: user.name, email: user.email, profilePicture: user.profilePicture } });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: `Server Error : ${error.message}` });
    }
}

exports.logout = async (req, res) => {
    try {
        res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true });  // httpOnly option is used to prevent client-side script access to the cookie.
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: `Server Error : ${error.message}` });
    }
}

// exports.isAuthenticated = async (req, res, next) => {
//     const token = req.cookies.token;
//     if (!token) {
//         return res.status(401).json({ success: false, message: "Unauthorized" });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id).select('-password');
//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(401).json({ success: false, message: "Unauthorized" });
//     }
// }