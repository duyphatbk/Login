const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = asyncHandler(async(req, res)=>{
    const {username, email, password} = req.body;
    if(!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const OldUser = await User.findOne({email});
    if(OldUser) {
        res.status(400);
        throw new Error("User already registed!");
    }
    const newUser = await User.create({
        username,
        email,
        password : await bcrypt.hash(password, 10)
    })
    if(!newUser) {
        res.status(400);
        throw new Error("User data not valid");
    }
    res.json({
        id: newUser.id,
        email: newUser.email
    });
});

const loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        res.status(400);
        throw new Error("All fileds are mandatory!");
    }
    const user = await User.findOne({email});
    if(user && await bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign({
            user : {
                username: user.username,
                email: user.email,
                id: user.id
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '100m'}
        )
        res.status(200).json({accessToken});
    } else {
        res.status(401);    
        throw new Error("email or password is not valid");
    }
    res.json({message: "Login user"})
});

const currentUser = asyncHandler(async(req, res)=>{
    res.json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    currentUser
}