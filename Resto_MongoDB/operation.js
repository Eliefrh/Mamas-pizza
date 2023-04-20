const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = process.env.DB_URi;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
// const StripeCheckout = 'https://checkout.strip.com/checkout.ejs';
const StripeCheckout = require('stripe-checkout');


let mongoClient;

// Connection MongoDB
async function ConnectionDeMongodb() {

    try {
        mongoClient = new MongoClient(uri);
        console.log("Connection a MongoDB...");
        mongoClient.connect();
        console.log("Connecte a MongoDB!");
        return mongoClient;
    } catch (error) {
        console.error("Erreur de connecxion a MongoDB!", error);

        process.exit();
    }
}

// Connection MongoDB dans admin


async function SignupForm(formInput) {
    try {
        mongoClient = await ConnectionDeMongodb();
        const db = mongoClient.db("Resto_awt");
        const collection = db.collection("Client");
        await CreateClient(collection, formInput);
    } catch (error) {
        console.error(error);
    } finally {
        await mongoClient.close();
    }
}

async function LoginForm(email, password) {
    try {
        mongoClient = await ConnectionDeMongodb();
        const db = mongoClient.db("Resto_awt");
        const collection = db.collection("Client");
        await FindClient(collection, email, password);
    } finally {
        await mongoClient.close();
    }
}


async function ReservationForm(formInput) {
    try {
        mongoClient = await ConnectionDeMongodb();
        const db = mongoClient.db("Resto_awt");
        const collection = db.collection("Reservation");
        await CreateReservation(collection, formInput)
    } finally {
        await mongoClient.close();
    }
}

async function ReviewForm(formInput) {
    try {
        mongoClient = await ConnectionDeMongodb();
        const db = mongoClient.db("Resto_awt");
        const collection = db.collection("Review");
        await CreateReview(collection, formInput);
    } finally {
        await mongoClient.close();
    }
}

// Menu operation
async function ShowMenuList() {
    try {
        mongoClient = await ConnectionDeMongodb();
        const db = mongoClient.db("Resto_awt");
        const collection = db.collection("Produit");
        const produits = await FindProduit(collection);
        return produits;
    } finally {
        await mongoClient.close();
    }
}

async function ItemsForm(menuInput) { // produit id, quantite, prix total, id client
    try {
        mongoClient = await ConnectionDeMongodb();
        const db = mongoClient.db("Resto_awt");
        const collection = db.collection("Items");
        await CreateItem(collection, menuInput);
    } finally {
        await mongoClient.close();
    }
}

// Small operation

async function CreateClient(collection, formInput) {
    await collection.insertOne(formInput);
}

async function CreateReservation(collection, formInput) {
    await collection.insertOne(formInput);
}

async function FindClient(collection, email, password) {
    await collection.findOne({ cl_courriel: email, cl_password: password });
}

async function CreateReview(collection, formInput) {
    await collection.insertOne(formInput);
}

async function FindProduit(collection) {
    await collection.find({}, { _id: 1, prod_nom: 1, prod_description: 1 }.toArray());
}

async function CreateItem(collection, menuInput) {
    await collection.insertOne(menuInput);
}



//payement creditCard
// const stripeHandler = new StripeCheckout({
//     key: stripePublicKey,
//     locale: 'en',
//     token: function (token) {
//     }
// });

// function purchaseClicked() {

//     var priceElement = document.getElementsByClassName('cart-totale-price')[0]
//     var price = parseFloat(priceElement.innerText.replace('$', '')) * 100
//     stripeHandler.open({
//         amount: price
//     })
// }


module.exports = { SignupForm };
module.exports = { LoginForm };
module.exports = { ReservationForm };
module.exports = { ReviewForm };
module.exports = { ShowMenuList };
module.exports = { ItemsForm };
module.exports = { ConnectionDeMongodb };
// module.exports = { purchaseClicked };
