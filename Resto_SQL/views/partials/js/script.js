/* Item Page */

function decrementer(){
    const quantite = document.getElementById("item-quantite");
    const prixTotal = document.getElementById("item-prix");
    const prixUnitaire = 5;
    //const prixUnitaire = prixTotal.innerHTML.slice(0, prixTotal.innerHTML.length - 1);
    let compteur = quantite.innerHTML;
    let prix;

    if(compteur > 0){
        compteur--;
        quantite.innerHTML = compteur;
        prix = compteur * prixUnitaire;
        prixTotal.innerHTML = prix + "$";
    }
}

function incrementer(){
    const quantite = document.getElementById("item-quantite");
    const prixTotal = document.getElementById("item-prix");
    const prixUnitaire = 5;
    //const prixUnitaire = prixTotal.innerHTML.slice(0, prixTotal.innerHTML.length - 1);
    let compteur = quantite.innerHTML;
    let prix;

    compteur++;
    quantite.innerHTML = compteur;
    prix = compteur * prixUnitaire;
    prixTotal.innerHTML = prix + "$";
}

function ajouterAuPanier(){
    // Envoie le nom du produit, la quantite et le prix total dans le panier
    const nom = document.getElementById("item-titre");
    const quantite = document.getElementById("item-quantite");
    const prixTotal = document.getElementById("item-prix");

    if(quantite == 0){

    }
}

function redirectToItemPage(itemName){
    const itemUrl = `/menu/${itemName}`;
    const data = {
        itemName: itemName
    }
    window.location.href = itemUrl;
}

/* Signup Page */

