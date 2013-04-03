/*
SQLyog Community v10.41 
MySQL - 5.5.20 : Database - tourplandemo
*********************************************************************
*/


CREATE TABLE `assignment` (
  `assignment_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee` text NOT NULL,
  `usr` text NOT NULL,
  `tour_date` text NOT NULL,
  `company` text NOT NULL,
  `city` text NOT NULL,
  `assignment` text NOT NULL,
  `priority` text NOT NULL,
  `tour_comment` text NOT NULL,
  `status` text,
  `reason` text,
  `result` text,
  `barcode` text,
  PRIMARY KEY (`assignment_id`)
);
CREATE TABLE `employee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` text NOT NULL,
  `employee` text NOT NULL,
  `usr` text NOT NULL,
  `email` text NOT NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE `place` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company` text NOT NULL,
  `city` text NOT NULL,
  PRIMARY KEY (`id`)
);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
