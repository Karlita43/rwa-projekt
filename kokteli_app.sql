-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 28, 2026 at 08:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kokteli_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-featured_cocktails', 'O:29:\"Illuminate\\Support\\Collection\":2:{s:8:\"\0*\0items\";a:3:{i:0;a:4:{s:2:\"id\";i:9;s:4:\"name\";s:12:\"Whiskey Sour\";s:11:\"description\";s:111:\"Savršen balans između kiselosti limuna i glatkoće viskija. S popularnim dodatkom jaja za savršenu teksturu.\";s:9:\"image_url\";s:16:\"whiskey_sour.jpg\";}i:1;a:4:{s:2:\"id\";i:8;s:4:\"name\";s:12:\"Piña Colada\";s:11:\"description\";s:112:\"Egzotični koktel s rumom, ananasom i kokosovim mlijekom. Tropična poslastica koja vas odmah prenese na plažu.\";s:9:\"image_url\";s:16:\"piña_colada.jpg\";}i:2;a:4:{s:2:\"id\";i:7;s:4:\"name\";s:12:\"Cosmopolitan\";s:11:\"description\";s:96:\"Jednostavan, ali elegantan koktel od votke, lime, triple seca i brusnice. Ikona modernih barova.\";s:9:\"image_url\";s:16:\"cosmopolitan.jpg\";}}s:28:\"\0*\0escapeWhenCastingToString\";b:0;}', 1769616077);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cocktails`
--

CREATE TABLE `cocktails` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `instructions` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cocktails`
--

INSERT INTO `cocktails` (`id`, `name`, `description`, `instructions`, `image_url`, `user_id`) VALUES
(2, 'Mojito', 'Osvježavajući kubanski koktel s bijelim rumom, limetom, šećerom, mentom i soda vodom. Savršen za ljetne vrućine.', 'Priredite dvije čaše od 2 dl.\nLimetu dobro oprati, osušiti prerezati napola\ni iscijediti sok. Žlicom istrugati sve ostatke\niz kore. Koru rezati u krug da se dobije\ntanka spiralna vrpca\nU svaku čašu staviti žličicu i pol šećera\nzaliti sokom od limete.\nNa tanjuriću žlicom malo progniječiti metvicu\npa staviti u čaše, dodati led, zaliti rumom,\nzatim tonikom. Čaše ukrasiti korom limete.', 'mojito.jpg', NULL),
(3, 'Margarita', 'Klasik iz Meksika, mješavina tekile, lime i triple seca, serviran u čaši s solju na rubu. Idealno za ljubitelje citrusnih okusa.', ' Ukrasiti rub čaše solju\nProtresiti sastojke u shakeru za koktele\nProcijedite u času i dodajte led', 'margarita.jpg', NULL),
(4, 'Old Fashioned', 'Jedan od najpoznatijih koktela, s whiskyjem, šećerom, bitterom i narančom. Jednostavan, ali sofisticiran.', 'U čaši zgnječiti kocku šećera s nekoliko kapi vode i bitterom\nDodati kocke leda\nUliti bourbon ili raženi viski\nLagano promiješati\nUkrasiti koricom naranče i po želji koktel trešnjom', 'old_fashioned.jpg', NULL),
(5, 'Daiquiri', 'Jednostavan i elegantan koktel s rumom, svježim sokom od limete i šećerom. Osvježavajuć i brz za pripremu.', 'U shaker dodati bijeli rum, svježi sok limete i šećerni sirup\nNapuniti shaker ledom\nDobro protresti\nProcijediti u ohlađenu cocktail čašu', 'daiquiri.jpg', NULL),
(6, 'Negroni', 'Prepoznatljiv koktel s ginom, vermutom rosso i Camparijem. Idealno za ljubitelje gorkih koktela', 'U čašu dodaj kocke leda.\nUlij gin, Campari i vermut rosso.\nLagano promiješaj baršpoon žlicom 20-ak sekundi.\nGarniraj s koricom naranče – lagano je stisni iznad pića da pusti ulja.\nPosluži odmah.', 'negroni.jpg', NULL),
(7, 'Cosmopolitan', 'Jednostavan, ali elegantan koktel od votke, lime, triple seca i brusnice. Ikona modernih barova.', 'U shaker dodaj votku, Triple Sec, sok od brusnice i sok od limete.\nNapuni shaker ledom i snažno protresi 10–15 sekundi.\nProcijedi u ohlađenu martini čašu.\nDekoriraj koricom naranče ili kriškom limete.', 'cosmopolitan.jpg', NULL),
(8, 'Piña Colada', 'Egzotični koktel s rumom, ananasom i kokosovim mlijekom. Tropična poslastica koja vas odmah prenese na plažu.', 'U blender dodati rum, sok od ananasa, kokosovu kremu i led\nBlendati dok smjesa ne postane glatka\nUliti u rashlađenu hurricane čašu\nUkrasiti kriškom ananasa i trešnjom', 'piña_colada.jpg', NULL),
(9, 'Whiskey Sour', 'Savršen balans između kiselosti limuna i glatkoće viskija. S popularnim dodatkom jaja za savršenu teksturu.', 'U shaker dodati viski, limunov sok i šećerni sirup\nPo želji dodati bjelanjak\nNapuniti ledom i snažno protresti\nProcijediti u čašu s ledom\nUkrasiti kriškom naranče ili trešnjom', 'whiskey_sour.jpg', NULL),
(10, 'Mai Tai', 'S kompleksnim okusima ruma, orgeat sirupa, lime i sokova, ovo je koktel kojeg ne možete zaboraviti.', 'U shaker dodaj bijeli rum, sok limete, Cointreau, orgeat i (po potrebi) šećerni sirup.\nNapuni shaker ledom i protresi 10–12 sekundi.\nProcijedi u tiki mug ili old fashioned čašu napunjenu drobljenim ledom.\nLagano prelij tamni rum preko vrha (float).\nUkrasite grančicom mente i kriškom limete.', 'mai_tai.jpg', NULL),
(11, 'Bloody Mary', 'Klasičan koktel za jutro, sa votkom, rajčicom, začinima i limetom. Savršen za \"liječenje\" mamurluka.', 'U čašu s ledom uliti votku\nDodati sok od rajčice\nZačiniti solju, paprom, Worcestershire i Tabasco umakom\nLagano promiješati\nUkrasiti stabljikom celera ili limunom', 'bloody_mary.jpg', NULL),
(12, 'Gin Tonic', 'Jednostavan i popularan koktel s ginom, tonikom i limetom. Osvježavajuć, lagan i savršen za svaku priliku.', 'Napuniti čašu ledom\nUliti gin\nDoliti tonik\nLagano promiješati\nUkrasiti kriškom limete ili limuna', 'gin_tonic.jpg', NULL),
(13, 'Aperol Spritz', 'Lagan, osvježavajuć koktel s Aperolom, prosecom i sodom. Idealan za uživanje u popodnevnim satima.', 'U vinsku čašu dodati led\nUliti prosecco, zatim Aperol\nDoliti sodu i lagano promiješati\nUkrasiti kriškom naranče', 'aperol_spritz.jpg', NULL),
(14, 'Sex on the Beach', 'Popularan koktel od votke, breskve, naranče i brusnice. Voćni koktel idealan za ljeto.', 'U čašu s ledom uliti votku i breskvin liker\nDodati sok od naranče\nLagano doliti sok od brusnice\nNe miješati\nUkrasiti kriškom naranče', 'sex_on_the_beach.jpg', NULL),
(15, 'Tequila Sunrise', 'Spoznaja sjeverne Meksike, savršen miks tekile, naranče i grenadina za prekrasne boje zalaska sunca.', 'U čašu s ledom uliti tekilu\nDodati sok od naranče\nPolako doliti grenadin da padne na dno\nNe miješati\nUkrasiti narančom i trešnjom', 'tequila_sunrise.jpg', NULL),
(16, 'Long Island Iced Tea', 'Mješavina votke, tekile, rumu, gina, triple seca, limete, i cola, koji daje najjači udarac među koktelima.', 'Napuni shaker ledom.\nUlij votku, rum, gin, tekilu, Triple Sec, sok od limuna i šećerni sirup.\nDobro protresi 10–15 sekundi.\nProcijedi u čašu napunjenu kockama leda.\nDolij colu do vrha i lagano promiješaj.\nDekoriraj kriškom limuna.', 'long_island_iced_tea.jpg', NULL),
(17, 'Caipirinha', 'Najpoznatiji brazilski koktel, napravljen od cachaće, limete, šećera i leda. Ukusno i jednostavno.', 'U čaši zgnječiti kriške limete sa šećerom\nDodati drobljeni led\nUliti cachaçu\nLagano promiješati', 'caipirinha.jpg', NULL),
(18, 'Tom Collins', 'Lagan koktel na bazi gina, limunovog soka, šećera i soda vode. Osvježavajuć i jednostavan za pripremu.', 'U čašu s ledom uliti gin i limunov sok\nDodati šećerni sirup\nDoliti sodu\nLagano promiješati\nUkrasiti limunom', 'tom_collins.jpg', NULL),
(19, 'French 75', 'Sofisticiran koktel s džinom, šampanjcem, limunovim sokom i šećerom. Idealno za elegantne večere.', 'U shaker dodati votku, Chambord i sok od ananasa\nNapuniti shaker ledom i snažno protresti 10 sekundi\nProcijediti u ohlađenu cocktail čašu\nUkrasiti malinom ili kriškom ananasa', 'french_75.jpg', NULL),
(20, 'Paloma', 'Jedan od najomiljenijih koktela u Meksiku, na bazi tekile i grejpa. Osvježava i opušta.', 'Po želji rub čaše navlaži limetom i umočite u sol.\nU čašu dodaj led, tekilu, sok od limete i agavin sirup.\nDolij sok od grejpa i lagano promiješaj.\nAko koristiš svježi sok od grejpa, dodaj malo sode za pjenušavost.\nUkrasite kriškom ili kolutom grejpa.', 'paloma.jpg', NULL),
(21, 'Mint Julep', 'Tradicionalni koktel s bourbonom, mentom i šećerom. Savršen za ljubitelje pijenja na pariškoj tržnici.', 'U čaši zgnječiti listiće mente sa šećernim sirupom\nNapuniti drobljenim ledom\nUliti bourbon\nLagano promiješati\nUkrasiti grančicom mente', 'mint_julep.jpg', NULL),
(22, 'White Russian', 'Koktel s votkom, kremom i Kahlúom, punog i bogatog okusa. Popularan je nakon večere.', 'U čašu s ledom uliti votku i kahlúu\nLagano promiješati\nDodati slatko vrhnje po vrhu', 'white_russian.jpg', NULL),
(23, 'Black Russian', 'Sličan White Russianu, ali bez mlijeka ili vrhnja. Kombinacija votke i Kahlúe.', 'U čašu s ledom uliti votku\nDodati kahlúu\nLagano promiješati', 'black_russian.jpg', NULL),
(24, 'Espresso Martini', 'Zadnja runda prije odlaska na spavanje, s votkom, Kahlúom i espressom. Energizirajuć koktel.', 'U shaker dodati votku, kahlúu i svježi espresso\nNapuniti ledom\nSnažno protresti\nProcijediti u cocktail čašu\nUkrasiti zrnom kave', 'espresso_martini.jpg', NULL),
(25, 'Bellini', 'Italijanski koktel na bazi prosecca i svježeg breskvinog pirea. Lagano, svježe i voćno.', 'U ohlađenu čašu uliti pire od breskve\nLagano doliti pjenušac\nPažljivo promiješati kako bi se sastojci spojili', 'bellini.jpg', NULL),
(26, 'Hugo Spritz', 'Lagan koktel s Proseccom, cvijetom bazge i limetom. Osvježavajući i idealan za početak dana.', 'Napuni čašu kockama leda.\nDodaj listiće mente i lagano ih pritisni žlicom da puste aromu.\nUlij sirup od bazge i sok limete.\nDolij Prosecco i sodu.\nLagano promiješaj.', 'hugo_spritz.jpg', NULL),
(27, 'Blue Lagoon', 'Prekrasne plave boje, savršeni koktel s votkom, plavim curacao i limetom. Raj na jeziku.', 'Napuni čašu kockama leda.\nUlij votku i Blue Curaçao.\nDolij limunadu do vrha.\nLagano promiješaj bar spoonom.\nDekoriraj kriškom limuna i trešnjom.', 'blue_lagoon.jpg', NULL),
(28, 'Cuba Libre', 'Klasičan koktel s rumom, colom i limetom, koji je postao simbol kubanske kulture.', 'U čašu s ledom uliti bijeli rum\nDodati sok limete\nDoliti Coca-Colu\nLagano promiješati', 'cuba_libre.jpg', NULL),
(29, 'Screwdriver', 'Jednostavan koktel sa samo dvije osnovne stvari: votkom i sokom od naranče. Idealno za početnike.', 'U čašu s ledom uliti votku\nDoliti sok od naranče\nLagano promiješati', 'screwdriver.jpg', NULL),
(30, 'Moscow Mule', 'Koktel na bazi votke, đumbira i limete. Servira se u bakrenoj šalici za dodatni šarm.', 'U bakrenu šalicu dodati led\nUliti votku i sok limete\nDoliti đumbir pivo\nLagano promiješati i ukrasiti kriškom limete', 'moscow_mule.jpg', NULL),
(31, 'Dark and Stormy', 'Snažna kombinacija tamnog ruma, đumbir piva i limete. Snažan i specifičan koktel.', 'U čašu s ledom uliti tamni rum\nDoliti ginger beer\nDodati sok limete\nLagano promiješati', 'dark_and_stormy.jpg', NULL),
(32, 'Amaretto Sour', 'Sladak i kiselkast koktel na bazi amaretta, limete i jaja. Izvrsna kombinacija slatkog i kiselog okusa.', 'U shaker dodati amaretto i limunov sok\nPo želji dodati bjelanjak\nNapuniti ledom i protresti\nProcijediti u čašu s ledom', 'amaretto_sour.jpg', NULL),
(33, 'Zombie', 'Tropski koktel s više vrsta ruma, voćnih sokova i sirupa. Može biti vrlo jak i osvježavajuć.', 'Napuni shaker drobljenim ledom.\nUlij sve sastojke osim tamnog ruma.\nSnažno protresi i procijedi u tiki čašu napunjenu drobljenim ledom.\nLagano prelij tamni rum preko vrha (float).\nUkrasite grančicom mente, kriškom ananasa i koktel trešnjom.', 'zombie.jpg', NULL),
(34, 'Hurricane', 'Snažan koktel s rumom, sokom od naranče, limete i grenadinom. Savršen za vruće ljetne noći.', 'U shaker dodati tamni i svijetli rum, marakuju i sok limete\nNapuniti ledom i protresti\nUliti u veliku čašu s ledom\nUkrasiti voćem', 'hurricane.jpg', NULL),
(35, 'Singapore Sling', 'Koktel s ginom, cherry liqueur-om, sokom od ananasa i sokom od limete. Egzotični klasik.', 'U shaker dodati gin, višnjevac, triple sec i sokove\nNapuniti ledom i protresti\nProcijediti u čašu s  ledom\nUkrasiti ananasom', 'singapore_sling.jpg', NULL),
(36, 'Rum Punch', 'Voćni koktel s rumom, sokom od naranče i grenadinom. Savršen za uživanje na plaži.', 'U čašu s ledom uliti rum\nDodati voćne sokove i grenadin\nLagano promiješati\nUkrasiti voćem', 'rum_punch.jpg', NULL),
(37, 'Sidecar', 'Klasik iz Francuske na bazi konjaka, triple seca i limete. Elegantan i sofisticiran koktel.', 'U shaker dodati konjak, triple sec i limunov sok\nNapuniti ledom i protresti\nProcijediti u ohlađenu čašu sa šećernim rubom', 'sidecar.jpg', NULL),
(38, 'Boulevardier', 'Slično Negroniju, ali s bourbonom umjesto gina. Gorko-slatka kombinacija za sofisticirane okusne profile.', 'U čaši s ledom uliti bourbon, Campari i slatki vermut\nLagano promiješati\nUkrasiti koricom naranče', 'boulevardier.jpg', NULL),
(39, 'Vesper Martini', 'James Bond koktel s ginom, votkom i Lillet Blanc. Ukusan, elegantan i snažan.', 'U shaker dodati gin, votku i Lillet Blanc\nNapuniti ledom i protresti\nProcijediti u martini čašu\nUkrasiti koricom limuna', 'vesper_martini.jpg', NULL),
(40, 'Irish Coffee', 'Topli koktel s irskim viskijem, kafom, šećerom i kremom. Savršen za zimske večeri.', 'U vruću čašu dodati smeđi šećer i irski viski\nDoliti vruću kavu\nLagano promiješati\nDodati lagano tučeno slatko vrhnje', 'irish_coffee.jpg', NULL),
(41, 'Sazerac', 'Jedan od najstarijih koktela, s bourbonom, absintom i Peychaud\'s bitterom. Za ljubitelje povijesti i jačih okusa.', 'Isprati čašu absintom\nU drugoj čaši promiješati viski, šećer i bitters\nUliti u pripremljenu čašu\nUkrasiti koricom limuna', 'sazerac.jpg', NULL),
(42, 'Planter’s Punch', 'Snažan koktel s rumom, grenadinom i sokovima. Vrtloženje okusa u svakom gutljaju.', 'U shaker dodati rum, sokove i sirup\nNapuniti ledom i protresti\nUliti u čašu s ledom\nUkrasiti voćem', 'planter’s_punch.jpg', NULL),
(43, 'Painkiller', 'Tropski koktel s rumom, kokosovim mlijekom i sokom od ananasa. Poput mini-odmora.', 'U shaker dodati tamni rum i sokove\nNapuniti ledom i protresti\nUliti u čašu s ledom\nPosuti muškatnim oraščićem', 'painkiller.jpg', NULL),
(44, 'Sea Breeze', 'Lagani koktel sa votkom, sokom od brusnice i grejpa. Osvježava i može se piti bez prestanka', 'U čašu s ledom uliti votku\nDodati sok od brusnice i grejpa\nLagano promiješati', 'sea_breeze.jpg', NULL),
(45, 'Bay Breeze', 'Sličan Sea Breezeu, ali s većim naglaskom na sok od ananasa. Osvježavajući i lagan.', 'U čašu s ledom uliti votku\nDodati sok od brusnice i ananasa\nLagano promiješati', 'bay_breeze.jpg', NULL),
(46, 'Caesar', 'Kanadski koktel s votkom, sokom od rajčice, začinima i limetom. Okus koji ostavlja dojam.', 'Obrisati rub čaše limetom i umočiti u začinjenu sol\nDodati led i votku\nDoliti Clamato sok\nZačiniti po ukusu\nUkrasiti celerom', 'caesar.jpg', NULL),
(47, 'Spritz Veneziano', 'Sličan Aperol Spritzu, ali s više izraženim naglaskom na suši Aperol okusu. Pijte ga uz zalazak sunca.', 'U čašu s ledom uliti Aperol\nDodati prosecco\nDoliti sodu\nLagano promiješati\nUkrasiti narančom', 'spritz_veneziano.jpg', NULL),
(48, 'Gin Fizz', 'Klasičan i osvježavajući koktel na bazi gina, limunovog soka, šećera i soda vode. Lagane teksture i blage kiselosti, savršen za svaku priliku.', 'U shaker dodati gin, sok limuna i šećerni sirup s ledom\nSnažno protresti 10 sekundi\nProcijediti u highball čašu s ledom\nDopuniti soda vodom\nLagano promiješati i ukrasiti kriškom limuna', 'gin_fizz.jpg', NULL),
(49, 'Limoncello Spritz', 'Lagani i citrusni talijanski koktel s limoncellom, prosecom i soda vodom. Izuzetno osvježavajuć i idealan za tople ljetne dane.', 'U čašu s ledom uliti limoncello\nDodati prosecco\nDoliti sodu\nLagano promiješati\nUkrasiti limunom', 'limoncello_spritz.jpg', NULL),
(50, 'Swimming pool', 'Koktel za bazen', 'Sve sastojke (osim Blue Curaçaoa) stavite u shaker za koktele i dobro protresite.\nProcijedite u elegantnu ili visoku čašu preko svježeg leda.\nDodajte slamku i pažljivo ulijte ili plutajte u Blue Curaçao kako biste stvorili prekrasan gradijent boja.\nUkrasite kriškom ananasa, malim kišobranom ili trešnjom.', 'swimming_pool.jpg', NULL),
(51, 'Pornstar Martini', 'Moderan i atraktivan koktel s votkom i marakujom, poslužen uz čašicu prosecca. Sladak, egzotičan i savršen za posebne večeri.', 'U shaker dodati votku, liker od vanilije i marakuju\nNapuniti ledom i protresti\nProcijediti u cocktail čašu\nPoslužiti uz čašicu prosecca', 'pornstar_martini.jpg', NULL),
(59, 'test', 'test', 'test', 'https://magme.hr/wp-content/uploads/2023/12/kuhani_gin_1-scaled.jpg', 7);

-- --------------------------------------------------------

--
-- Table structure for table `cocktail_ingredients`
--

CREATE TABLE `cocktail_ingredients` (
  `cocktail_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `quantity` decimal(6,2) NOT NULL,
  `unit` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cocktail_ingredients`
--

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `quantity`, `unit`) VALUES
(2, 2, 50.00, 'ml'),
(2, 20, 2.00, 'tsp'),
(2, 21, 6.00, 'listića'),
(2, 22, 10.00, 'ml'),
(2, 30, 25.00, 'ml'),
(3, 6, 50.00, 'ml'),
(3, 8, 20.00, 'ml'),
(3, 27, 1.00, 'tsp'),
(3, 30, 22.00, 'ml'),
(4, 7, 60.00, 'ml'),
(4, 20, 1.00, 'kocka'),
(4, 22, 10.00, 'ml'),
(4, 29, 1.00, 'ml'),
(5, 2, 50.00, 'ml'),
(5, 19, 20.00, 'ml'),
(5, 30, 30.00, 'ml'),
(6, 5, 30.00, 'ml'),
(6, 9, 30.00, 'ml'),
(6, 10, 30.00, 'ml'),
(7, 4, 40.00, 'ml'),
(7, 8, 15.00, 'ml'),
(7, 30, 15.00, 'ml'),
(7, 40, 30.00, 'ml'),
(8, 2, 60.00, 'ml'),
(8, 17, 90.00, 'ml'),
(8, 33, 30.00, 'ml'),
(9, 7, 50.00, 'ml'),
(9, 15, 1.00, 'kom'),
(9, 19, 15.00, 'ml'),
(9, 29, 5.00, 'ml'),
(9, 47, 25.00, 'ml'),
(10, 2, 40.00, 'ml'),
(10, 3, 20.00, 'ml'),
(10, 8, 15.00, 'ml'),
(10, 19, 10.00, 'ml'),
(10, 30, 20.00, 'ml'),
(10, 37, 15.00, 'ml'),
(11, 4, 50.00, 'ml'),
(11, 27, 1.00, 'tsp'),
(11, 47, 10.00, 'ml'),
(11, 67, 3.00, 'kapi'),
(11, 68, 3.00, 'kapi'),
(11, 70, 120.00, 'ml'),
(12, 5, 50.00, 'ml'),
(12, 48, 150.00, 'ml'),
(13, 11, 60.00, 'ml'),
(13, 22, 30.00, 'ml'),
(13, 32, 90.00, 'ml'),
(14, 4, 40.00, 'ml'),
(14, 16, 40.00, 'ml'),
(14, 40, 40.00, 'ml'),
(14, 50, 20.00, 'ml'),
(15, 6, 50.00, 'ml'),
(15, 16, 100.00, 'ml'),
(16, 2, 15.00, 'ml'),
(16, 4, 15.00, 'ml'),
(16, 5, 15.00, 'ml'),
(16, 6, 15.00, 'ml'),
(16, 8, 15.00, 'ml'),
(16, 19, 20.00, 'ml'),
(16, 23, 10.00, 'ml'),
(16, 30, 25.00, 'ml'),
(17, 14, 1.00, 'kom'),
(17, 20, 2.00, 'tsp'),
(17, 49, 60.00, 'ml'),
(18, 19, 15.00, 'ml'),
(18, 22, 100.00, 'ml'),
(18, 46, 50.00, 'ml'),
(18, 47, 25.00, 'ml'),
(19, 19, 7.00, 'ml'),
(19, 46, 30.00, 'ml'),
(19, 47, 15.00, 'ml'),
(19, 57, 100.00, 'ml'),
(20, 6, 50.00, 'ml'),
(20, 19, 10.00, 'ml'),
(20, 22, 10.00, 'ml'),
(20, 27, 1.00, 'tsp'),
(20, 30, 15.00, 'ml'),
(20, 36, 120.00, 'ml'),
(21, 19, 10.00, 'ml'),
(21, 21, 8.00, 'listića'),
(21, 53, 60.00, 'ml'),
(22, 4, 50.00, 'ml'),
(22, 51, 20.00, 'ml'),
(22, 52, 20.00, 'ml'),
(23, 4, 50.00, 'ml'),
(23, 51, 20.00, 'ml'),
(24, 4, 40.00, 'ml'),
(24, 19, 10.00, 'ml'),
(24, 24, 30.00, 'ml'),
(24, 51, 20.00, 'ml'),
(25, 32, 100.00, 'ml'),
(25, 34, 50.00, 'ml'),
(26, 14, 1.00, 'kom'),
(26, 21, 6.00, 'listića'),
(26, 22, 100.00, 'ml'),
(26, 32, 150.00, 'ml'),
(26, 43, 20.00, 'ml'),
(27, 4, 40.00, 'ml'),
(27, 41, 20.00, 'ml'),
(27, 42, 100.00, 'ml'),
(28, 23, 120.00, 'ml'),
(28, 30, 10.00, 'ml'),
(28, 56, 40.00, 'ml'),
(29, 4, 50.00, 'ml'),
(29, 16, 100.00, 'ml'),
(30, 4, 50.00, 'ml'),
(30, 30, 10.00, 'ml'),
(30, 35, 120.00, 'ml'),
(31, 3, 60.00, 'ml'),
(31, 30, 10.00, 'ml'),
(31, 31, 100.00, 'ml'),
(32, 12, 40.00, 'ml'),
(32, 19, 10.00, 'ml'),
(32, 47, 30.00, 'ml'),
(32, 53, 20.00, 'ml'),
(32, 54, 20.00, 'ml'),
(33, 2, 30.00, 'ml'),
(33, 3, 30.00, 'ml'),
(33, 16, 30.00, 'ml'),
(33, 17, 30.00, 'ml'),
(33, 29, 1.00, 'ml'),
(33, 30, 15.00, 'ml'),
(33, 38, 30.00, 'ml'),
(33, 39, 20.00, 'ml'),
(34, 2, 40.00, 'ml'),
(34, 3, 40.00, 'ml'),
(34, 16, 20.00, 'ml'),
(34, 47, 20.00, 'ml'),
(34, 60, 40.00, 'ml'),
(35, 5, 30.00, 'ml'),
(35, 8, 7.00, 'ml'),
(35, 17, 60.00, 'ml'),
(35, 29, 2.00, 'kapi'),
(35, 47, 15.00, 'ml'),
(35, 61, 15.00, 'ml'),
(35, 62, 7.00, 'ml'),
(36, 2, 30.00, 'ml'),
(36, 3, 45.00, 'ml'),
(36, 16, 60.00, 'ml'),
(36, 17, 60.00, 'ml'),
(37, 47, 30.00, 'ml'),
(37, 58, 30.00, 'ml'),
(37, 59, 30.00, 'ml'),
(38, 9, 30.00, 'ml'),
(38, 10, 30.00, 'ml'),
(38, 53, 30.00, 'ml'),
(39, 4, 15.00, 'ml'),
(39, 5, 45.00, 'ml'),
(39, 63, 7.00, 'ml'),
(40, 7, 40.00, 'ml'),
(40, 20, 2.00, 'tsp'),
(40, 55, 120.00, 'ml'),
(41, 7, 50.00, 'ml'),
(41, 20, 1.00, 'kocka'),
(41, 64, 3.00, 'kapi'),
(41, 65, 5.00, 'ml'),
(42, 3, 60.00, 'ml'),
(42, 16, 60.00, 'ml'),
(42, 17, 30.00, 'ml'),
(42, 29, 1.00, 'ml'),
(42, 30, 30.00, 'ml'),
(43, 3, 60.00, 'ml'),
(43, 16, 30.00, 'ml'),
(43, 17, 120.00, 'ml'),
(43, 33, 30.00, 'ml'),
(44, 4, 40.00, 'ml'),
(44, 36, 40.00, 'ml'),
(44, 40, 80.00, 'ml'),
(45, 4, 40.00, 'ml'),
(45, 17, 80.00, 'ml'),
(45, 40, 80.00, 'ml'),
(46, 4, 50.00, 'ml'),
(46, 27, 2.00, 'tsp'),
(46, 30, 10.00, 'ml'),
(46, 66, 120.00, 'ml'),
(46, 67, 3.00, 'kapi'),
(46, 68, 3.00, 'kapi'),
(47, 11, 60.00, 'ml'),
(47, 22, 30.00, 'ml'),
(47, 32, 90.00, 'ml'),
(48, 5, 50.00, 'ml'),
(48, 19, 10.00, 'ml'),
(48, 22, 50.00, 'ml'),
(48, 47, 30.00, 'ml'),
(49, 22, 30.00, 'ml'),
(49, 32, 90.00, 'ml'),
(49, 69, 60.00, 'ml'),
(50, 2, 20.00, 'ml'),
(50, 4, 20.00, 'ml'),
(50, 17, 60.00, 'ml'),
(50, 25, 10.00, 'ml'),
(50, 33, 20.00, 'ml'),
(50, 41, 10.00, 'ml'),
(51, 4, 40.00, 'ml'),
(51, 19, 10.00, 'ml'),
(51, 30, 20.00, 'ml'),
(51, 32, 40.00, 'ml'),
(51, 44, 20.00, 'ml'),
(51, 45, 30.00, 'ml'),
(59, 10, 3.00, 'ml');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `cocktail_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `cocktail_id`, `created_at`, `updated_at`) VALUES
(3, 4, 51, '2026-01-28 09:08:19', '2026-01-28 09:08:19'),
(4, 4, 50, '2026-01-28 09:08:20', '2026-01-28 09:08:20'),
(6, 4, 49, '2026-01-28 12:09:05', '2026-01-28 12:09:05');

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`id`, `name`, `category`) VALUES
(1, 'name', 'category'),
(2, 'Bijeli rum', 'rum'),
(3, 'Tamni rum', 'rum'),
(4, 'Votka', 'votka'),
(5, 'Gin', 'gin'),
(6, 'Tekila', 'tekila'),
(7, 'Viski', 'viski'),
(8, 'Triple Sec', 'liker'),
(9, 'Vermouth', 'liker'),
(10, 'Campari', 'liker'),
(11, 'Aperol', 'liker'),
(12, 'Amaretto', 'liker'),
(13, 'Coffee Liqueur', 'liker'),
(14, 'Limeta', 'voće'),
(15, 'Limun', 'voće'),
(16, 'Sok od naranče', 'sok'),
(17, 'Sok od ananasa', 'sok'),
(18, 'Cranberry Juice', 'sok'),
(19, 'Šećerni sirup', 'sirup'),
(20, 'Šečer', 'ostalo'),
(21, 'Menta', 'začin'),
(22, 'Soda voda', 'bezalkoholno'),
(23, 'Cola', 'bezalkoholno'),
(24, 'Espresso', 'kava'),
(25, 'Cream', 'mliječno'),
(26, 'Egg White', 'ostalo'),
(27, 'Sol', 'ostalo'),
(28, 'Grenadine', 'sirup'),
(29, 'Angostur bitter', 'ostalo'),
(30, 'Sok od limete', 'sok'),
(31, 'Ginger beer', 'sok'),
(32, 'Prosecco', 'prosecco'),
(33, 'Kokosova krema', 'mliječno'),
(34, 'Pire od breskve', 'sok'),
(35, 'Đumbir piva', 'piva'),
(36, 'Sok od grejpa', 'sok'),
(37, 'Bademov sirup', 'sirup'),
(38, 'Zlatni rum', 'rum'),
(39, 'Apricot brandy', 'liker'),
(40, 'Sok od brusnice', 'sok'),
(41, 'Blue Curaçao likera', 'liker'),
(42, 'Limunada', 'sok'),
(43, 'Sirup od bazge', 'sirup'),
(44, 'Liker od marakuja', 'liker'),
(45, 'Pire od marakuje', 'sok'),
(46, 'Dry Gin', 'gin'),
(47, 'Sok od limuna', 'sok'),
(48, 'Tonik', 'ostalo'),
(49, 'Cachaça ', 'rum'),
(50, 'Liker od breskve', 'liker'),
(51, 'Liker od kave', 'liker'),
(52, 'Šlag', 'mliječno'),
(53, 'Bourbon', 'viski'),
(54, 'Bjelanjak', 'ostalo'),
(55, 'Kava', 'ostalo'),
(56, 'Kubanski rum', 'rum'),
(57, 'Šampanjac', 'vino'),
(58, 'Konjak', 'viski'),
(59, 'Cointreau', 'liker'),
(60, 'Sok od marakuje', 'sok'),
(61, 'Cherry  Heering', 'liker'),
(62, 'DOM Bénédictinea', 'liker'),
(63, 'Lillet Blanc', 'vino'),
(64, 'Peychaud\'s bitter', 'ostalo'),
(65, 'Apsint', 'liker'),
(66, 'Clamato sok', 'sok'),
(67, 'Worcestershire umak', 'ostalo'),
(68, 'Tabasco umak', 'ostalo'),
(69, 'Limoncello', 'liker'),
(70, 'Sok od rajčice', 'sok');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(5, '2026_01_15_174000_create_ingredients_table', 1),
(6, '2026_01_15_174016_create_cocktails_table', 1),
(7, '2026_01_15_174022_create_cocktail_ingredients_table', 1),
(8, '2026_01_15_174031_create_favorites_table', 1),
(9, '2026_01_15_174036_create_user_ingredients_table', 1),
(11, '2025_12_28_181326_create_personal_access_tokens_table', 1),
(12, '2026_01_26_230415_add_tidal_fields_to_users_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 3, 'auth_token', '876121ac7ca554f904dac533f46a027e667fa0e0a4ad35fe471798a005e90c94', '[\"*\"]', NULL, NULL, '2025-12-26 22:35:54', '2025-12-26 22:35:54'),
(3, 'App\\Models\\User', 6, 'auth_token', '0760ab429ab8ae9c4dc6f9bc432b6f0d9083fcd81f0d3a5cda35d70f78249437', '[\"*\"]', NULL, NULL, '2025-12-28 18:17:24', '2025-12-28 18:17:24'),
(24, 'App\\Models\\User', 11, 'apptoken', 'd3e3395a2faf85b2933b315b2217105135731bbe5063e463d084283f1b794d4c', '[\"*\"]', NULL, NULL, '2026-01-27 12:22:34', '2026-01-27 12:22:34');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('fSdOI5b7y9pXfLfslzLgSFzSFadXEdnAFP6C4I34', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoic2p3a1UyTElCOVVJSFVpUmFuVGY0SEY3V2RUYW90MEsza2xoUDlqdCI7czoxNzoidGlkYWxfb2F1dGhfc3RhdGUiO3M6NDA6IjZwclRLRHlucjZneTRCWURxZ2VJUnlMeVhKbFhUcFhxQ0tLcFZZTEkiO3M6MjA6InRpZGFsX29hdXRoX3ZlcmlmaWVyIjtzOjg2OiJpOVJ1RGJpcXpiSEU3Tm50eVZrbmprMGExTGxscUVyS1dKVkJQQy1WcjJKVC0waVRMVEtJYlhjTDVvWV93NGVSY0dsbnNfcGtUUk9rVlZTakQtOXc0dyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hdXRoL3RpZGFsL3JlZGlyZWN0IjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1769477607),
('NemQdXnCCsLt9qLUiY585WxMTGsPModjk4iiubCB', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidXRQV3JDOWlXWkVBMFBxdmF1aDJiTGI0U2pKNGliT0w0YlF0NzN2eCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769187428),
('u9eIshLI9I4LYqPe40v9Q29VQjBDZwqyP1heYRun', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM0FuaVFtQ3V2dnZYcHZMUkUybTBvS3QzU1p4cU9tTzlxVUo4eG5lRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1766793609);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `tidal_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `tidal_access_token` text DEFAULT NULL,
  `tidal_access_expires_at` datetime DEFAULT NULL,
  `tidal_refresh_token` text DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `tidal_user_id`, `tidal_access_token`, `tidal_access_expires_at`, `tidal_refresh_token`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(2, 'Ana', 'ana2@test.com', NULL, NULL, NULL, NULL, NULL, '$2y$12$.hO.zbCqU.4EZZVvLnor7.MN6KIe5bf6Sz7yxrqGUCDJVJlbZ0VIO', NULL, '2025-12-23 20:58:07', '2025-12-23 20:58:07'),
(3, 'Test', 'test@test.com', NULL, NULL, NULL, NULL, NULL, '$2y$12$uG0PgsLuE9chQhLodDATA.H0SunOXrgYVWTBIWYhy8mb2UMSXoLd2', NULL, '2025-12-26 22:32:51', '2025-12-26 22:32:51'),
(4, 'karla', 'karla.vrsic@gmail.com', 189606405, 'eyJraWQiOiJ2OU1GbFhqWSIsImFsZyI6IkVTMjU2In0.eyJ0eXBlIjoibzJfYWNjZXNzIiwidWlkIjoxODk2MDY0MDUsInNjb3BlIjoicmVjb21tZW5kYXRpb25zLnJlYWQgc2VhcmNoLnJlYWQgdXNlci5yZWFkIiwiZ1ZlciI6MCwic1ZlciI6MCwiY2lkIjoyMzkwOSwiY2MiOiJIUiIsImF0IjoiVEhJUkRfUEFSVFkiLCJleHAiOjE3Njk2MzQyOTQsInNpZCI6IjllNzZiZWZhLWFmNDgtNDkyZS04Mzg3LWM0MzI1NGVkYTUxYSIsImlzcyI6Imh0dHBzOi8vYXV0aC50aWRhbC5jb20vdjEifQ.yNquH2aEeqsAef01d1pM5by0nnQcpi-AJeuPiQwuvRvW94BLfHszGXamAx2nBG8mlIHevmwXcxlsyhGjxIC9uQ', '2026-01-28 21:04:58', 'eyJraWQiOiJoUzFKYTdVMCIsImFsZyI6IkVTNTEyIn0.eyJ0eXBlIjoibzJfcmVmcmVzaCIsInVpZCI6MTg5NjA2NDA1LCJzY29wZSI6InJlY29tbWVuZGF0aW9ucy5yZWFkIHNlYXJjaC5yZWFkIHVzZXIucmVhZCIsImNpZCI6MjM5MDksInNWZXIiOjAsImdWZXIiOjAsImlzcyI6Imh0dHBzOi8vYXV0aC50aWRhbC5jb20vdjEifQ.AN5M8a64aKaCx6yUjXsVfAyrmKxdmKMPsFw2bN2r90Oz1rJqVKZa4UDSi_9cwV4RU3COmm6JSxeABmkYL4KGTVtKAKgVSeqhIQFF3y_cpRyFkhPCQP4YuVklxNg0efGZmXES1EpkMNMJgi5g6XvPs9ZSm1-wOweqNTe-LRPipUC-S2AK', NULL, '$2y$12$4in7YinallOvz8A1R4Sxjusjqc5gB13hRHzF.GuUJtm7yuNR.Bokq', NULL, '2025-12-26 23:20:37', '2026-01-28 16:04:58'),
(5, 'karla', 'karla.vrsc@gmail.com', NULL, NULL, NULL, NULL, NULL, '$2y$12$ZAKIqWCryIiSCR/dCpJFXumK67okKhvWFWcID0MH.ycBod99Wx3a.', NULL, '2025-12-26 23:27:34', '2025-12-26 23:27:34'),
(6, 'Antonio', 'antonio.stipanovic@gmail.com', NULL, NULL, NULL, NULL, NULL, '$2y$12$3gmjCN3Lb2EZWTBXfWGWF.n4dF5FciyzcokjUOH8iJt7vzAyvXVF2', NULL, '2025-12-28 18:17:24', '2025-12-28 18:17:24'),
(7, 'karla', 'k@gmail.com', NULL, NULL, NULL, NULL, NULL, '$2y$12$Sgqeh0UPufOdW/Zt9VI2gu9px5LWobQggE98GZtOnJMDKOxt7wP.e', NULL, '2026-01-21 00:35:49', '2026-01-21 00:35:49'),
(8, 'k', 'r@gmaiil.com', NULL, NULL, NULL, NULL, NULL, '$2y$12$f/dSzCip9VUvu7e8xK.BveJa.4J7WyK7skQUc0w.itFcpJq.nbd1O', NULL, '2026-01-23 15:53:14', '2026-01-23 15:53:14'),
(11, 'test4', 'test5@gmail.com', NULL, NULL, NULL, NULL, NULL, '$2y$12$INWpZvZpRhFN3FCKKdP0.uWL33KPftADmwgUOudN2.bLJEdvdNBiW', NULL, '2026-01-27 12:22:34', '2026-01-27 12:22:34'),
(12, 'ajmeee', 'ajmee@gmail.coom', NULL, NULL, NULL, NULL, NULL, '$2y$12$TiBSFfV6EageNBmMWHu.heXLxpIKTo32kILgUVOWttGCbip/.9jXS', NULL, '2026-01-27 12:24:57', '2026-01-27 12:24:57'),
(13, 'cool_girl', 'cool_girl@gmail.com', NULL, NULL, NULL, NULL, NULL, '$2y$12$V4z7xlxEDhOW6lV9nEwyh.hjb2DGmlTcEwvLSQmNmWGIEljWMI9Ze', NULL, '2026-01-28 08:16:13', '2026-01-28 08:16:13');

-- --------------------------------------------------------

--
-- Table structure for table `user_ingredients`
--

CREATE TABLE `user_ingredients` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `quantity` decimal(6,2) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cocktails`
--
ALTER TABLE `cocktails`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cocktail_ingredients`
--
ALTER TABLE `cocktail_ingredients`
  ADD PRIMARY KEY (`cocktail_id`,`ingredient_id`),
  ADD KEY `ingredient_id` (`ingredient_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_cocktail` (`user_id`,`cocktail_id`),
  ADD KEY `fk_favorites_cocktail` (`cocktail_id`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_ingredients`
--
ALTER TABLE `user_ingredients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_ingredient` (`user_id`,`ingredient_id`),
  ADD KEY `fk_ui_ingredient` (`ingredient_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cocktails`
--
ALTER TABLE `cocktails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `user_ingredients`
--
ALTER TABLE `user_ingredients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cocktail_ingredients`
--
ALTER TABLE `cocktail_ingredients`
  ADD CONSTRAINT `cocktail_ingredients_ibfk_1` FOREIGN KEY (`cocktail_id`) REFERENCES `cocktails` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cocktail_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `fk_favorites_cocktail` FOREIGN KEY (`cocktail_id`) REFERENCES `cocktails` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_favorites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_ingredients`
--
ALTER TABLE `user_ingredients`
  ADD CONSTRAINT `fk_ui_ingredient` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ui_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
