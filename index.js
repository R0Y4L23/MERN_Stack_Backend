const express = require("express")
const cors = require("cors")
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const {
    body,
    validationResult
} = require('express-validator');
const auth = require("./auth")
require("dotenv").config()
const mongoose = require('mongoose');
var multer = require('multer');
var upload = multer();
const {
    show_all_data,
    show_data_by_id,
    save_data,
    update_by_id,
    delete_by_id,
    check_login
} = require('./db');

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function () {
    console.log("Connected to Database")
});

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(upload.array());
app.use(express.static('public'));

app.get("/test", (req, res) => {
    return res.status(200).send({
        "Message": "Welcome to Simply API without Token"
    })
})

app.get("/", auth, (req, res) => {
    return res.status(200).send({
        "Message": "Welcome to Simply API"
    })
})

app.get("/users", auth, async (req, res) => {
    let data = await show_all_data()
    return res.status(200).send({
        "Message": "Retrieved Successfully",
        "Body": data
    })
})

app.get("/user", auth, async (req, res) => {
    let data = await show_data_by_id(req.userinfo.email)
    data["password"] = "******"
    return res.status(200).send({
        "Message": "Retrieved Successfully",
        "Body": data
    })
})

app.post("/login",
    body("email").isEmail().withMessage("Must be a valid Email"),
    body("password").isLength({
        min: 8
    }).withMessage("Password has to be minimum of 8 characters").isAlphanumeric().withMessage("Password must contain both letters and numbers"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        let data = req.body
        let m = await check_login(data)
        let payload = {}
        payload["Message"] = m.m
        payload["Body"] = data
        delete payload["Body"]["password"]
        if (m.m == "Login Successful") {
            payload["Token"] = jwt.sign({
                email: m.d["email"],
                username: m.d["username"]
            }, process.env.SECRET_KEY, {
                algorithm: "HS256"
            }, {
                expiresIn: 60 * 60
            });
        }
        return res.status(200).send(payload)
    })

app.post("/register",
    body("username").isAlphanumeric().withMessage("Username must contain both letters and numbers"),
    body("name").isAlpha("en-US", {
        ignore: " "
    }).withMessage("Username must contain only letters"),
    body("age").isNumeric().withMessage("Age must be a number"),
    body("email").isEmail().withMessage("Must be a valid Email"),
    body("password").isLength({
        min: 8
    }).withMessage("Password has to be minimum of 8 characters").isAlphanumeric().withMessage("Password must contain both letters and numbers"),
    body("bio").isLength({
        min: 15
    }).withMessage("Bio has to be minimum of 15 characters"), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        let data = req.body
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(data.password, salt);
        data.password = hash
        let m = await save_data(data)
        let payload = {}
        payload["Message"] = m
        payload["Body"] = req.body
        delete payload["Body"]["password"]
        if (m == "Posted Successfully") {
            payload["token"] = jwt.sign({
                email: data.email,
                username: data.username
            }, process.env.SECRET_KEY, {
                algorithm: "HS256"
            }, {
                expiresIn: 60 * 60
            });
        }
        return res.send(payload)
    })

app.put("/user", auth,
    body("name").optional().isAlpha("en-US", {
        ignore: " "
    }).withMessage("Username must contain only letters"),
    body("age").optional().isNumeric().withMessage("Age must be a number"),
    body("bio").optional().isLength({
        min: 15
    }).withMessage("Bio has to be minimum of 15 characters"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        if (req.body.age || req.body.name || req.body.bio) {
            update_by_id(req.userinfo.email, req.body)
            return res.status(200).send({
                "Message": "Updated Successfully"
            })
        } else {
            return res.status(400).send({
                "Message": "Empty Body Received"
            })
        }
    })

app.delete("/user", auth, (req, res) => {
    delete_by_id(req.userinfo.email)
    return res.status(200).send({
        "Message": "Deleted Successfully"
    })
})

app.get('*', function (req, res) {
    res.status(404).send('What??? This is a wrong endpoint...');
});

app.listen(process.env.PORT, () => {
    console.log("Server is Running at URL : http://localhost:" + process.env.PORT)
})