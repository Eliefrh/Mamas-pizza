const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const bodyParser = require("body-parser");
const { Module } = require('module');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const alert = require('node-notifier');

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
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/views/partials/css'));
app.use('/img', express.static(__dirname + '/views/partials/img', { extensions: ['jpg', 'png'] }));


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
    next();
});

// app.use((req, res, next) => {
//     res.json({ message: 'votre requete a bien ete recue !' });
//     next();
// });

// app.use((req, res, next) => {
//     console.log('Reponse envoyee avec succes !');
// });

/*
* parse all form data
*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'mysecretkey',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Handle form submission
app.post("/signup", (req, res) => {

    const password = req.body['sign-up-form-password'];
    const repassword = req.body['sign-up-form-repassword'];
    if (password == repassword) {
        const nom = req.body['sign-up-form-nom'];
        const prenom = req.body['sign-up-form-prenom'];
        const email = req.body['sign-up-form-email'];
        const tel = req.body['sign-up-form-tel'];
        let ville = req.body['sign-up-form-ville'];
        let province = req.body['sign-up-form-province'];
        const address = ville + ' ' + province;
        const zip = req.body['sign-up-form-zip'];

        // Insert data into the SQL table
        con.query(
            'INSERT INTO client ( cl_nom, cl_prenom, cl_telephone, cl_courriel, cl_code_postal, cl_address, cl_password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nom, prenom, tel, email, zip, address, password],
            (error, results) => {
                if (error) {
                    res.writeHead(301, { Location: "http://localhost:4000/signup" });
                    res.end();
                } else {
                    res.writeHead(301, { Location: "http://localhost:4000/login" });
                    res.end();
                }
            }
        );
    }
    else {
        res.writeHead(301, { Location: "http://localhost:4000/signup" });
        res.end();
    }
});

// Handle POST request for login
app.post('/login', (req, res) => {
    const email = req.body['login-email'];
    const password = req.body['login-password'];
    // Check if the email and password are valid
    const sql = `SELECT * FROM client WHERE cl_courriel = '${email}' AND cl_password = '${password}'`;
    con.query(sql, (err, results) => {
        if (err) {
            console.error('Error logging in: ', err);
            res.send('An error occurred while logging in');
        } else if (results.length > 0) {
            // Store the user's email in a cookie
            req.session.email = email;
            res.writeHead(301, { Location: "http://localhost:4000" });
            res.end();
        } else {
            alert.notify({
                title: 'erreur de login',
                message: 'Mauvais utilisateur ou mot de passe '
            });
            res.writeHead(301, { Location: "http://localhost:4000/login" });
            res.end();
        }
    });
});

/**
* connection au serveur
*/
const server = app.listen(4000, function () {
    console.log("serveur fonctionne sur 4000... ! ");
    console.log("http://localhost:4000/");
});

