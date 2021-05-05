const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        emun: ['user', 'admin'],
        default: 'user'
    },
    logs: [
        {
            phone: Number,
            text: String,
            date: String
        }
    ],
    tokens: [
        {
            token: String
        }
    ]
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
})

userSchema.methods = {
    generateAuthToken: async function () {
        try {
            let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);

            this.tokens = this.tokens.concat({
                token: token
            })

            this.save();

            return token;
        } catch (error) {
            console.log((error));
        }
    }
}

const Users = mongoose.model("Users", userSchema)

module.exports = Users