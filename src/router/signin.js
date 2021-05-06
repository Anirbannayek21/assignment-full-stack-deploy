const express = require("express");
const Users = require("../model/userSchema");
const bcrypt = require("bcrypt")

const router = express.Router();

const auth = require("../middleware/auth");
const { validateSignupRequest, isRequestValid, validateSigninRequest, validateLogs } = require("../validation/checkvalidation");

router.post("/register", validateSignupRequest, isRequestValid, async (req, res) => {

    const { name, email, password } = req.body;
    // let token;

    try {
        const existingUser = await Users.findOne({ email: email });

        if (existingUser) {
            return res.status(422).json({ message: "email already used" })
        }

        const userData = new Users({
            name, email, password
        })


        userData.save(async (error, data) => {
            if (error) {
                return res.status(400).json({ message })
            }


            if (data) {
                const token = await data.generateAuthToken();
                // console.log(token);

                res.cookie("jwt_token", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: false
                })

                res.status(200).json({
                    message: "user added"
                })
            }
        })

    } catch (error) {
        return res.status(400).json({ message: "something wrong happen. please check again" })
    }
})

router.post("/login", validateSigninRequest, isRequestValid, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "fill the form properly" })
    }

    try {
        const existingData = await Users.findOne({ email: email });

        if (!existingData) {
            return res.status(400).json({ message: 'user not found' });
        }

        const isMatch = await bcrypt.compare(password, existingData.password)

        if (!isMatch) {
            return res.status(400).json({ message: "invalid credentials" })
        }

        const token = await existingData.generateAuthToken();

        res.cookie('access_token', token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: false
        })

        res.status(200).json({
            message: "user signin successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: "something went wrong.please ty later."
        })
    }
})

router.get('/about', auth, (req, res) => {
    res.send(req.rootUser)
})

router.post("/getuser", (req, res) => {
    Users.findOne({ _id: req.body._id }).then((result) => res.send(result)).catch(() => res.status(400).json({ message: "user note fonnd" }))
})

router.get('/userdata', auth, async (req, res) => {
    if (req.rootUser.role !== 'admin') {
        return res.status(400).json({ message: "admin only access this page" });
    }

    await Users.find().then((users) => res.send(users)).catch((error) => console.log(error))
})

router.post("/update", async (req, res) => {
    const { _id, name, email, password } = req.body;

    if (password !== "") {
        await Users.findByIdAndUpdate({ _id: _id }, {
            name: name,
            email: email,
            password: password
        }).then((result) => {
            return res.status(200).json({ message: "updated successfully" })
        }).catch((error) => console.log(error))
    }
    else {
        await Users.findByIdAndUpdate({ _id: _id }, {
            name: name,
            email: email
        }).then((result) => {
            console.log(result);
            return res.status(200).json({ message: "updated successfully" })
        }).catch((error) => console.log(error))
    }
})

router.post("/adminupdate", auth, async (req, res) => {
    const { _id } = req.body;
    if (req.rootUser.role !== "admin") {
        return res.status(400).json({ message: "admin can only acces it" })
    }
    await Users.findByIdAndUpdate({ _id: _id }, { role: "admin" }).then((result) => {
        res.status(200).json({ message: "updated successfully" })
    }).catch((error) => console.log((error)))
})

router.get("/logs", auth, (req, res) => {
    res.send(req.rootUser.logs)
})

router.post("/addlogs", validateLogs, isRequestValid, auth, async (req, res) => {

    const { phone, text, date } = req.body;

    Users.findByIdAndUpdate({ _id: req.rootUser._id }, {
        $addToSet: {
            logs: {
                phone: phone, text: text, date: date
            }
        }
    }).then((result) => res.status(200).json({ message: "log added" })).catch((error) => console.log(error))
})

router.post("/viewlog", auth, (req, res) => {
    const { _id } = req.body
    const { logs } = req.rootUser;

    let i = 0;
    for (i = 0; i < logs.length; i++) {
        if (logs[i]._id == _id) {
            return res.send(logs[i]);
        }
    }

    res.status(400).json({ message: "data not found" })
})

router.get("/logout", (req, res) => {
    res.clearCookie("access_token", { path: "/" })
    res.status(200).send({ message: "logout successfully" })
})

module.exports = router