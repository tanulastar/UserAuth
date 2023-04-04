const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
// const encryption = require("mongoose-encryption");
require("dotenv").config();
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


// userSchema.plugin(encryption, { secret: process.env.secret, encryptedFields: ['password'] });

const User  = new mongoose.model("User", userSchema);



app.get("/", function(req, res) {
    res.render("home")
});


app.get("/login", function(req, res) {
    res.render("login")
});


app.get("/register", function(req, res) {
    res.render("register")
});
 

app.post("/register", function(req, res) {
    const newUser = User({
        email: req.body.username,
        password: md5(req.body.password)
    })
    newUser.save()
    .then(function() {
        res.render("secrets");
    })
    .catch(function(err) {
        res.status(500).send("Error creating account: " + err.message);
    });
    
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username})
    .then(function(founduser) {
        if (founduser) {
           if (founduser.password === password) {
            res.render("secrets");
           }
        }
    })
    .catch(function(err) {
        console.log(err);
    })
})









app.listen(3000, function() {
    console.log("Server is ruunning on port 3000")
});