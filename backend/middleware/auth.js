import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: "No token" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded token:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

export default auth;