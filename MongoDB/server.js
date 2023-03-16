// // import("http");
// // import("express");
// //const app = express();
// //const { Module } = require('module');

// const express = require('express');
// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/Resto_awt');


// //module.exports = app;
// import { config } from "dotenv";
// import { executeSignUpOperations } from "./src/signup.js"




// config();
// await executeSignUpOperations();






// const http = require("http");
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const { Module } = require("module");
// const { config } = require("dotenv");
// const { executeSignUpOperations } = require("./src/signup.js");

// mongoose.connect("mongodb://localhost/Resto_awt");

// config();

// await executeSignUpOperations();


import http from "http";
import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import { executeSignUpOperations } from "./src/signup.js";
import { nextTick } from "process";

const app = express();

//module.exports = app;
let alertValidation;
let alertValidationtxt;
let isLoggedIn;

const __dirname = 'c:/Users/efrie/source/repos/AWT-/MongoDB/';

app.set('views', './views');
app.set('view engine', 'ejs');


app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/views/partials/css'));
app.use('/img', express.static(__dirname + '/views/partials/img', { extensions: ['jpg', 'png'] }));
app.use('/js', express.static(__dirname + '/views/partials/js'));

mongoose.connect("mongodb://localhost/Resto_awt");



config();

await executeSignUpOperations();

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, world!\n');
});

app.get('/', function (req, res) {

    console.log("dkfjgndfkjnfdslgdsgs");
    var db = req.db;
    var collection = db.get('Client');
    collection.find({ cl_prenom: "Elie" }, function (e, docs) {
        res.json(docs);
    });
});


// Start listening on port 27017
server.listen(27017, () => {
    console.log('Server running at http://localhost:27017/');
});


