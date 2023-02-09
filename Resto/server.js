const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const bodyParser = require("body-parser");
const { Module } = require('module');
// const dateFormat = require("dateformat");
import("dateformat");
const now = new Date();

module.exports = app;

app.set('views', './views');
app.set('view engine', 'ejs');
/*connect to server */

// const server = app.listen(4000, function () {
//     console.log("serveur fonctionne sur 4000 ... !");
// });

/****
 * 
 * 
 * importe all related JavaScript and CSS files to inject in our app
 */
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules + tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css/', express.static(__dirname + '/node_modules/bootstrap/dist/css'))

app.get('/', function (req, res) {
    /*
    get the event list with select from table
    */
    res.render("pages/index", {titrePage: "Mamma's Pizza's"});
});

app.use((req, res, next) => {
    console.log('Requete recue! ');
    next(); // passer au prochain middleware
});

app.use((req, res, next) => {
    res.json({ message: 'votre requete a bien ete recue !' });
    next();
});

app.use((req, res, next) => {
    console.log('Reponse envoyee avec succes !');
});

/*
* parse all form data
*/
app.use(bodyParser.urlencoded({ extended: true }));

/*
connection a la bd
*/

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "resto_awt",
});


/*
get the event list
*/


/**
* Titre global du site et url de base
*/

const siteTitle = "Application simple";
const baseURL = "https://localhost:4000";

/**
* connection au serveur
*/
const server = app.listen(4000, function () {
    console.log("serveur fonctionne sur 4000... ! ");
    console.log("http://localhost:4000/");
});
