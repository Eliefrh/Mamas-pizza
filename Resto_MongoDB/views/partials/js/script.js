/* Menu page */
function redirectLogin() {
    window.location.href = `/login`;
}

function redirectToItem(item) {
    window.location.href = `/menu/${item}`;
}

/* Item page */
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

function deleteItem(itemId) {
    const deleteForm = document.getElementById('delete-form');
    const deleteId = document.getElementById('delete-id');
    deleteId.value = itemId;
    deleteForm.action = 'http://localhost:29017/panier';
    deleteForm.submit();
}

function emporter(){
    
}

function calculerPrixLivraison(codePostal){

}

function commander(){
    
}