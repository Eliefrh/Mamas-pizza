function decrementer(prixUnitaire){
    const quantite = document.getElementById("item-quantite");
    const prix = document.getElementById("item-prix");
    let compteur = quantite.value;

    if(compteur > 1){
        compteur--;
        quantite.value--;
        let prixTotal = quantite.value * prixUnitaire;
        prix.value = prixTotal.toFixed(2) + "$";
    }
}

function incrementer(prixUnitaire){
    const quantite = document.getElementById("item-quantite");
    const prix = document.getElementById("item-prix");

    quantite.value++;
    let prixTotal = quantite.value * prixUnitaire;
    prix.value = prixTotal.toFixed(2) + "$";
}

/*
function ajouterAuPanier() {
    // Envoie le nom du produit, la quantite et le prix total dans le panier
    const nom = document.getElementById("item-titre");
    const quantite = document.getElementById("item-quantite");
    const prixTotal = document.getElementById("item-prix");

    if (quantite == 0) {

    }
}
*/

/* Menu page */
function redirectLogin() {
    window.location.href = `/login`;
}

function redirectToItem(item) {
    window.location.href = `/menu/${item}`;
}