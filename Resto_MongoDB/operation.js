const MongoClient = require('mongodb').MongoClient;

// Connection MongoDB
async function ConnectionDeMongodb(uri) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        console.log("Connection a MongoDB...");
        await mongoClient.connect();
        console.log("Connecte a MongoDB!");
        return mongoClient;
    } catch (error) {
        console.error("Erreur de connecxion a MongoDB!", error);
        process.exit();
    }
}

// Form Operation

async function SignupForm(formInput) {
    const uri = process.env.DB_URi;
    let mongoClient;

    try {
        mongoClient = await ConnectionDeMongodb(uri);
        const db = mongoClient.db("Resto_awt");
        const collection = db.collection("Client");
        await CreateClient(collection, formInput);
    } finally {
        await mongoClient.close();
    }
}

async function LoginForm(email, password) {
    const uri = process.env.DB_URi;
    let mongoClient;

    try {
        mongoClient = await ConnectionDeMongodb(uri);
        const db = mongoClient.db("Resto_awt");
        const collection = db.collection("Client");
        await FincClient(collection, email, password);
    } finally {
        await mongoClient.close();
    }
}

async function ReservationForm(formInput) {
    const uri = process.env.DB_URi;
    let mongoClient;

    try {
        mongoClient = await ConnectionDeMongodb(uri);
        const db = mongoClient.db("Resto_awt");
        const collection = db.collection("Reservation");
        await CreateReservation(collection, formInput)
    } finally {
        await mongoClient.close();
    }
}

async function ReviewForm(formInput) {
    const uri = process.env.DB_URi;
    let mongoClient;

    try {
        mongoClient = await ConnectionDeMongodb(uri);
        const db = mongoClient.db("Resto_awt");
        const collection = db.collection("Review");
        await CreateReview(collection, formInput);
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

async function FincClient(collection, email, password) {
    await collection.findOne({ cl_courriel: email, cl_password: password });
}

async function CreateReview(collection, formInput) {
    await collection.insertOne(formInput);
}