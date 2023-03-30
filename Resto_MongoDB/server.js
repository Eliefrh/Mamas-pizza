const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const ObjectId = require("mongodb");
const bodyParser = require("body-parser");
const { Module } = require('module');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const alert = require('node-notifier');
import ("dateformat");
const now = new Date();

const operation = require('./operation');

const { config } = require('dotenv');
config();

module.exports = app;
let isLoggedIn = false;
let successMessage = false;
let failedMessage = false;
let StatusMessage;
let LogedInForm;

app.set('views', './views');
app.set('view engine', 'ejs');

//importe all related JavaScript and CSS files to inject in our app
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/views/partials/css'));
app.use('/img', express.static(__dirname + '/views/partials/img', { extensions: ['jpg', 'png'] }));
app.use('/js', express.static(__dirname + '/views/partials/js'));

// app.get('/panier', function (req, res) {
//     res.render("pages/panier", { titrePage: "Panier", Authentification: isLoggedIn });
// });

// app.get('/produitlist', function (req, res) {
//     res.render("pages/produit_list", { titrePage: "Produit List", Authentification: isLoggedIn });
// });

app.get('/', async(req, res) => {
    res.render('pages/index', { titrePage: "Mamma's Pizza's", Authentification: isLoggedIn, LogedInForm: LogedInForm });
});

app.get('/login', async(req, res) => {
    res.render('pages/login', { titrePage: "Login", Authentification: isLoggedIn, LogedInForm: LogedInForm });
});

app.get('/signup', async(req, res) => {
    res.render('pages/signup', { titrePage: "signup", Authentification: isLoggedIn, successMessage: successMessage, failedMessage: failedMessage, StatusMessage: StatusMessage, LogedInForm: LogedInForm });
});

app.get('/reservation', async(req, res) => {
    res.render("pages/reservation", { titrePage: "Reservation", Authentification: isLoggedIn, LogedInForm: LogedInForm });
});

app.get('/review', async(req, res) => {
    res.render("pages/review", { titrePage: "Review", Authentification: isLoggedIn, LogedInForm: LogedInForm });
});

app.get('/account', async(req, res) => {
    res.render('pages/account', { titrePage: "Account", Authentification: isLoggedIn, LogedInForm: LogedInForm });
});

app.get('/menu', async(req, res) => {
    try {
        const client = await operation.ConnectionDeMongodb();
        const db = client.db("Resto_awt");
        const produits = db.collection("Produit");
        const produitList = await produits.find().toArray();

        const categorie = new Set();
        for (let i = 0; i < produitList.length; i++) {
            categorie.add(produitList[i].cat_nom);
        }

        res.render('pages/menu', { titrePage: "Menu", Authentification: isLoggedIn, LogedInForm: LogedInForm, Produits: produitList, Categories: categorie });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/menu/:item', async(req, res) => {
    try {
        const item = req.params.item;
        const client = await operation.ConnectionDeMongodb();
        const db = client.db("Resto_awt");
        const produits = db.collection("Produit");
        const produitList = await produits.find().toArray();

        let produitSelectionne;
        produitList.forEach(function(produit) {
            if (produit.prod_nom == item) {
                produitSelectionne = produit;
            }
        })

        res.render('pages/item', { titrePage: item, Authentification: isLoggedIn, LogedInForm: LogedInForm, Item: produitSelectionne });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/reviewList', async(req, res) => {
    const client = await operation.ConnectionDeMongodb();
    const db = client.db("Resto_awt");
    const review = db.collection("Review");
    const reviews = await review.find().toArray();
    reviews.forEach(element => {
        //  console.log(element);
    });
    res.render('pages/reviewList', { titrePage: "reviewList", Authentification: isLoggedIn, LogedInForm: LogedInForm, Reviews: reviews });
});


// app.post('/reviewList', async (req, res) => {
//   const client = await operation.ConnectionDeMongodb();
//   const db = client.db("Resto_awt");
//   const Reviews = db.collection("Review");
//   Reviews.forEach((review) => {
//     console.log(review);
//   });


//   res.render('pages/reviewList', { titrePage: "ReviewList", Authentification: isLoggedIn, LogedInForm: LogedInForm });

// });


// Parse Data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'mysecretkey',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function requireAuth(req, res, next) {
    if (req.session && req.session.email && req.session.userId) {
        return next();
    } else {
        res.writeHead(301, { Location: "http://localhost:29017/login" });
        res.end();
    }
}

/*
  Le post methode pour la page de Sign Up
*/
app.post("/signup", async(req, res) => {
    const password = req.body['sign-up-form-password'];
    const repassword = req.body['sign-up-form-repassword'];

    if (password.length > 50 || repassword.length > 50) {
        failedMessage = true;
        StatusMessage = "Le mot de passe doit être inférieur à 50 caractères";
        return res.status(400).send('Le mot de passe doit être inférieur à 50 caractères');
    } else if (password !== repassword) {
        failedMessage = true;
        StatusMessage = "Les mots de passe ne correspondent pas";
        return res.status(400).send('Les mots de passe ne correspondent pas');
    }

    const nom = req.body['sign-up-form-nom'];
    const prenom = req.body['sign-up-form-prenom'];
    const email = req.body['sign-up-form-email'];
    const tel = req.body['sign-up-form-tel'];
    const ville = req.body['sign-up-form-ville'];
    const province = req.body['sign-up-form-province'];
    const address = ville + ' ' + province;
    const zip = req.body['sign-up-form-zip'];

    const client = {
        cl_nom: nom,
        cl_prenom: prenom,
        cl_courriel: email,
        cl_telephone: tel,
        cl_address: address,
        cl_code_postal: zip,
        cl_password: password
    };

    try {
        const dbClient = await operation.ConnectionDeMongodb();
        const db = dbClient.db("Resto_awt");
        const users = db.collection("Client");

        // Check if email already exists
        const existingUser = await users.findOne({ cl_courriel: email });

        if (existingUser) {
            failedMessage = true;
            StatusMessage = "Un compte avec cet e-mail existe déjà";
            return res.status(409).send('Un compte avec cet e-mail existe déjà');
        }

        // Insert new user
        await users.insertOne(client);
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur interne du serveur');
    }
});

/*
  Le post methode pour la page de Login
*/
app.post('/login', async(req, res) => {
    const email = req.body['login-email'];
    const password = req.body['login-password'];

    try {
        const client = await operation.ConnectionDeMongodb();
        const db = client.db("Resto_awt");
        const users = db.collection("Client");
        const user = await users.findOne({ cl_courriel: email, cl_password: password });

        if (!user) {
            return res.status(401).send('Invalid username or password');
        } else {
            req.session.email = email;
            req.session.userId = user._id.toString();

            LogedInForm = {
                cl_nom: user.cl_nom,
                cl_prenom: user.cl_prenom,
                cl_courriel: email,
                cl_telephone: user.cl_telephone,
                cl_address: user.cl_address,
                cl_code_postal: user.cl_code_postal,
                cl_password: password
            }

            isLoggedIn = true;
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


//methode post pour toutes les reviews 

app.post('/reviewList', async(req, res) => {
    const client = await operation.ConnectionDeMongodb();

    const db = client.db("Resto_awt");
    const review = db.collection("Review");

    array.forEach(element => {
        console.log(review);

    });

});

/*
  Le post methode pour la page de Reservation
*/
app.post('/reservation', requireAuth, async(req, res) => {
    let current_date = new Date();
    const date = req.body['reservation-form-date'];

    if (Date.parse(date) >= current_date) {
        const time = req.body['reservation-form-time'];
        const datetime = `${date} ${time}`;
        const num_siege = req.body['reservation-form-siege'];

        try {
            const client = await operation.ConnectionDeMongodb();
            const db = client.db("Resto_awt");
            const reservation = db.collection('Reservation');

            const InputForm = {
                num_siege: num_siege,
                cl_id: req.session.userId,
                date_reservation: datetime
            }

            await reservation.insertOne(InputForm);
            res.redirect('/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    } else {
        return res.status(401).send('Date Invalid');
    }
});

/*
  Le post methode pour la page de Review
*/
app.post('/review', requireAuth, async(req, res) => {
    const titre = req.body['review-form-title'];
    const content = req.body['review-form-review'];
    const rating = req.body['review-form-rating'];
    const prenom = req.session.prenom;

    try {
        const dbClient = await operation.ConnectionDeMongodb();
        const db = dbClient.db("Resto_awt");
        const review = db.collection("Review");

        const InputForm = {
            cl_id: req.session.userId,
            review_title: titre,
            review_text: content,
            review_rating: rating
        }

        await review.insertOne(InputForm);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

/*
  Le post methode pour la page account
*/
app.post('/account', requireAuth, async(req, res) => {
    const conf_cl_password = req.body["account-form-conformation-password"];

    if (conf_cl_password == LogedInForm.cl_password) {
        const new_cl_prenom = req.body["account-form-new-prenom"];
        const new_cl_nom = req.body["account-form-new-nom"];
        const new_cl_courriel = req.body["account-form-new-email"];
        const new_cl_telephone = req.body["account-form-new-phone"];
        const new_cl_address = req.body["account-form-new-address"];
        const new_cl_code_postal = req.body["account-form-new-zip"];
        const new_cl_password = req.body["account-form-new-password"];
        const new_cl_repassword = req.body["account-form-new-repassword"];

        try {
            const client = await operation.ConnectionDeMongodb();
            const db = client.db("Resto_awt");
            const users = db.collection("Client");
            console.log(req.session.userId);
            const user = await users.findOne(ObjectId(req.session.userId));
            console.log(user);
            res.redirect('/account');
            if (new_cl_prenom != "") {
                if (new_cl_prenom != LogedInForm.cl_prenom) {
                    LogedInForm.cl_prenom = new_cl_prenom;
                }
            }
            if (new_cl_nom != "") {
                if (new_cl_nom != LogedInForm.cl_nom) {
                    LogedInForm.cl_nom = new_cl_nom;
                }
            }
            if (new_cl_courriel != "") {
                if (new_cl_courriel != LogedInForm.cl_courriel) {
                    LogedInForm.cl_courriel = new_cl_courriel;
                }
            }
            if (new_cl_telephone != "") {
                if (new_cl_telephone != LogedInForm.cl_telephone) {
                    LogedInForm.cl_telephone = new_cl_telephone;
                }
            }
            if (new_cl_address != "") {
                if (new_cl_address != LogedInForm.cl_address) {
                    LogedInForm.cl_address = new_cl_address;
                }
            }
            if (new_cl_code_postal != "") {
                if (new_cl_code_postal != LogedInForm.cl_code_postal) {
                    LogedInForm.cl_code_postal = new_cl_code_postal;
                }
            }
            if (new_cl_password != "" && new_cl_repassword != "") {
                if (new_cl_password != LogedInForm.cl_password) {
                    LogedInForm.cl_password = new_cl_password;
                }
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }
});

/*
  Le post methode pour logout
*/
app.post('/logout', requireAuth, async(req, res) => {
    isLoggedIn = false;
    req.session.userId = null;
    req.session.email = null;
    res.redirect('/');
});


// Connecter au server
const server = app.listen(29017, function() {
    console.log("serveur fonctionne sur 29017... ! ");
    console.log("http://localhost:29017/");
});

// /**
//  * Bouton personnaliser dans le menu
//  */


// /* Bouton Ajouter au panier */


// app.get('/item', function (req, res) {
//     res.render("pages/item", { titrePage: "Item", Authentification: isLoggedIn });
// });

// app.post('/item', function (req, res) {
//     res.send('Item submitted successfully!');
// });