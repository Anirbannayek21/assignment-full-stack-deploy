const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const cookieParser = require("cookie-parser")
const userRoutes = require("./router/signin")

const app = express();
dotenv.config({ path: 'src/.env' })

const PORT = process.env.PORT || 8000;

app.use(cookieParser())
app.use(express.json())
app.use("/user", userRoutes)

mongoose.connect(process.env.DATABASE, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log("datebase conneted")).catch((error) => console.log(error))



if (process.env.NODE_ENV == "production") {
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", 'build', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
})