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
import("dateformat");
const now = new Date();

const operation = require('./operation');

const { config } = require('dotenv');
config();

module.exports = app;
let isLoggedIn = false;
let successMessage = false;
let failedMessage = false;
let statusMessage;
let loggedInForm;

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

// app.get('/panier', function (req, res) {
//     res.render("pages/panier", { titrePage: "Panier", Authentification: isLoggedIn });
// });

// app.get('/produitlist', function (req, res) {
//     res.render("pages/produit_list", { titrePage: "Produit List", Authentification: isLoggedIn });
// });

app.get('/', async (req, res) => {
    try {
        const client = await operation.ConnectionDeMongodb();
        const db = client.db("Resto_awt");
        const produits = db.collection("Produit");
        const NosSpecial = await produits.find().limit(3).toArray();

        res.render('pages/index', { titrePage: "Mamma's Pizza's", Authentification: isLoggedIn, LoggedInForm: loggedInForm, NosSpecial: NosSpecial});
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/login', async (req, res) => {
    res.render('pages/login', { titrePage: "Login", Authentification: isLoggedIn, LoggedInForm: loggedInForm });
});

app.get('/signup', async (req, res) => {
    res.render('pages/signup', { titrePage: "signup", Authentification: isLoggedIn, successMessage: successMessage, failedMessage: failedMessage, StatusMessage: statusMessage, LoggedInForm: loggedInForm });
});

app.get('/reservation', async (req, res) => {
    res.render("pages/reservation", { titrePage: "Reservation", Authentification: isLoggedIn, LoggedInForm: loggedInForm });
});

app.get('/review', async (req, res) => {
    res.render("pages/review", { titrePage: "Review", Authentification: isLoggedIn, LoggedInForm: loggedInForm });
});

app.get('/account', async (req, res) => {
    res.render('pages/account', { titrePage: "Account", Authentification: isLoggedIn, LoggedInForm: loggedInForm });
});

app.get('/logout', async (req, res) => {
    isLoggedIn = false;
    req.session.userId = null;
    req.session.email = null;
    res.redirect('/');
});

app.get('/menu', async (req, res) => {
    try {
        const client = await operation.ConnectionDeMongodb();
        const db = client.db("Resto_awt");
        const produits = db.collection("Produit");
        const produitList = await produits.find().toArray();

        const categorie = new Set();
        for (let i = 0; i < produitList.length; i++) {
            categorie.add(produitList[i].cat_nom);
        }

        res.render('pages/menu', { titrePage: "Menu", Authentification: isLoggedIn, LoggedInForm: loggedInForm, Produits: produitList, Categories: categorie });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/menu/:item', async (req, res) => {
    try {
        const item = req.params.item;
        const client = await operation.ConnectionDeMongodb();
        const db = client.db("Resto_awt");
        const produits = db.collection("Produit");
        const produitList = await produits.find().toArray();

        let produitSelectionne;
        produitList.forEach(function (produit) {
            if (produit._id == item) {
                produitSelectionne = produit;
            }
        })

        res.render('pages/item', { titrePage: item, Authentification: isLoggedIn, LoggedInForm: loggedInForm, Item: produitSelectionne });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/reviewList', async (req, res) => {
    const client = await operation.ConnectionDeMongodb();
    const db = client.db("Resto_awt");
    const review = db.collection("Review");
    const reviews = await review.find().toArray();
    reviews.forEach(element => {
        //  console.log(element);
    });
    res.render('pages/reviewList', { titrePage: "Reviews", Authentification: isLoggedIn, LoggedInForm: loggedInForm, Reviews: reviews });
});

app.get('/panier', async (req, res) => {
    res.render("pages/panier", { titrePage: "Panier", Authentification: isLoggedIn, LoggedInForm: loggedInForm });
});


/*
  Le post methode pour la page de Sign Up
*/
app.post("/signup", async (req, res) => {
    const password = req.body['sign-up-form-password'];
    const repassword = req.body['sign-up-form-repassword'];

    if (password.length > 50 || repassword.length > 50) {
        failedMessage = true;
        statusMessage = "Le mot de passe doit être inférieur à 50 caractères";
        return res.status(400).send('Le mot de passe doit être inférieur à 50 caractères');
    } else if (password !== repassword) {
        failedMessage = true;
        statusMessage = "Les mots de passe ne correspondent pas";
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
            statusMessage = "Un compte avec cet e-mail existe déjà";
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
app.post('/login', async (req, res) => {
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

            loggedInForm = {
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

/*
  Le post methode pour la page de Reservation
*/
app.post('/reservation', requireAuth, async (req, res) => {
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
app.post('/review', requireAuth, async (req, res) => {
    const titre = req.body['review-form-title'];
    const content = req.body['review-form-review'];
    const rating = req.body['review-form-rating'];

    try {
        const dbClient = await operation.ConnectionDeMongodb();
        const db = dbClient.db("Resto_awt");
        const review = db.collection("Review");

        const InputForm = {
            review_title: titre,
            review_text: content,
            review_rating: rating,
            review_prenom: loggedInForm.cl_prenom,
            review_nom: loggedInForm.cl_nom
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
app.post('/account', requireAuth, async (req, res) => {
    const conf_cl_password = req.body["account-form-conformation-password"];

    if (conf_cl_password == loggedInForm.cl_password) {
        const new_cl_prenom = req.body["account-form-prenom"];
        const new_cl_nom = req.body["account-form-nom"];
        const new_cl_courriel = req.body["account-form-email"];
        const new_cl_telephone = req.body["account-form-phone"];
        const new_cl_address = req.body["account-form-address"];
        const new_cl_code_postal = req.body["account-form-zip"];
        const new_cl_password = req.body["account-form-password"];
        const new_cl_repassword = req.body["account-form-repassword"];

        try {
            const client = await operation.ConnectionDeMongodb();
            const db = client.db("Resto_awt");
            const users = db.collection("Client");
            
            if ((new_cl_password == new_cl_repassword) && (new_cl_password != loggedInForm.cl_password)) {
                Object.assign(loggedInForm, {cl_password: new_cl_password})
            }
            if ((loggedInForm.cl_courriel != new_cl_courriel) || (loggedInForm.cl_telephone != new_cl_telephone)) {
                const existingCourriel = await users.findOne({ cl_courriel: new_cl_courriel });
                const existingTelephone = await users.findOne({ cl_telephone: new_cl_telephone });
                if ((!existingCourriel) || (!existingTelephone)) {
                    Object.assign(loggedInForm, {cl_courriel: new_cl_courriel, cl_telephone: new_cl_telephone})
                         
                    await users.updateOne({ cl_courriel: req.session.email }, { $set: loggedInForm });
                    req.session.email = new_cl_courriel;
                } else {
                    failedMessage = true;
                    statusMessage = "Un compte avec cet e-mail existe déjà";
                    return res.status(409).send('Un compte avec cet e-mail ou telephone existe déjà');
                }
            }
            Object.assign(loggedInForm, {cl_nom: new_cl_nom, cl_prenom: new_cl_prenom, cl_address: new_cl_address, cl_code_postal: new_cl_code_postal})
            await users.updateOne({ cl_courriel: req.session.email }, { $set: loggedInForm });
            res.redirect('/account');
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }
});

/*
   Methode post pour les items
*/
app.post('/menu/:item', requireAuth, async (req, res) => {
    const id = req.params.item;
    const nom = req.body["nom"];
    const quantite = req.body["quantite"];
    const prix = req.body["prix"];
    console.log(id);
    console.log(nom);
    console.log(quantite);
    console.log(prix);

    try{
        const client = await operation.ConnectionDeMongodb();
        const db = client.db("Resto_awt");
        const items = db.collection("Items");

        const ItemForm = {
            prod_id: id,
            item_nom: nom,
            item_quantite: quantite,
            item_prix: prix
        }

        await items.insertOne(ItemForm);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

/*
  Le post methode pour logout
*/

// Connecter au server
const server = app.listen(29017, function () {
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