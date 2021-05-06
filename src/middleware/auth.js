const jwt = require('jsonwebtoken');
const Users = require('../model/userSchema');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;

        const varified = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await Users.findOne({ _id: varified._id, "tokens.token": token })

        if (!rootUser) {
            throw new Error({ message: "user not found" })
        }

        req.rootUser = rootUser;

        next();

    } catch (error) {
        return res.status(400).json({
            message: "User not found"
        })
    }
}

module.exports = auth