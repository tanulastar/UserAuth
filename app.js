const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encryption = require("mongoose-encryption");
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

const secret = process.env.secret;
console.log(secret)

userSchema.plugin(encryption, { secret: secret, encryptedFields: ['password'] });

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
        password: req.body.password
    })
    newUser.save()
    .then(function() {
        res.render("secrets");
    })
    .catch(function(err) {
        res.status(500).send("Error creating account: " + err.message);
    });
    
})









app.listen(3000, function() {
    console.log("Server is ruunning on port 3000")
});