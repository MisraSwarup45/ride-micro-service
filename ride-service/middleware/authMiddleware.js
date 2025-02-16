const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');

const authMiddlewareUser = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    if(!token){
        return res.status(401).json({message: 'Please authenticate'});
    }
    

    const response = await axios.get(`${process.env.BASE_URL_USER}/api/users/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });


    const user = response.data;
    if(!user){
        return res.status(401).json({message: 'Please authenticate'});
    }
    
    req.user = user;
    next();
}


const authMiddlewareCaptain = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    if(!token){
        return res.status(401).json({message: 'Please authenticate'});
    }
    

    const response = await axios.get(`${process.env.BASE_URL_USER}/api/captain/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });


    const user = response.data;
    if(!user){
        return res.status(401).json({message: 'Please authenticate'});
    }
    
    req.user = user;
    next();
}

module.exports = {authMiddlewareUser, authMiddlewareCaptain};