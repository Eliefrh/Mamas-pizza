import { MongoClient } from "mongodb";

export async function connectToMongo(uri) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        console.log("Connection a MongoDB...");
        await mongoClient.connect();
        console.log("Connecte a MongoDB!");

        return mongoClient;
    } catch (error) {
        console.error("Erreur de connection a MongoDB!", error);
        process.exit();
    }
}

export async function executeSignUpOperations() {
    const uri = 'mongodb://127.0.0.1:27017/Resto_awt';
    let mongoClient;

    try {
        mongoClient = await connectToMongo(uri);
        const db = mongoClient.db("Resto_awt");
        const collection = db.collection("Client");

        // Variables
        let nom;
        let prenom;


        // Insertion
        const document = { cl_nom: nom };
        await collection.insertOne(document);
    } finally {
        await mongoClient.close();
    }
}