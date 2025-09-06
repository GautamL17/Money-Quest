import User from '../models/user.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ msg: 'User already exists' })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        res.status(201).json({ user, token });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        res.status(200).json({ user, token });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
