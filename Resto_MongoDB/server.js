const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
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
let StatusMessage;

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

// app.get('/menu', async (req, res) => {
//     const produits = await ShowMenuList();
//     res.render("pages/menu", { titrePage: "Menu", Authentication: isLoggedIn, Produits: produits });
// });

// app.get('/panier', function (req, res) {
//     res.render("pages/panier", { titrePage: "Panier", Authentication: isLoggedIn });
// });

// app.get('/produitlist', function (req, res) {
//     res.render("pages/produit_list", { titrePage: "Produit List", Authentication: isLoggedIn });
// });

app.get('/', async (req, res) => {
    res.render('pages/index', { titrePage: "Mamma's Pizza's", Authentication: isLoggedIn});
});

app.get('/login', async (req, res) => {
    res.render('pages/login', { titrePage: "Login", Authentication: isLoggedIn });
});

app.get('/signup', async (req, res) => {
    res.render('pages/signup', { titrePage: "signup", Authentication: isLoggedIn, successMessage: successMessage, failedMessage: failedMessage, StatusMessage: StatusMessage });
});

app.get('/reservation', async (req, res) => {
  res.render("pages/reservation", { titrePage: "Reservation", Authentication: isLoggedIn });
});

app.get('/review', async (req, res) => {
  res.render("pages/review", { titrePage: "Review", Authentication: isLoggedIn });
});

app.get('/menu', async (req, res) => {
    res.render('pages/menu', { titrePage: "Menu", Authentication: isLoggedIn });
});

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
app.post("/signup", async (req, res) => {
    const password = req.body['sign-up-form-password'];
    const repassword = req.body['sign-up-form-repassword'];

    if (password.length > 50 || repassword.length > 50) {
      failedMessage = true;
      StatusMessage = "Le mot de passe doit être inférieur à 50 caractères";
      return res.status(400).send('Le mot de passe doit être inférieur à 50 caractères');
    }
    else if (password !== repassword) {
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
      cl_id: req.session.userId,
      review_title: titre,
      review_text: content,
      review_rating: rating
    }

    await review.insertOne(InputForm);
    res.redirect('/');
  } catch {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } 
});

// Connecter au server
const server = app.listen(29017, function () {
    console.log("serveur fonctionne sur 29017... ! ");
    console.log("http://localhost:29017/");
});

/*
  Le post methode pour logout
*/
app.post('/logout', requireAuth, async (req, res) => {
  isLoggedIn = false;
  req.session.userId = null;
  req.session.email = null;
  res.redirect('/');
});

// /**
//  * Bouton personnaliser dans le menu
//  */

// app.get('/menu/:item', (req, res) => {
//     const itemName = req.params.item;
//     const itemUrl = `/menu/${itemName}`;
//     res.redirect(itemUrl);
// });

// /* Bouton Ajouter au panier */


// app.get('/item', function (req, res) {
//     res.render("pages/item", { titrePage: "Item", Authentication: isLoggedIn });
// });

// app.post('/item', function (req, res) {
//     res.send('Item submitted successfully!');
// });