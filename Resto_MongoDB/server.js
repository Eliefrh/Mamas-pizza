const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const { ObjectId } = require('mongodb');
const bodyParser = require("body-parser");
const { Module } = require('module');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const alert = require('node-notifier');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
import("dateformat");
const now = new Date();
const paypal = require('./paypal-api.js')
const bcrypt = require("bcryptjs");

// Paiement
require('dotenv').config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

// console.log(stripeSecretKey, stripePublicKey);
const operation = require('./operation');

const { config } = require('dotenv');
const { debug } = require('console');
config();

// Admin JS
const ImgPath = __dirname + '/views/partials/img';
const upload = multer({ dest: ImgPath });

module.exports = app;
let isLoggedIn = false;
let successMessage = false;
let failedMessage = false;
let statusMessage;
let loggedInForm;
let panierForm;
let CommandeLivraison;
let CommandeEmportement;

let adminPrivilege;
let employeePrivilege;

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
app.use('/js', express.static(__dirname + '/node_modules/adminjs'));
app.use('/html', express.static(__dirname + '/public'));

app.use(express.static('views/pages'));


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
function requireAdmin(req, res, next) {
    if (adminPrivilege) {
        return next();
    } else {
        res.writeHead(301, { Location: "http://localhost:29017/login" });
        res.end();
    }
}
function requireEmploye(req, res, next) {
    if (employeePrivilege) {
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
        res.render('pages/index', { titrePage: "Mamma's Pizza's", Authentification: isLoggedIn, LoggedInForm: loggedInForm, NosSpecial: NosSpecial,  adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur get accueil');
    }
});

app.get('/login', async (req, res) => {
    res.render('pages/login', { titrePage: "Login", Authentification: isLoggedIn, LoggedInForm: loggedInForm, adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege  });
});

app.get('/signup', async (req, res) => {
    res.render('pages/signup', { titrePage: "signup", Authentification: isLoggedIn, successMessage: successMessage, failedMessage: failedMessage, StatusMessage: statusMessage, LoggedInForm: loggedInForm, adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege  });
});

app.get('/reservation', async (req, res) => {
    res.render("pages/reservation", { titrePage: "Reservation", Authentification: isLoggedIn, LoggedInForm: loggedInForm, adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege  });
});

app.get('/review', async (req, res) => {
    res.render("pages/review", { titrePage: "Review", Authentification: isLoggedIn, LoggedInForm: loggedInForm, adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege  });
});

app.get('/account', async (req, res) => {
    res.render('pages/account', { titrePage: "Account", Authentification: isLoggedIn, LoggedInForm: loggedInForm, adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege  });
});
// app.get('/paiement', async (req, res) => {
//     res.render('pages/paiement.html', { titrePage: "Paiement" });
// });

app.get('/logout', async (req, res) => {
    isLoggedIn = false;
    req.session.userId = null;
    req.session.email = null;
    if (adminPrivilege) {
        adminPrivilege = false;
    }
    if (employeePrivilege) {
        employeePrivilege = false;
    }
    res.redirect('/');
});

app.get('/menu', async (req, res) => {
    try {
        const client = await operation.ConnectionDeMongodb();
        const db = client.db("Resto_awt");
        const produits = db.collection("Produit");
        const produitList = await produits.find().toArray();

        const categorie = new Set();
        produitList.forEach(function (produit) {
            categorie.add(produit.cat_nom);
        })

        res.render('pages/menu', { titrePage: "Menu", Authentification: isLoggedIn, LoggedInForm: loggedInForm, Produits: produitList, Categories: categorie, adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege  });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur get menu');
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

        res.render('pages/item', { titrePage: item, Authentification: isLoggedIn, LoggedInForm: loggedInForm, Item: produitSelectionne, adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege  });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur get item');
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
    res.render('pages/reviewList', { titrePage: "Reviews", Authentification: isLoggedIn, LoggedInForm: loggedInForm, Reviews: reviews, adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege  });
});

app.get('/panier', async (req, res) => {
    try {
        const client = await operation.ConnectionDeMongodb();
        const db = client.db("Resto_awt");
        const items = db.collection("Items");
        const produits = db.collection("Produit");

        const itemList = await items.find({ cl_id: req.session.userId }).toArray();
        const produitList = await produits.find().toArray();

        const taxeGST = 0.05; // Taxe 5%
        const taxeQST = 0.09975; // Taxe 9.975%

        let imageList = new Array();
        let sousTotal = 0;
        
        itemList.forEach(function (item) {
            produitList.forEach(function (produit) {
                if (item.prod_id == produit._id) {
                    imageList.push(produit.prod_image);
                }
            })
            sousTotal += parseFloat(item.item_prix);
        })

        let gst = sousTotal * taxeGST;
        let qst = sousTotal * taxeQST;
        let total = sousTotal + gst + qst;

        panierForm = {
            sousTotal: sousTotal.toFixed(2),
            gst: gst.toFixed(2),
            qst: qst.toFixed(2),
            total: total.toFixed(2)
        }

        res.render("pages/panier", { titrePage: "Panier", Authentification: isLoggedIn, LoggedInForm: loggedInForm, Items: itemList, PanierForm: panierForm, Images: imageList, stripePublicKey: stripePublicKey, adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege, CommandeLivraison:CommandeLivraison, CommandeEmportement:CommandeEmportement});
    } catch (err) {
        res.status(500).send('Erreur get panier');
    }
});

app.get('/panier/emporter', async (req, res) => {
    CommandeEmportement = true;
    CommandeLivraison = false;
    res.redirect("/panier");
});

app.get('/panier/livraison', async (req, res) => {
    CommandeEmportement = false;
    CommandeLivraison = true;
    res.redirect("/panier");
});

app.get('/checkout', async (req, res) => {
    res.render("pages/checkout", { titrePage: "Chekout", Authentification: isLoggedIn, LoggedInForm: loggedInForm, adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege});
});

// app.get('/paiement.html', (req, res) => {
//     res.sendFile('./views/pages/paiement.html');
// });

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
    } else if (password != repassword) {
        failedMessage = true;
        statusMessage = "Les mots de passe ne correspondent pas";
        return res.status(400).send('Les mots de passe ne correspondent pas');
    }

    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

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
            cl_password: hashedPassword
        };

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
        res.status(500).send('Erreur post signup');
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
        const user = await users.findOne({ cl_courriel: email });

        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.cl_password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid username or password');
        }

        req.session.email = email;
        req.session.userId = user._id.toString();

        loggedInForm = {
            cl_nom: user.cl_nom,
            cl_prenom: user.cl_prenom,
            cl_courriel: email,
            cl_telephone: user.cl_telephone,
            cl_address: user.cl_address,
            cl_code_postal: user.cl_code_postal,
            cl_password: user.cl_password
        }

        isLoggedIn = true;
        if (req.session.email == "Admin@Mammas.ca") {
            adminPrivilege = true;
            employeePrivilege = false;
            res.redirect('/admin/dashboard');
        } else if (req.session.email == "Employe@Mammas.ca") {
            employeePrivilege = true;
            adminPrivilege = false;
            res.redirect('/employe/dashboard');
        }
        else {
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur post login');
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
                date_reservation: datetime,
                status_reservation: "false"
            }

            await reservation.insertOne(InputForm);
            res.redirect('/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Erreur post reservation');
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
        res.status(500).send('Erreur post review');
    }
});

/*
  Le post methode pour la page account
*/
app.post('/account', requireAuth, async (req, res) => {
    const conf_cl_password = req.body["account-form-conformation-password"];
    const isPasswordValid = await bcrypt.compare(conf_cl_password, loggedInForm.cl_password);

    if (isPasswordValid) {
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
                const saltRounds = 10;
                const salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(new_cl_password, salt);
                Object.assign(loggedInForm, { cl_password: hashedPassword })
            }
            if ((loggedInForm.cl_courriel != new_cl_courriel) || (loggedInForm.cl_telephone != new_cl_telephone)) {
                const existingCourriel = await users.findOne({ cl_courriel: new_cl_courriel });
                const existingTelephone = await users.findOne({ cl_telephone: new_cl_telephone });
                if ((!existingCourriel) || (!existingTelephone)) {
                    Object.assign(loggedInForm, { cl_courriel: new_cl_courriel, cl_telephone: new_cl_telephone })

                    await users.updateOne({ cl_courriel: req.session.email }, { $set: loggedInForm });
                    req.session.email = new_cl_courriel;
                } else {
                    failedMessage = true;
                    statusMessage = "Un compte avec cet e-mail existe déjà";
                    return res.status(409).send('Un compte avec cet e-mail ou telephone existe déjà');
                }
            }
            Object.assign(loggedInForm, { cl_nom: new_cl_nom, cl_prenom: new_cl_prenom, cl_address: new_cl_address, cl_code_postal: new_cl_code_postal })
            await users.updateOne({ cl_courriel: req.session.email }, { $set: loggedInForm });
            res.redirect('/account');
        } catch (err) {
            console.error(err);
            res.status(500).send('Erreur post account');
        }
    }
});

/*
   Methode post pour les items
*/
app.post('/menu/:item', requireAuth, async (req, res) => {
    const id = req.params.item;
    const nom = req.body["nom"];
    const quantite = parseInt(req.body["quantite"]);
    const prix = parseFloat(req.body["prix"].slice(0, -1));

    try {
        const client = await operation.ConnectionDeMongodb();
        const db = client.db("Resto_awt");
        const items = db.collection("Items");
        let itemDouble = await items.findOne({ cl_id: req.session.userId, prod_id: id });

        if (itemDouble) {
            const itemDoubleQuantite = parseInt(itemDouble.item_quantite);
            const itemDoublePrix = parseFloat(itemDouble.item_prix);

            itemDouble = {
                item_quantite: quantite + itemDoubleQuantite,
                item_prix: (prix + itemDoublePrix).toFixed(2)
            }

            await items.updateOne({ cl_id: req.session.userId, prod_id: id }, { $set: itemDouble });
        } else {
            const ItemForm = {
                cl_id: req.session.userId,
                prod_id: id,
                item_nom: nom,
                item_quantite: quantite,
                item_prix: prix.toFixed(2)
            }

            await items.insertOne(ItemForm);
        }
        res.redirect("/menu");
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur post item');
    }
});


app.post('/panier', requireAuth, async (req, res) => {
    const itemId = req.body.id;
    try {
        const client = await operation.ConnectionDeMongodb();
        const db = client.db("Resto_awt");
        const items = db.collection("Items");
        await items.deleteOne({ _id: new ObjectId(itemId) });
        res.redirect("/panier");
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur post panier');
    }
});

// parse post params sent in body in json format
app.use(express.json());

app.post("/my-server/create-paypal-order", async (req, res) => {
    console.log('paypal');
    try {
        const order = await createOrder();
        res.json(order);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/my-server/capture-paypal-order", async (req, res) => {
    const { orderID } = req.body;
    try {
        const captureData = await capturePayment(orderID);
        res.json(captureData);
    } catch (err) {
        res.status(500).send(err.message);
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




// Admin section

app.get('/admin/dashboard', async (req, res) => {
    try {
        const mongo = await operation.ConnectionDeMongodb();
        const db = mongo.db("Resto_awt");

        const produit = db.collection("Produit");
        const client = db.collection("Client");
        const reservation = db.collection("Reservation");
        const commande = db.collection("Commande");
        const items = db.collection("Items")

        const numProduit = await produit.countDocuments();
        const numClient = await client.countDocuments();
        const numCommande = await commande.countDocuments();
        const numReservation = await reservation.countDocuments();

        const mostCommande = await commande.find().sort({ date: -1 }).limit(4).toArray();

        res.render('pages/admin/pages/dashboard', { titrePage: "Dashboard", numProduit: numProduit, numClient: numClient, numCommande: numCommande, numReservation: numReservation, mostCommande: mostCommande, adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/admin/nosproduits', async (req, res) => {
    try {
        const mongo = await operation.ConnectionDeMongodb();
        const db = mongo.db("Resto_awt");

        const produit = db.collection("Produit");
        const listProduit = await produit.find().toArray();

        const categories = new Set();
        listProduit.forEach(function (produit) {
            categories.add(produit.cat_nom);
        })

        res.render('./pages/admin/pages/produit', { titrePage: "Nos Produit", Authentification: isLoggedIn, listProduit: listProduit, categories: categories, adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

app.get('/admin/nosproduits/editer', async (req, res) => { });

app.get('/admin/editproduit/:prd', async (req, res) => {
    try {
        const id = req.params.prd;
        const mongo = await operation.ConnectionDeMongodb();
        const db = mongo.db("Resto_awt");

        const produit = db.collection("Produit");
        const OneProduit = await produit.findOne({ _id: new ObjectId(id) });
        res.render('pages/admin/pages/edit-produit', { titrePage: "Éditer ProduitS", OneProduit: OneProduit, adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

app.get('/admin/ajoutproduit', async (req, res) => {
    res.render('pages/admin/pages/add-produit', { titrePage: "Ajout Produit", adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege });
});

app.get('/admin/livraison', async (req, res) => {
    res.render('pages/admin/pages/livraison', { titrePage: "Livraison", adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege });
});

app.get('/admin/emporter', async (req, res) => {
    res.render('pages/admin/pages/emporter', { titrePage: "Emportement", adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege });
});

app.get('/admin/reservations', async (req, res) => {
    try {
        const mongo = await operation.ConnectionDeMongodb();
        const db = mongo.db("Resto_awt");

        const reservation = db.collection("Reservation");
        const client = db.collection("Client");

        const listReservation = await reservation.find().toArray();
        const listClient = await client.find().toArray();
        res.render('./pages/admin/pages/reservation', { titrePage: "Reservation", Authentification: isLoggedIn, listReservation: listReservation, listClient: listClient, adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/admin/logout', async (req, res) => {
    isLoggedIn = false;
    req.session.userId = null;
    req.session.email = null;
    if (adminPrivilege) {
        adminPrivilege = false;
    }
    if (employeePrivilege) {
        employeePrivilege = false;
    }
    res.redirect('/');
});

app.get('/admin/utilisateurs', async (req, res) => {
    try {
        const mongo = await operation.ConnectionDeMongodb();
        const db = mongo.db("Resto_awt");

        const client = db.collection("Client");
        
        const listClient = await client.find().toArray();
        res.render('pages/admin/pages/user-list', { titrePage: "Ajout Produit", adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege, listClient:listClient });
    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.post('/admin/reservations', async (req, res) => {
    const reservationId = req.body.id;
    try {
        const client = await operation.ConnectionDeMongodb();
        const db = client.db("Resto_awt");
        const reservation = db.collection("Reservation");

        const reservationObject = await reservation.findOne({ _id: new ObjectId(reservationId) });
        Object.assign(reservationObject, { status_reservation: "true" });

        const reservationUpdate = await reservation.updateOne({ _id: new ObjectId(reservationId) }, { $set: reservationObject });

        res.redirect("/admin/reservations");
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

app.post('/admin/nosproduits', async (req, res) => {
    const produitId = req.body.id;
    try {
        const client = await operation.ConnectionDeMongodb();
        const db = client.db("Resto_awt");
        const produit = db.collection("Produit");

        await produit.deleteOne({ _id: new ObjectId(produitId) });
        res.redirect("/admin/nosproduits");
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

app.post('/admin/editproduit/:prd', async (req, res) => {
    const produitId = req.params.prd;
    const nom = req.body['admin-edit-nom'];
    const prix = req.body['admin-edit-prix'];
    const categorie = req.body['admin-edit-categorie'];
    const description = req.body['admin-edit-description'];
    const image = req.body['admin-edit-input-image'];
    try {
        const client = await operation.ConnectionDeMongodb();
        const db = client.db("Resto_awt");
        const produit = db.collection("Produit");

        if (image == "") {
            productForm = {
                prod_nom: nom,
                prod_description: description,
                prod_prix: prix,
                cat_nom: categorie
            }

            await produit.updateOne({ _id: new ObjectId(produitId) }, { $set: productForm });
            res.redirect("/admin/nosproduits");
        } else {

            new_image = "img/" + image;

            productForm = {
                prod_nom: nom,
                prod_description: description,
                prod_prix: prix,
                prod_image: new_image,
                cat_nom: categorie
            }

            await produit.updateOne({ _id: new ObjectId(produitId) }, { $set: productForm });
            res.redirect("/admin/nosproduits");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

app.post('/admin/ajoutproduit', async (req, res) => {
    const nom = req.body['ajout-nom'];
    const prix = req.body['ajout-prix'];
    const categorie = req.body['ajout-categorie'];
    const description = req.body['ajout-description'];
    const image = req.body['ajout-input-image'];
    try {
        const client = await operation.ConnectionDeMongodb();
        const db = client.db("Resto_awt");
        const produit = db.collection("Produit");

        new_image = "img/" + image;

        productForm = {
            prod_nom: nom,
            prod_description: description,
            prod_prix: prix,
            prod_image: new_image,
            cat_nom: categorie
        }

        await produit.insertOne(productForm);
        res.redirect('/admin/nosproduits');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// Employer section dans le admin 

app.get('/employe/dashboard', async (req, res) => {
    try {
        const mongo = await operation.ConnectionDeMongodb();
        const db = mongo.db("Resto_awt");

        const reservation = db.collection("Reservation");
        const client = db.collection("Client");

        listReservation = await reservation.find().limit(5).toArray();
        listClient = await client.find().toArray();

        res.render('./pages/admin/pages/employer-dashboard', { titrePage: "Dashboard", Authentification: isLoggedIn, adminPrivilege:adminPrivilege, employeePrivilege:employeePrivilege, listReservation:listReservation, listClient:listClient });
    } catch(err){
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// Section du paiement
let fetch;
import('node-fetch')
    .then(nodeFetch => {
        fetch = nodeFetch.default;
    });

const { CLIENT_ID, APP_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

async function createOrder() {
    console.log("create orderrrrr")
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: "50.00",
                    },
                },
            ],
        }),
    });

    return handleResponse(response);
}

async function capturePayment(orderId) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return handleResponse(response);
}

async function generateAccessToken() {
    const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "post",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });

    const jsonData = await handleResponse(response);
    return jsonData.access_token;
}

async function handleResponse(response) {
    if (response.status === 200 || response.status === 201) {
        return response.json();
    }

    const errorMessage = await response.text();
    throw new Error(errorMessage);
}

