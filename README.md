# Mamma's Pizzeria -

## Installation

1. Installer [Git](https://git-scm.com/downloads) sur votre ordinateur.

2. Ouvrir votre terminal pour installer Git ou pour le mettre à jour.
```bash
git --version
```
3. Cloner le répertoire dans votre dossier de travail.
```bash
git clone https://github.com/Eliefrh/AWT-.git
```

4. Ouvrir le répertoire dans un éditeur de code. [Visual Studio Code](https://code.visualstudio.com/)

## Pour utiliser la version NoSQL

1. Naviguer dans le dossier Resto_MongoDB.

2. Installer les dépendances
```bash
npm install
```

3. Installer une base de données NoSQL. [MongoDB Compass](https://www.mongodb.com/try/download/atlascli)

4. Créer une connection locale
```bash
mongodb://localhost:27017
```

5. Créer une base de données
```bash
Resto_AWT
```

6. Créer 6 collections:
```bash
Client
Commande
Items
Produit
Reservation
Review
```

7. Copier les scripts d'insertions du dossier MongoDB-Insert

8. Coller les scripts dans les collections: 
```bash
ADD DATA
Insert document
```

9.ADD DATA Insert document

10. Ouvrir le terminal de Visual Studio Code et saisir:
```bash
npx nodemon server.js
```

11. Cliquer le lien
```bash
http://localhost:29017/
```

## Pour utiliser la version SQL

1. Naviguer dans le dossier Resto_SQL

2. Installer les dépendances
```bash
npm install
```
3. Installer une base de données SQL. [WampServer](https://sourceforge.net/projects/wampserver/)

4. Créer une connection locale
```bash
localhost:27017
```
