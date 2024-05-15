CREATE DATABASE  IF NOT EXISTS `spgames` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `spgames`;
-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: spgames
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `catid` int NOT NULL AUTO_INCREMENT,
  `catname` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`catid`),
  UNIQUE KEY `catname` (`catname`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Action','An action game emphasizes physical challenges, including hand–eye coordination and reaction-time'),(2,'Horror','Spooky'),(3,'FPS','Shooting'),(4,'Puzzle','Brainy Games'),(5,'MOBA','Multiplayer online battle Arena'),(6,'RPG','Role Playing Game'),(7,'Adventure','Story Games');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game` (
  `gameid` int NOT NULL AUTO_INCREMENT,
  `image` varchar(50) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `year` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`gameid`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
INSERT INTO `game` VALUES (1,'../gameimages/hogwarts.jpg','Hogwarts Legacy','Hogwarts Legacy is a 2023 action role-playing game developed by Avalanche Software and published by Warner Bros.',2023,'2023-06-11 03:28:37'),(2,'../gameimages/halo.jpg','Halo 5','Master Chief go Pew Pew',2023,'2023-06-11 04:29:40'),(3,'../gameimages/horizonzerodawn.jpg','Horizon Zero Dawn','bow girl goes crazy',2023,'2023-06-11 04:40:18'),(4,'../gameimages/csgo.jpg','CSGO','CT vs T',2023,'2023-06-11 04:40:18'),(5,'../gameimages/warframe.jpg','Warframe','Space Ninjas',2013,'2023-06-18 22:05:29'),(6,'../gameimages/mario.jpg','Super Mario Bros 2','Mexican man jumps on turtles',2001,'2023-06-19 05:31:49'),(7,'../gameimages/league.jpg','League Of Legends','Anger Management Generator',2009,'2023-08-03 00:56:22'),(8,'../gameimages/dota2.jpg','Dota 2','Racism',2013,'2023-08-03 01:06:53'),(9,'../gameimages/apex.jpg','Apex Legends','Third partying fest',2019,'2023-08-06 11:16:56'),(10,'../gameimages/valorant.jpg','Valorant','Dating Sim',2020,'2023-08-06 11:18:39');
/*!40000 ALTER TABLE `game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gamecategory`
--

DROP TABLE IF EXISTS `gamecategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gamecategory` (
  `gameid` int NOT NULL,
  `gamecategoryid` int NOT NULL,
  PRIMARY KEY (`gameid`,`gamecategoryid`),
  KEY `catidfk_idx` (`gamecategoryid`),
  CONSTRAINT `catidfk` FOREIGN KEY (`gamecategoryid`) REFERENCES `category` (`catid`),
  CONSTRAINT `gameidfk3` FOREIGN KEY (`gameid`) REFERENCES `game` (`gameid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gamecategory`
--

LOCK TABLES `gamecategory` WRITE;
/*!40000 ALTER TABLE `gamecategory` DISABLE KEYS */;
INSERT INTO `gamecategory` VALUES (1,1),(3,1),(4,1),(5,1),(6,1),(2,3),(5,3),(9,3),(10,3),(7,5),(8,5),(1,6),(3,6),(5,6),(1,7),(2,7),(3,7),(5,7),(6,7);
/*!40000 ALTER TABLE `gamecategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gameprice`
--

DROP TABLE IF EXISTS `gameprice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gameprice` (
  `gameid` int NOT NULL,
  `price` float unsigned NOT NULL,
  `platformid` int NOT NULL,
  PRIMARY KEY (`gameid`,`platformid`),
  KEY `gameidfk_idx` (`gameid`),
  KEY `platformidfk_idx` (`platformid`),
  CONSTRAINT `gameidfk` FOREIGN KEY (`gameid`) REFERENCES `game` (`gameid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `platformidfk` FOREIGN KEY (`platformid`) REFERENCES `platform` (`platformid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gameprice`
--

LOCK TABLES `gameprice` WRITE;
/*!40000 ALTER TABLE `gameprice` DISABLE KEYS */;
INSERT INTO `gameprice` VALUES (1,69.9,1),(1,75.5,2),(1,80,3),(2,50.5,2),(2,10.5,3),(3,50,1),(4,20,3),(5,0,1),(5,0,2),(5,0,3),(6,79.9,1),(7,0,3),(8,0,3),(9,0,1),(9,0,2),(9,0,3),(10,0,3);
/*!40000 ALTER TABLE `gameprice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platform`
--

DROP TABLE IF EXISTS `platform`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platform` (
  `platformid` int NOT NULL AUTO_INCREMENT,
  `platform_name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`platformid`),
  UNIQUE KEY `platform_name` (`platform_name`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platform`
--

LOCK TABLES `platform` WRITE;
/*!40000 ALTER TABLE `platform` DISABLE KEYS */;
INSERT INTO `platform` VALUES (1,'Playstation','Playstation'),(2,'XBOX','Xbox'),(3,'PC','Computer'),(4,'Switch','Nintendo Switch');
/*!40000 ALTER TABLE `platform` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `reviewid` int NOT NULL AUTO_INCREMENT,
  `content` text,
  `rating` int DEFAULT NULL,
  `userid` int DEFAULT NULL,
  `gameid` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewid`),
  KEY `review_fk_1_idx` (`userid`),
  KEY `review_fk_2_idx` (`gameid`),
  CONSTRAINT `review_fk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `review_fk_2` FOREIGN KEY (`gameid`) REFERENCES `game` (`gameid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1,'Enjoyed the game! The story and gameplay was good!',5,1,1,'2023-06-11 06:33:17'),(2,'Meh',2,2,2,'2023-07-28 02:40:58'),(3,'Test website comment',3,2,1,'2023-07-28 02:40:58'),(28,'sebas loves men',5,3,3,'2023-08-02 23:52:36'),(39,'test',5,1,3,'2023-08-06 09:37:01'),(40,'Love you deyang',5,1,10,'2023-08-06 17:14:52'),(48,'I don\'t love SP anymore.',1,17,2,'2023-08-06 18:28:08'),(49,'Test2',2,1,2,'2023-08-06 19:14:56');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` enum('Admin','User') NOT NULL DEFAULT 'User',
  `profile_pic_url` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Amadeus','Amadeus@gmail.com','Pa$$w0rd','Admin','../profileimages/1.jpg','2023-06-11 06:30:52'),(2,'TestUser','Test@gmail.com','Pa$$w0rd','User','../profileimages/2.jpg','2023-06-18 02:06:53'),(3,'SPLover','splover@gmail.com','Pa$$w0rd','Admin','../profileimages/3.jpg','2023-06-18 20:25:29'),(4,'Terry Tan','Terry@gmail.com','Pa$$w0rd','User','../profileimages/4.jpg','2023-07-28 05:03:59'),(17,'Deyang','deyang@gmail.com','Pa$$w0rd','User','../profileimages/17.jpeg','2023-08-06 18:10:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-06 19:17:16
