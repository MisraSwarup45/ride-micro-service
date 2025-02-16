const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if(!token){
        return res.status(401).json({message: 'Please authenticate'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({message: 'Please authenticate'});
    }
}

module.exports = authMiddleware;