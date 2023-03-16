const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const bodyParser = require("body-parser");
const { Module } = require('module');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const alert = require('node-notifier');

import { config } from "dotenv";
// const dateFormat = require("dateformat");
import("dateformat");
const now = new Date();

module.exports = app;
let alertValidation;
let alertValidationtxt;
let isLoggedIn;

app.set('views', './views');
app.set('view engine', 'ejs');
/*connect to server */

/*
 * importe all related JavaScript and CSS files to inject in our app
 */
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/views/partials/css'));
app.use('/img', express.static(__dirname + '/views/partials/img', { extensions: ['jpg', 'png'] }));
app.use('/js', express.static(__dirname + '/views/partials/js'));


app.get('/', function (req, res) {
    res.render("pages/index", { titrePage: "Mamma's Pizza's", Authentication: isLoggedIn });
});

app.get('/login', function (req, res) {
    res.render("pages/login", { titrePage: "Login", Authentication: isLoggedIn });
});

app.get('/signup', function (req, res) {
    res.render("pages/signup", { titrePage: "Sign Up", Authentication: isLoggedIn, Alert: alertValidation, Alerttxt: alertValidationtxt });
});

app.get('/menu', function (req, res) {
    res.render("pages/menu", { titrePage: "Menu", Authentication: isLoggedIn });
});

app.get('/panier', function (req, res) {
    res.render("pages/panier", { titrePage: "Panier", Authentication: isLoggedIn });
});

app.get('/produitlist', function (req, res) {
    res.render("pages/produit_list", { titrePage: "Produit List", Authentication: isLoggedIn });
});

app.get('/reservation', function (req, res) {
    res.render("pages/reservation", { titrePage: "Reservation", Authentication: isLoggedIn });
});
app.get('/review', function (req, res) {
    res.render("pages/review", { titrePage: "Review", Authentication: isLoggedIn });
});

app.get('/logout', function (req, res) {
    isLoggedIn = false;
    res.writeHead(301, { Location: "http://localhost:27017" });
    res.end();
});

app.use((req, res, next) => {
    console.log('Requete recue! ');
    next();
});


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



function requireAuth(req, res, next) {
    if (req.session && req.session.email) {
        return next();
    } else {
        res.writeHead(301, { Location: "http://localhost:27017/login" });
        res.end();
    }
}

/*
get the event list
*/

/**
 * Titre global du site et url de base
 */

// const siteTitle = "Application simple";
// const baseURL = "https://localhost:27017";


// Handle form submission
app.post("/signup", (req, res) => {
    const password = req.body['sign-up-form-password'];
    const repassword = req.body['sign-up-form-repassword'];
    if (password.length > 50 && repassword.length > 50) {
        alertValidation = false;
        alertValidationtxt = "password trop grand, doit etre moins que 50 caractere";
        /*alert.notify({
            title: 'Erreur de password',
            message: '50 caracteres et plus dans le password'
        });*/
        res.json({ success: false });
    }
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
            'INSERT INTO client ( cl_nom, cl_prenom, cl_telephone, cl_courriel, cl_code_postal, cl_address, cl_password) VALUES (?, ?, ?, ?, ?, ?, ?)', [nom, prenom, tel, email, zip, address, password],
            (error, results) => {
                if (error) {
                    //res.writeHead(301, { Location: "http://localhost:27017/signup" });
                    res.end();
                } else {
                    res.writeHead(301, { Location: "http://localhost:27017/login" });
                    res.end();
                }
            }
        );
    } else {
        //res.writeHead(301, { Location: "http://localhost:27017/signup" });
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
            isLoggedIn = false;
            alert.notify({
                title: 'erreur de login',
                message: 'Mauvais utilisateur ou mot de passe '
            });
            res.writeHead(301, { Location: "http://localhost:27017/login" });
            res.end();
        } else if (results.length > 0) {
            // Store the user's email in a cookie
            req.session.email = email;
            isLoggedIn = true;
            res.writeHead(301, { Location: "http://localhost:27017" });
            res.end();
        } else {
            isLoggedIn = false;
            alert.notify({
                title: 'erreur de login',
                message: 'Mauvais utilisateur ou mot de passe '
            });
            res.writeHead(301, { Location: "http://localhost:27017/login" });
            res.end();
        }
    });
});


app.post('/reservation', requireAuth, (req, res) => {

    const email = req.session.email;
    let current_date = new Date();
    const date = req.body['reservation-form-date'];

    if (Date.parse(date) >= current_date) {

        const time = req.body['reservation-form-time'];
        const datetime = `${date} ${time}`;
        const num_siege = req.body['reservation-form-siege'];

        const sql_get_id = `SELECT cl_id FROM client WHERE cl_courriel = '${email}'`;
        con.query(sql_get_id, (error, results) => {
            if (error) {
                res.writeHead(301, { Location: "http://localhost:27017/reservation" });
                res.end();
            } else {
                const { cl_id } = results[0];
                const get_id = cl_id;

                const sql = `INSERT INTO reservation (num_siege, cl_id, date_reservation) VALUES ('${num_siege}', '${get_id}', '${datetime}')`;
                con.query(sql, (error, results) => {
                    if (error) {
                        res.writeHead(301, { Location: "http://localhost:27017/reservation" });
                        res.end();
                    } else {
                        res.writeHead(301, { Location: "http://localhost:27017" });
                        res.end();
                    }
                });
            }
        });
    }
});


app.post('/review', function (req, res) {
    const titre = req.body.titre;
    const nom = req.body.nom;
    const review = req.body.review;
    const rating = req.body.rating;
    // Do something with the review data, such as save it to a database
    res.send('Review submitted successfully!');
});

/**
 * connection au serveur
 */
const server = app.listen(27017, function () {
    console.log("serveur fonctionne sur 27017... ! ");
    console.log("http://localhost:27017/");
});

/**
 * Bouton personnaliser dans le menu
 */

app.get('/menu/:item', (req, res) => {
    const itemName = req.params.item;
    const itemUrl = `/menu/${itemName}`;
    res.redirect(itemUrl);
});

/* Bouton Ajouter au panier */


app.get('/item', function (req, res) {
    res.render("pages/item", { titrePage: "Item", Authentication: isLoggedIn });
});

app.post('/item', function (req, res) {

    res.send('Item submitted successfully!');
});