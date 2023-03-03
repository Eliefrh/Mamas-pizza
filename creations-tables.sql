-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 03, 2023 at 06:29 PM
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
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
CREATE TABLE IF NOT EXISTS `client` (
  `cl_id` int NOT NULL AUTO_INCREMENT,
  `cl_nom` varchar(30) NOT NULL,
  `cl_prenom` varchar(30) NOT NULL,
  `cl_telephone` varchar(12) NOT NULL,
  `cl_courriel` varchar(100) NOT NULL,
  `cl_code_postal` varchar(6) NOT NULL,
  `cl_address` varchar(200) NOT NULL,
  `cl_password` varchar(50) NOT NULL,
  `resto_id` int NOT NULL,
  PRIMARY KEY (`cl_id`),
  UNIQUE KEY `cl_id` (`cl_id`)
) ENGINE=InnoDB AUTO_INCREMENT=64590 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`cl_id`, `cl_nom`, `cl_prenom`, `cl_telephone`, `cl_courriel`, `cl_code_postal`, `cl_address`, `cl_password`, `resto_id`) VALUES
(1, '', '', '', 'asdfg@vsdhjkbf.com', '', '', 'd', 0),
(31569, 'singh', 'gaurav', '4384561324', '2215536@bdeb.qc.ca', 'h1ll1h', '10500 boul de l\'acadie, montreal', '1111', 2645),
(56513, 'alfrieh', 'elie', '5144155145', '2067396@bdeb.qc.ca', 'h4nn4h', '10500 bois de boulogne , montreal', '0000', 2645),
(64587, 'hua', 'anthony', '5144567894', '2183423@bdeb.qc.ca', 'h1zz1h', '1500 cote vertu, montreal', '2222', 2645),
(64588, '', '', '', 'dgfhdershgf@ksdfgkjds.com', '', '', 'dgfshsfhgsgfh', 0),
(64589, 'fhgvnfersgffd', '', '', 'dgfhdershgf@ksdfgkjds.com', '', '', 'dgfshsfhgsgfh', 0);

-- --------------------------------------------------------

--
-- Table structure for table `commande`
--

DROP TABLE IF EXISTS `commande`;
CREATE TABLE IF NOT EXISTS `commande` (
  `fac_id` int NOT NULL AUTO_INCREMENT,
  `fac_total` float NOT NULL,
  `cl_id` int NOT NULL,
  `date_commande` datetime NOT NULL,
  `it_id` int NOT NULL,
  PRIMARY KEY (`fac_id`),
  UNIQUE KEY `cl_id` (`cl_id`),
  UNIQUE KEY `it_id` (`it_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE IF NOT EXISTS `items` (
  `it_id` int NOT NULL AUTO_INCREMENT,
  `prod_id` int NOT NULL,
  `it_quantite` int NOT NULL,
  PRIMARY KEY (`it_id`),
  UNIQUE KEY `prod_id` (`prod_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `produits`
--

DROP TABLE IF EXISTS `produits`;
CREATE TABLE IF NOT EXISTS `produits` (
  `prod_id` int NOT NULL AUTO_INCREMENT,
  `prod_nom` varchar(30) NOT NULL,
  `prod_ingredient` varchar(200) NOT NULL,
  `prod_prix` float NOT NULL,
  `prod_calories` int NOT NULL,
  `cat_nom` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`prod_id`)
) ENGINE=InnoDB AUTO_INCREMENT=85753 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `produits`
--

INSERT INTO `produits` (`prod_id`, `prod_nom`, `prod_ingredient`, `prod_prix`, `prod_calories`, `cat_nom`) VALUES
(3156, 'pizza fromage', 'fromage', 15.75, 450, 'pizza'),
(6512, 'lava pizza', 'Pizza toute garnie avec spaghetti et sauce à la viande', 18, 500, 'pizza'),
(7413, 'pizza poulet buffalo', 'Poulet grillé, sauce buffalo, fromage mozzarella et dressing au fromage bleu', 19.25, 545, 'pizza'),
(9456, 'pizza aux champignons', 'Champignons grillés, fromage mozzarella et sauce tomate', 16.75, 435, 'pizza'),
(85752, 'hawaiian pizza', 'Jambon, ananas, fromage mozzarella et sauce tomate', 17.5, 550, 'pizza');

-- --------------------------------------------------------

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE IF NOT EXISTS `reservation` (
  `reservation_id` int NOT NULL AUTO_INCREMENT,
  `num_siege` int NOT NULL,
  `cl_id` int NOT NULL,
  `date_reservation` datetime NOT NULL,
  PRIMARY KEY (`reservation_id`),
  UNIQUE KEY `cl_id` (`cl_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
CREATE TABLE IF NOT EXISTS `review` (
  `cl_id` int NOT NULL,
  `review_id` int NOT NULL AUTO_INCREMENT,
  `etoiles` int NOT NULL,
  `text` varchar(1000) NOT NULL,
  PRIMARY KEY (`review_id`),
  UNIQUE KEY `cl_id` (`cl_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `commande`
--
ALTER TABLE `commande`
  ADD CONSTRAINT `commande_ibfk_3` FOREIGN KEY (`cl_id`) REFERENCES `client` (`cl_id`),
  ADD CONSTRAINT `commande_ibfk_4` FOREIGN KEY (`it_id`) REFERENCES `items` (`it_id`);

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`prod_id`) REFERENCES `produits` (`prod_id`);

--
-- Constraints for table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`cl_id`) REFERENCES `client` (`cl_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`cl_id`) REFERENCES `client` (`cl_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
