/* Menu page */
function redirectLogin() {
    window.location.href = `/login`;
}

function redirectToItem(item) {
    window.location.href = `/menu/${item}`;
}

/* Item page */
function decrementer(prixUnitaire) {
    const quantite = document.getElementById("item-quantite");
    const prix = document.getElementById("item-prix");
    let compteur = quantite.value;

    if (compteur > 1) {
        compteur--;
        quantite.value--;
        let prixTotal = quantite.value * prixUnitaire;
        prix.value = prixTotal.toFixed(2) + "$";
    }
}

function incrementer(prixUnitaire) {
    const quantite = document.getElementById("item-quantite");
    const prix = document.getElementById("item-prix");

    quantite.value++;
    let prixTotal = quantite.value * prixUnitaire;
    prix.value = prixTotal.toFixed(2) + "$";
}

function deleteItem(itemId) {
    const deleteForm = document.getElementById('delete-form');
    const deleteId = document.getElementById('delete-id');
    deleteId.value = itemId;
    deleteForm.action = 'http://localhost:29017/panier';
    deleteForm.submit();
}

function emporter() {

}

function calculerPrixLivraison(codePostal) {

}

function commander() {

}


// Page reservation dans la section admin

function setArrivedReservation(reservationID) {
    const reservationForm = document.getElementById('setArrived-form');
    const reservationId = document.getElementById('setArrived-id');
    reservationId.value = reservationID;
    reservationForm.action = 'http://localhost:29017/admin/reservations';
    reservationForm.submit();
}

// Page nos produit dans la section admin

function deleteProduit(produitID) {
    const produitForm = document.getElementById('produit-form');
    const produitId = document.getElementById('produit-id');
    produitId.value = produitID;
    produitForm.action = 'http://localhost:29017/admin/nosproduits';
    produitForm.submit();
}

function editProduit(prd) {
    window.location.href = `/admin/editproduit/${prd}`;
}

function paiement() {
    window.location.href = `/paiement`;
}