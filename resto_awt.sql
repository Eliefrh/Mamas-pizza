-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 09, 2023 at 08:17 PM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `resto_awt`
--

-- --------------------------------------------------------

--
-- Table structure for table `categorie`
--

DROP TABLE IF EXISTS `categorie`;
CREATE TABLE IF NOT EXISTS `categorie` (
  `cat_id` int NOT NULL,
  `cat_nom` varchar(30) NOT NULL,
  `cat_description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`cat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categorie`
--

INSERT INTO `categorie` (`cat_id`, `cat_nom`, `cat_description`) VALUES
(1, 'pizzas', 'Les meilleurs pizzas fait maison à montréal '),
(2, 'poutines', 'Des vrais poutines québecois'),
(3, 'desserts', 'Ca vous prend un bon dessert aprés vos repas chez nous ');

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
CREATE TABLE IF NOT EXISTS `client` (
  `cl_id` int NOT NULL,
  `cl_nom` varchar(30) NOT NULL,
  `cl_prenom` varchar(30) NOT NULL,
  `cl_telephone` varchar(12) NOT NULL,
  `cl_courriel` varchar(100) NOT NULL,
  `cl_code_postal` varchar(6) NOT NULL,
  `cl_address` varchar(200) NOT NULL,
  `cl_password` varchar(50) NOT NULL,
  `resto_id` int NOT NULL,
  PRIMARY KEY (`cl_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`cl_id`, `cl_nom`, `cl_prenom`, `cl_telephone`, `cl_courriel`, `cl_code_postal`, `cl_address`, `cl_password`, `resto_id`) VALUES
(31569, 'singh', 'gaurav', '4384561324', '2215536@bdeb.qc.ca', 'h1ll1h', '10500 boul de l\'acadie, montreal', '1111', 2645),
(56513, 'alfrieh', 'elie', '5144155145', '2067396@bdeb.qc.ca', 'h4nn4h', '10500 bois de boulogne , montreal', '0000', 2645),
(64587, 'hua', 'anthony', '5144567894', '2183423@bdeb.qc.ca', 'h1zz1h', '1500 cote vertu, montreal', '2222', 2645);

-- --------------------------------------------------------

--
-- Table structure for table `facture`
--

DROP TABLE IF EXISTS `facture`;
CREATE TABLE IF NOT EXISTS `facture` (
  `fac_id` int NOT NULL,
  `fac_total` float NOT NULL,
  `pan_id` int NOT NULL,
  `cl_id` int NOT NULL,
  `date_facturer` datetime NOT NULL,
  PRIMARY KEY (`fac_id`),
  UNIQUE KEY `pan_id` (`pan_id`),
  UNIQUE KEY `cl_id` (`cl_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `facture`
--

INSERT INTO `facture` (`fac_id`, `fac_total`, `pan_id`, `cl_id`, `date_facturer`) VALUES
(41127, 50.65, 2, 31569, '2023-02-09 19:38:01'),
(65425, 44.17, 1, 56513, '2023-02-09 19:38:01');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE IF NOT EXISTS `items` (
  `it_id` int NOT NULL,
  `prod_id` int NOT NULL,
  `it_quantite` int NOT NULL,
  PRIMARY KEY (`it_id`),
  UNIQUE KEY `prod_id` (`prod_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `panier`
--

DROP TABLE IF EXISTS `panier`;
CREATE TABLE IF NOT EXISTS `panier` (
  `pan_id` int NOT NULL,
  `it_id` int NOT NULL,
  PRIMARY KEY (`pan_id`),
  UNIQUE KEY `it_id` (`it_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `produits`
--

DROP TABLE IF EXISTS `produits`;
CREATE TABLE IF NOT EXISTS `produits` (
  `prod_id` int NOT NULL,
  `prod_nom` varchar(30) NOT NULL,
  `prod_ingredient` varchar(200) NOT NULL,
  `prod_prix` float NOT NULL,
  `prod_calories` int NOT NULL,
  `prod_img` varchar(200) NOT NULL,
  `cat_id` int NOT NULL,
  PRIMARY KEY (`prod_id`),
  UNIQUE KEY `cat_id` (`cat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `produits`
--

INSERT INTO `produits` (`prod_id`, `prod_nom`, `prod_ingredient`, `prod_prix`, `prod_calories`, `prod_img`, `cat_id`) VALUES
(6512, 'lava pizza', 'Pizza toute garnie avec spaghetti et sauce à la viande', 18, 500, 'https://cdn.restomenu.com/web/img/section/6134/7ce5f86b70877e3bd89737b028ce57a9.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE IF NOT EXISTS `reservation` (
  `reservation_id` int NOT NULL,
  `reserver_id` int NOT NULL,
  `num_siege` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `reserver`
--

DROP TABLE IF EXISTS `reserver`;
CREATE TABLE IF NOT EXISTS `reserver` (
  `reserver_id` int NOT NULL,
  `cl_id` int NOT NULL,
  `num_siege_reserve` int NOT NULL,
  `date_reserve` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `facture`
--
ALTER TABLE `facture`
  ADD CONSTRAINT `facture_ibfk_1` FOREIGN KEY (`cl_id`) REFERENCES `client` (`cl_id`);

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`prod_id`) REFERENCES `produits` (`prod_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `panier`
--
ALTER TABLE `panier`
  ADD CONSTRAINT `panier_ibfk_1` FOREIGN KEY (`it_id`) REFERENCES `items` (`it_id`),
  ADD CONSTRAINT `panier_ibfk_2` FOREIGN KEY (`pan_id`) REFERENCES `facture` (`pan_id`);

--
-- Constraints for table `produits`
--
ALTER TABLE `produits`
  ADD CONSTRAINT `produits_ibfk_1` FOREIGN KEY (`cat_id`) REFERENCES `categorie` (`cat_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
