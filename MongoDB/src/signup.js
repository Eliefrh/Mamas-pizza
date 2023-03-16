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

        // Variables selon les app.post
        let nom = "abc";
        let prenom = "abc";
        let telephone = "abc";
        let courriel = "abc";
        let codePostal = "abc";
        let password = "abc";
        let repassword = "abc";

        // Verification ici des mots de passe, donnees etc
        if(password == repassword){
            // Insertion des donnees dans la Base de donnees
            const document = { cl_nom: nom, cl_prenom: prenom, cl_telephone: telephone, cl_courriel: courriel, cl_code_postal: codePostal, cl_password: password };
            await collection.insertOne(document);
        }
    } finally {
        await mongoClient.close();
    }
}