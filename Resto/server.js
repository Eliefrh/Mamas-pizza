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


/****
 * 
 * 
 * importe all related JavaScript and CSS files to inject in our app
 */
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules + tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css/', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css/', express.static(__dirname + '/partials/css/style.css'));

app.get('/', function (req, res) {
    res.render("pages/index", { titrePage: "Mamma's Pizza's" });
});

app.get('/login', function (req, res) {
    res.render("pages/login", { titrePage: "Login" });
});

app.get('/signup', function (req, res) {
    res.render("pages/signup", { titrePage: "Sign Up" });
});

app.get('/menu', function (req, res) {
    res.render("pages/menu", { titrePage: "Menu" });
});

app.get('/panier', function (req, res) {
    res.render("pages/panier", { titrePage: "Panier" });
});

app.get('/produitlist', function (req, res) {
    res.render("pages/produit_list", { titrePage: "Produit List" });
});

app.get('/reservation', function (req, res) {
    res.render("pages/reservation", { titrePage: "Reservation" });
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

// const siteTitle = "Application simple";
// const baseURL = "https://localhost:4000";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle form submission
app.post('/signup', (req, res) => {

    const email = email;
    const password = password;

    // Insert data into the SQL table
    connection.query(
        'INSERT INTO client (email, password) VALUES (?, ?)',
        [email, password],
        (error, results) => {
            if (error) {
                console.error(error);
                res.send('Error adding user to SQL table');
            } else {
                res.send('User added to SQL table');
            }
        }
    );
});







/**
* connection au serveur
*/
const server = app.listen(4000, function () {
    console.log("serveur fonctionne sur 4000... ! ");
    console.log("http://localhost:4000/");
});

