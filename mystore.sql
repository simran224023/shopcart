-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 27, 2024 at 07:07 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mystore`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_table`
--

CREATE TABLE `admin_table` (
  `admin_id` int(11) NOT NULL,
  `admin_name` varchar(100) NOT NULL,
  `admin_email` varchar(200) NOT NULL,
  `admin_image` varchar(255) NOT NULL,
  `admin_password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart_details`
--

CREATE TABLE `cart_details` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_title` varchar(100) NOT NULL,
  `category_image` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_title`, `category_image`) VALUES
(1, 'Mobiles', 'mobile_icon.webp'),
(2, 'Fashion', 'fashion_icon.webp'),
(3, 'Electronics', 'electronice_icon.webp'),
(4, 'Kitchen', 'home_icon.webp'),
(5, 'Beauty', 'beauty_icon.webp'),
(6, 'Appliances', 'tv_icon.webp'),
(7, 'Furniture', 'furniture_icon.webp'),
(8, 'Grocery', 'grocery_icon.webp'),
(9, 'Gym', 'gym_icon.png'),
(11, 'Sports', 'sports_icon.png');

-- --------------------------------------------------------

--
-- Table structure for table `orders_pending`
--

CREATE TABLE `orders_pending` (
  `pending_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `invoice_number` int(255) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_title` varchar(100) NOT NULL,
  `product_description` varchar(255) NOT NULL,
  `product_keywords` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `product_image1` varchar(100) NOT NULL,
  `product_image2` varchar(100) NOT NULL,
  `product_image3` varchar(100) NOT NULL,
  `product_price` varchar(100) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(100) NOT NULL,
  `bestseller` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_title`, `product_description`, `product_keywords`, `category_id`, `product_image1`, `product_image2`, `product_image3`, `product_price`, `date`, `status`, `bestseller`) VALUES
(2, 'vivo T2x 5G (Marine Blue, 128 GB)', '6 GB RAM | 128 GB ROM | 16.71 cm (6.58 inch) Full HD+ Display | 50MP + 2MP | 8MP Front Camera | 5000 mAh Battery | Dimensity 6020 Processor', 'Vivo, Mobiles, Phones, Bestseller', 1, 'vivo1.webp', 'vivo2.webp', 'vivo3.webp', '14000', '2023-09-13 01:29:08', 'true', 'yes'),
(3, 'MIKE (N) Running Shoes For Men  (Blue)', '  Color Blue | Outer material Mesh | Model name MIKE (N) | Ideal for Men | Occasion Sports | Type For Sports Running Shoes | Sole material Phylon | Closure Lace-Ups', 'Shoes, Men, Boys, Sports shoe, Footwear, Fashion ,Bestseller', 2, 'sports_shoe1(men).webp', 'sports_shoe2(men).webp', 'sports_shoe3(men).webp', '1200', '2023-08-31 23:36:34', 'true', 'yes'),
(4, 'Men Grey Sandal', 'Upper Pattern Solid | Closure Velcro | Color Grey|  Pack of 1 | Sole Material TPR | Weight 300 g (per single Sandal) - Weight of the product may vary depending on size.', 'Footwear, Sandal, Men, Boys, Fashion', 2, 'sandles1(men).webp', 'sandles2(men).webp', 'sandles3(men).webp', '800', '2023-08-28 11:38:12', 'true', 'no'),
(5, 'Men Striped Round Neck Cotton Blend Pink T-Shirt', 'Type Round Neck | Sleeve Half | Sleeve Fit Regular | Fabric Cotton Blend | Sales Package Pack of 1 Pack of 1 | Style Code AUK0163 | Neck Type Round Neck', 'Tshirts, Topwear, Men, Boys, Fashion,Bestseller', 2, 'tshirts1(men).webp', 'tshirts2(men).webp', 'tshirts3(men).webp', '300', '2023-08-28 12:07:50', 'true', 'yes'),
(6, 'Men Full Sleeve Striped Sweatshirt', ' Multicolor | Fabric Pure Cotton | Pattern Striped | Neck Round Neck | Sleeve Full Sleeve | Style Code SS_MULTI_S | Hooded No', 'Men, Fashion, Sweatshirts, boys', 2, 'sweatshirt1(men).webp', 'sweatshirt2(men).webp', 'sweatshirt3(men).webp', '800', '2023-08-28 11:38:27', 'true', 'no'),
(7, 'Women A-line Multicolor Dress', ' Multicolor | Length Midi/Calf | Fabric Polyester | Pattern Printed | Ideal For Women | Type A-line | Style Code A1 | Suitable For Western Wear', 'Dress, Midi, Girls, Women, Fashion ,Bestseller', 2, 'dress1(women).webp', 'dress2(women).webp', 'dress3(women).webp', '1000', '2023-08-28 12:08:04', 'true', 'yes'),
(8, 'Women Black Jeans', ' One Button Highrise | Ideal For Women | Suitable For Western Wear | Pack Of 1 | Pocket Type Diagonal Pocket | Pattern Solid ', 'jean, Women, Fashion, Bottomwear, Clothing, Girls ,Bestseller', 2, 'jean1(women).webp', 'jean2(women).webp', 'jean3(women).webp', '1200', '2023-08-28 12:08:18', 'true', 'yes'),
(9, 'Women Pink Flats Sandal', ' Flats | Type for Flats Sandal | Color Pink | Pack of 1 | Sole Material TPR | Care instructions Wipe with dry cloth | Weight 400 g (per single Sandal) - Weight of the product may vary depending on size.', 'Footwear, Flats, Sandal, Fashion, Women, Girls', 2, 'flat4(women).webp', 'flat5(women).webp', 'flat6(women).webp', '800', '2023-08-28 11:58:54', 'true', 'no'),
(12, 'Realme C53 (Champion Gold, 64 GB)  (6 GB RAM)', '6 GB RAM | 64 GB ROM | Expandable Upto 2 TB 17.12 cm (6.74 inch) HD Display 108MP + 2MP | 8MP Front Camera 5000 mAh Battery T612 Processor', 'Realme, Mobiles', 1, 'realme1.webp', 'realme2.webp', 'realme3.webp', '11000', '2023-08-28 11:41:19', 'true', 'no'),
(13, 'Canon EOS 3000D DSLR Camera', 'Self-Timer, Type C and Mini HDMI, 9 Auto Focus Points, 3x Optical Zoom, WiFi, Full HD, Video Recording at 1080 p on 30fps, APS-C CMOS sensor-which is 25 times larger than a typical Smartphone sensor. ', 'Camera, Electronics, DSLR ,Bestseller', 3, 'camera01.jpg', 'camera02.jpg', 'camera03.jpg', '34000', '2023-08-28 12:08:32', 'true', 'yes'),
(29, 'HP 15s (2023) Intel Core i3 12th Gen', 'Stylish & Portable Thin and Light Laptop |15.6 Inch Full HD, micro-edge, anti-glare, Brightness: 250 nits, 141 ppi, Color Gamut: 45%NTSC |Light Laptop without Optical Disk Drive', 'Electronics, Laptops, HP ,Bestseller', 3, 'laptop01.webp', 'laptop02.webp', 'laptop03.webp', '42992', '2023-09-01 04:27:33', 'TRUE', 'yes'),
(30, 'SAMSUNG 189 L Direct Cool Single Door 5 Star Refrigerator', '189 L : Good for couples and small families |Digital Inverter Compressor|5 Star : For Energy savings up to 55% |Direct Cool : Economical, consumes less electricity, requires manual defrosting', 'Refrigerator, Appliances ,Bestseller', 6, 'refrigerator01.webp', 'refrigerator02.webp', 'refrigerator03.webp', '17890', '2023-08-28 12:09:14', 'TRUE', 'yes'),
(35, 'Panasonic 20 L Solo Microwave Oven', '20 L |Solo |Touch Key Pad (Membrane) is sensitive to touch and easy to clean', 'Microwaves, Panasonic, Appliances ,Bestseller', 6, 'microwaves01.jpg', 'microwaves02.jpg', 'microwaves03.jpg', '5890', '2023-08-28 12:09:27', 'TRUE', 'yes'),
(42, 'ULTRABOOST LIGHT Running Shoes For Men (Black)', 'Black |Outer materialSynthetic | Model nameULTRABOOST LIGHT |Ideal forMen |OccasionSports |Secondary colorGrey |Type For SportsRunning Shoes |Sole materialRubber', 'sports Shoe, Sports, Adidas, Black ,Bestseller', 11, 'shoes01.jpg', 'shoes02.jpg', 'shoes03.jpg', '10000', '2023-08-28 12:10:04', 'TRUE', 'yes'),
(43, 'NIVIA Storm Football - Size: 5', 'Football |Water Resistant | Outer Material: Rubber |Weight: 420-470  g |Suitable for: Hard Ground without Grass, Wet & Grassy Ground, Artificail Turf', 'Sports, Football, Play', 11, 'football01.jpg', 'football02.jpg', 'football03.jpg', '500', '2023-08-28 11:41:35', 'TRUE', 'no'),
(44, 'GOLS 20INCH SMALL CARROM 50 cm Carrom Board ', 'Sport Type: Carrom |Surface Material: WOOD |Color: Brown Height: 50 cm', 'Sports, Carrom Board, play', 11, 'carromboard01.jpg', 'carromboard02.jpg', 'carromboard03.jpg', '500', '2023-08-28 11:40:05', 'TRUE', 'no'),
(45, 'HORLICKS Classic Malt  (1 kg)', 'HORLICKS\nModel Name\nClassic Malt |\nQuantity\n1 kg |\nContainer Type\nPlastic Bottle |\nFlavor\nPlain |\nMaximum Shelf Life\n12 Months', 'Grocery, Horlicks, Protein', 8, 'horlicks1.webp', 'horlicks2.webp', 'horlicks3.webp', '500', '2023-08-28 11:39:53', 'TRUE', 'no'),
(46, 'Farmley Premium California Almonds', 'FarmleyQuantity500 g |TypeAlmonds |VariantKernels |Container TypePouch |Model NamePremium California |ComboNo |Maximum Shelf Life6 Months', 'Grocery, Almonds, Energy ,Bestseller', 8, 'almonds1.webp', 'almonds2.webp', 'almonds3.webp', '500', '2023-08-28 12:10:46', 'TRUE', 'yes'),
(47, 'TRESemme Keratin Smooth Shampoo', 'Hair Shine, Straightening & Smoothening Shampoo |Ideal For: Men & Women |Suitable For: All Hair Types |Composition: Ingredients on Tag', 'Shampoo, hairs, Beauty, girls, headwash ,Bestseller', 5, 'shampoo1.webp', 'shampoo2.webp', 'shampoo3.webp', '532', '2023-08-28 12:10:57', 'TRUE', 'yes'),
(48, 'All In One Makeup Kit For Women And Girls', 'Kit Contents: Eye Shadow,Compact,Nail Polish,Liner,Mascar,Foundation,Brush Set,Lipstick |Professional Range Makeup Kit', 'Makeup, Beauty, makeup kit, girls, women , fashion, Eye Shadow, Compact, Nail Polish, Liner, Mascara, Foundation, Brush Set, Lipstick ,Bestseller', 5, 'makeup1.webp', 'makeup2.webp', 'makeup3.webp', '1000', '2023-08-28 12:11:42', 'TRUE', 'yes'),
(49, 'realme C30s', '2 GB RAM | 32 GB ROM | Expandable Upto 1 TB16.51 cm (6.5 inch) HD+ Display8MP Rear Camera | 5MP Front Camera5000 mAh Lithium Ion Battery', 'Mobiles, Realme', 1, 'realme4.webp', 'realme5.webp', 'realme6.webp', '7000', '2023-08-28 11:39:05', 'TRUE', 'no'),
(50, 'realme C55 ', '8 GB RAM | 128 GB ROM | Expandable Upto 1 TB17.07 cm (6.72 inch) Full HD+ Display64MP + 2MP | 8MP Front Camera5000 mAh BatteryHelio G88 Processor', 'Mobiles, Realme ,Bestseller', 1, 'realme7.webp', 'realme8.webp', 'realme9.webp', '13999', '2023-08-28 12:12:01', 'TRUE', 'yes'),
(51, 'REDMI 11 Prime', '4 GB RAM | 64 GB ROM | Expandable Upto 512 GB16.71 cm (6.58 inch) Full HD+ Display50MP + 2MP + 2MP | 8MP Front Camera5000 mAh BatteryHelio G99 Processor', 'Mobiles, Redmi', 1, 'redmi1.webp', 'redmi2.webp', 'redmi3.webp', '8999', '2023-08-28 11:38:45', 'TRUE', 'no'),
(52, 'REDMI A2', '4 GB RAM | 64 GB ROM16.56 cm (6.52 inch) Display8MP Rear Camera5000 mAh Battery', 'Mobiles, Redmi', 1, 'redmi4.webp', 'redmi5.webp', 'redmi6.webp', '7186', '2023-08-28 11:38:56', 'TRUE', 'no'),
(53, 'REDMI Note 12 Pro 5G', '6 GB RAM | 128 GB ROM16.94 cm (6.67 inch) Full HD+ AMOLED Display50MP (OIS) + 8MP + 2MP | 16MP Front Camera5000 mAh Lithium Polymer BatteryMediatek Dimensity 1080 Processor', 'Mobiles, Redmi ,Bestseller', 1, 'redmi7.webp', 'redmi8.webp', 'redmi9.webp', '24000', '2023-08-28 12:12:15', 'TRUE', 'yes'),
(54, 'SAMSUNG Galaxy F13', '4 GB RAM | 64 GB ROM | Expandable Upto 1 TB16.76 cm (6.6 inch) Full HD+ Display50MP + 5MP + 2MP | 8MP Front Camera6000 mAh Lithium Ion BatteryExynos 850 Processor', 'Mobiles, Samsung', 1, 'samsung1.webp', 'samsung2.webp', 'samsung3.webp', '11000', '2023-08-28 11:41:54', 'TRUE', 'no'),
(55, 'SAMSUNG Galaxy F14 5G', '6 GB RAM | 128 GB ROM | Expandable Upto 1 TB16.76 cm (6.6 inch) Full HD+ Display50MP + 2MP | 13MP Front Camera6000 mAh BatteryExynos 1330, Octa Core Processor', 'Mobiles, Samsung', 1, 'samsung4.webp', 'samsung5.webp', 'samsung6.webp', '13990', '2023-08-28 11:42:02', 'TRUE', 'no'),
(56, 'SAMSUNG Galaxy F04', '4 GB RAM | 64 GB ROM | Expandable Upto 1 TB16.51 cm (6.5 inch) HD Display13MP + 2MP | 5MP Front Camera5000 mAh Lithium-Ion BatteryMediatek Helio P35 Processor', 'Mobiles, Samsung ,Bestseller', 1, 'samsung7.webp', 'samsung8.webp', 'samsung9.webp', '7099', '2023-08-28 12:12:47', 'TRUE', 'yes'),
(57, 'vivo T2 5G', '8 GB RAM | 128 GB ROM16.21 cm (6.38 inch) Full HD+ Display64 MP (OIS) + 2MP | 16MP Front Camera4500 mAh BatterySnapdragon 695 Processor', 'Mobiles, Vivo', 1, 'vivo4.webp', 'vivo5.webp', 'vivo6.webp', '20999', '2023-08-28 11:42:20', 'TRUE', 'no'),
(58, 'vivo Y22', '4 GB RAM | 64 GB ROM | Expandable Upto 1 TB16.64 cm (6.55 inch) HD+ Display50MP + 2MP | 8MP Front Camera5000 mAh Lithium BatteryMediatek Helio G70 Processor', 'Mobiles, Vivo', 1, 'vivo7.webp', 'vivo8.webp', 'vivo9.webp', '13999', '2023-08-28 11:42:32', 'TRUE', 'no'),
(59, 'APPLE iPhone 13 ', '128 GB ROM15.49 cm (6.1 inch) Super Retina XDR Display12MP + 12MP | 12MP Front CameraA15 Bionic Chip Processor', 'Mobiles, Apple, iphone13', 1, 'apple1.webp', 'apple2.webp', 'apple3.webp', '60000', '2023-08-28 11:42:45', 'TRUE', 'no'),
(60, 'APPLE iPhone 14', '512 GB ROM15.49 cm (6.1 inch) Super Retina XDR Display12MP + 12MP | 12MP Front CameraA15 Bionic Chip, 6 Core Processor Processor', 'Mobiles, Apple, iphone14', 1, 'apple4.webp', 'apple5.webp', 'apple6.webp', '97999', '2023-08-28 11:43:25', 'TRUE', 'no'),
(61, 'APPLE iPhone 14 Plus', '128 GB ROM17.02 cm (6.7 inch) Super Retina XDR Display12MP + 12MP | 12MP Front CameraA15 Bionic Chip, 6 Core Processor Processor', 'Mobiles, Apple, iphone14 ,Bestseller', 1, 'apple7.webp', 'apple8.webp', 'apple9.webp', '76999', '2023-08-28 12:13:03', 'TRUE', 'yes'),
(62, 'Nokia 105 Single SIM, Keypad Mobile Phone ', '32 MB RAM | 32 MB ROM4.5 cm (1.77 inch) Display0MP | 0MP Front Camera1000 mAh BatterySC6531E Processor', 'Mobile, Nokia', 1, 'nokia1.webp', 'nokia2.webp', 'nokia3.webp', '1200', '2023-08-28 11:43:15', 'TRUE', 'no'),
(63, 'Nokia 105 Single SIM, Keypad Mobile Phone', '32 MB RAM | 32 MB ROM4.5 cm (1.77 inch) QVGA Display0MP Front Camera800 mAh Lithium Ion BatterySC6531E Processor', 'Mobile, Nokia', 1, 'nokia4.webp', 'nokia5.webp', 'nokia6.webp', '1300', '2023-08-28 11:43:04', 'TRUE', 'no'),
(64, 'Nokia C20 Plus Smartphone', '3 GB RAM | 32 GB ROM16.51 cm (6.5 inch) HD+ Display8MP + 2MP | 5MP Front Camera4950 mAh Li-ion BatteryUnisoc SC9863A Processor', 'mobile, Nokia ,Bestseller', 1, 'nokia7.webp', 'nokia8.webp', 'nokia9.webp', '8989', '2023-08-28 12:13:18', 'TRUE', 'yes'),
(67, 'Running Shoes For Men', 'Color White | Inner material P.U FOAM | Outer material Mesh | Model name FIRST | Ideal for Men | Occasion Sports | Type For Sports Running Shoes | Sole material EVA', 'Sports Shoe, men, boy, male, white shoe, fashion', 2, 'sports_shoe4(men).webp', 'sports_shoe5(men).webp', 'sports_shoe6(men).webp', '1299', '2023-09-14 08:47:35', 'true', 'yes'),
(68, 'Synthetic Leather For Men', 'Color Black Inner material Comfort Foam Outer material Synthetic Leather Model name Synthetic Leather Ideal for Men Occasion Formal Sole material Airmix Closure Lace-Ups', 'Formal shoe, men, boy , male, footwear, fashion, black', 2, 'formal_shoe1(men).webp', 'formal_shoe2(men).webp', 'formal_shoe3(men).webp', '542', '2023-09-14 08:49:54', 'true', 'yes'),
(69, 'Lace Up For Men', 'Color Black Outer material Synthetic Ideal for Men Occasion Formal Type For Formal Lace Up', 'Formal shoe', 2, 'formal_shoe4(men).webp', 'formal_shoe5(men).webp', 'formal_shoe6(men).webp', '599', '2023-09-14 08:51:33', 'true', 'no'),
(70, 'Men Regular Fit Solid Spread Collar Casual Shirt', 'Pack of 1 Style Code ST2 Closure Button Fit Regular Fabric Cotton Blend Sleeve Full Sleeve Pattern Solid Reversible No', 'Shirts, men, maroon', 2, 'shirts1(men).webp', 'shirts2(men).webp', 'shirts3(men).webp', '500', '2023-09-14 09:17:47', 'true', 'yes'),
(71, 'Men Slim Mid Rise Blue Jeans', 'Style Code eps-blue-03 Ideal For Men Suitable For Western Wear Pack Of 1 Pattern Solid Reversible No Sales Package 1 Jeans Closure Button', 'black jean, men , fashion, bottom wear', 2, 'jean1(men).webp', 'jean2(men).webp', 'jean3(men).webp', '1000', '2023-09-14 09:22:09', 'true', 'yes'),
(72, 'Men Slim Mid Rise Black Jeans', 'Style Code FMJEN0460 Ideal For Men Suitable For Western Wear Pack Of 1 Pattern Solid Reversible No Fabric Cotton Blend Faded Clean Look', 'Black jean men', 2, 'jean4(men).webp', 'jean5(men).webp', 'jean6(men).webp', '1200', '2023-09-14 09:26:24', 'true', 'no'),
(73, 'Men Full Sleeve Solid Hooded Sweatshirt', 'Color Grey Fabric Polyester Pattern Solid Neck Hooded Neck Sleeve Full Sleeve Style Code 10167357 Hooded Yes Reversible No', 'hoody, men, sweatshirts, grey sweatshirt', 2, 'sweatshirt4(men).webp', 'sweatshirt5(men).webp', 'sweatshirt6(men).webp', '800', '2023-09-14 09:36:56', 'true', 'no'),
(74, 'Men Cotton Blend Kurta Pyjama Set', 'Fabric Cotton Blend Type Kurta and Pyjama Set Sales Package Kurta and Pyjama Style Code 01 New Kurta Pajama Set Top type Kurta Bottom type Pyjama Pattern Striped Color Yellow', 'kurta set, kurta pyjama, men', 2, 'kurta1(men).webp', 'kurta2(men).webp', 'kurta3(men).webp', '1500', '2023-09-14 09:44:35', 'true', 'no'),
(75, 'Men Cotton Blend Kurta Pyjama Set', 'Fabric Cotton Blend Type Kurta and Pyjama Set Sales Package 1 Kurta , 1 Pyjama Style Code KRTPJ-PRINT SET-SQ BLR Top type Kurta Bottom type Pyjama Pattern Printed Color Multicolor', 'kurta pyjama for men', 2, 'kurta4(men).webp', 'kurta5(men).webp', 'kurta6(men).webp', '1500', '2023-09-14 09:48:48', 'true', 'no'),
(76, 'UV Protection Retro Square Sunglasses', 'Ideal For Men &amp; Women Purpose Biking, Driving, Eye Protection, Style Lens Color and Material Black, CR 39 Features UV Protection Frame Color Black Model Name Black Classic Stylish Sunglass M0009', 'sunglasses, googles', 2, 'specs1.webp', 'specs2.webp', 'specs3.webp', '1300', '2023-09-14 09:54:50', 'true', 'yes'),
(77, 'UV Protection Round Sunglasses', 'Ideal For Men &amp; Women Purpose Style Lens Color and Material Blue, Black, CR 39 Features UV Protection Frame Color Golden, Silver Type Round', 'sunglasses, goggles', 2, 'specs4.webp', 'specs5.webp', 'specs6.webp', '1500', '2023-09-14 09:57:10', 'true', 'no'),
(78, 'Casual Regular Sleeves Printed Women Multicolor Top', 'Neck Round Neck Sleeve Style Regular Sleeves Sleeve Length 3/4 Sleeve Fit Regular Fabric Viscose Rayon Type Peplum Top Belt Included No Pattern Printed', 'Casual Regular Sleeves Printed Women Multicolor Top, upper wear, top wear', 2, 'tops1(women).webp', 'tops2(women).webp', 'tops3(women).webp', '500', '2023-09-14 10:00:27', 'true', 'no'),
(79, 'Casual Regular Sleeves Printed Women Black Top', 'Neck Square Neck Sleeve Style Regular Sleeves Fit Regular Fabric Polyester Type Crop Top Pattern Printed Color Black', 'Casual Regular Sleeves Printed Women Black Top', 2, 'tops4(women).webp', 'tops5(women).webp', 'tops6(women).webp', '500', '2023-09-14 10:03:32', 'true', 'no'),
(80, 'Women Regular Fit Solid Slim Collar Formal Shirt', 'Closure BUTTONS Fit Regular Fabric Viscose Rayon Sleeve Full Sleeve Pattern Solid Reversible No Collar Slim Color Blue Fabric Care Gentle Machine Wash Suitable For Western Wear', 'Women Regular Fit Solid Slim Collar Formal Shirt', 2, 'tops7(women).webp', 'tops8(women).webp', 'tops9(women).webp', '700', '2023-09-14 10:05:15', 'true', 'yes'),
(81, 'Women Skater Pink Dress', 'Color Pink Length Mini/Short Fabric Polyester Ideal For Women Type Skater Suitable For Western Wear', 'Women Skater Pink Dress', 2, 'dress4(women).webp', 'dress5(women).webp', 'dress6(women).webp', '2000', '2023-09-14 10:08:35', 'true', 'no'),
(82, 'Women Bodycon Purple Dress', 'Color Purple Length Knee Length Fabric Lycra Blend Ideal For Women Type Bodycon Style Code D540_Dresss Suitable For Western Wear', 'Women Bodycon Purple Dress', 2, 'dress7(women).webp', 'dress8(women).webp', 'dress9(women).webp', '500', '2023-09-14 10:10:29', 'true', 'no'),
(83, 'Women Skinny High Rise Blue Jeans', 'Ideal For Women Suitable For Western Wear Pack Of 1 Reversible Yes Fabric Cotton Blend Faded Clean Look Rise High Rise', 'Women Skinny High Rise Blue Jeans', 2, 'jean4(women).webp', 'jean5(women).webp', 'jean6(women).webp', '1400', '2023-09-14 10:13:27', 'true', 'no'),
(84, 'Women Regular High Rise Blue Jeans', 'Ideal For Women Suitable For Western Wear Pack Of 1 Pocket Type Patch Pocket Pattern Solid Reversible No Closure BUTTONS', 'Women Regular High Rise Blue Jeans', 2, 'jean7(women).webp', 'jean8(women).webp', 'jean9(women).webp', '1600', '2023-09-14 10:22:10', 'true', 'no'),
(85, 'Woven Kanjivaram Pure Silk, Art Silk Saree', 'Style Code Banarasi Pattern Woven Pack of 1 Occasion Casual, Party &amp; Festive, Wedding, Wedding &amp; Festive Decorative Material Zari Construction Type Saree Fabric: Soft Silk, Blouse Fabric: Soft Silk', 'Woven Kanjivaram Pure Silk, Art Silk Saree', 2, 'saree1(women).webp', 'saree2(women).webp', 'saree3(women).webp', '879', '2023-09-14 10:28:33', 'true', 'no'),
(86, 'Floral Print Bollywood Georgette Saree', 'Pattern Floral Print Pack of 1 Occasion Party &amp; Festive Construction Type Digital Print Fabric Care Hand Wash Other Details Comes with unstitched blouse material. Fabric Georgette', 'Floral Print Bollywood Georgette Saree', 2, 'saree4(women).webp', 'saree5(women).webp', 'saree6(women).webp', '768', '2023-09-14 10:32:26', 'true', 'yes'),
(87, 'Printed Crepe Stitched Anarkali Gown', 'Style Code GOWN BADAMI Occasion Casual Neck Round Neck Sleeve Short Sleeve Length 52 inch Bust Size 36 inch Fabric Crepe Type Anarkali', 'Printed Crepe Stitched Anarkali Gown', 2, 'gown1(women).webp', 'gown2(women).webp', 'gown3(women).webp', '1500', '2023-09-14 10:48:17', 'true', 'yes'),
(88, 'Women Pink Flats Sandal', 'Type Flats Secondary Color Tan Leather Type Napa Upper Pattern Solid Closure One Toe Flats Type for Flats Sandal Color Pink Tanning Process Synthetic', 'Women Pink Flats Sandal, footwear', 2, 'flat1(women).webp', 'flat2(women).webp', 'flat3(women).webp', '600', '2023-09-14 10:53:04', 'true', 'no'),
(89, 'Women Natural Heels Sandal', 'Type Heels Type for Heels Block Heel Heel Pattern Solid Secondary Color Natural Color Natural Removable Insole No Pack of 1 Sole Material TPR', 'Women Natural Heels Sandal', 2, 'heel1(women).webp', 'heel2(women).webp', 'heel3(women).webp', '1000', '2023-09-14 11:01:06', 'true', 'no'),
(90, 'Women Black Handbag', 'Women Pu Leather Handbag Combo Set of 5 Number of Compartments 1 Capacity 5 L Sales Package Combo of 5 Handbags Bag Design Solid Material PU Width 36 cm Height 26 cm', 'Women Black Handbag', 2, 'handbag1(women).webp', 'handbag2(women).webp', 'handbag3(women).webp', '600', '2023-09-14 11:03:57', 'true', 'yes'),
(91, 'Women Pink Shoulder Bag', 'Hand Bag for women Number of Compartments 2 Capacity 12 L Sales Package Women Handbag Water Resistant No Material Artificial Leather Number of Pockets 3 Width 12 cm Height 30 cm Depth 28 cm Weight 800 g Closure Zip', 'Women Pink Shoulder Bag', 2, 'handbag4(women).webp', 'handbag5(women).webp', 'handbag6(women).webp', '1200', '2023-09-14 11:06:35', 'true', 'no'),
(92, 'Black Women Sling Bag', 'Material PU Number of Pockets 2 Number of Compartments 2 Model Name Quilted Vibrant Cross Body Sling Hand Bag For Girls Women Ladies Bag Size Mini Closure Magnetic Button Pattern Embroidered', 'Black Women Sling Bag', 2, 'sling1(women).webp', 'sling2(women).webp', 'sling3(women).webp', '1100', '2023-09-14 11:08:55', 'true', 'yes'),
(93, 'White Women Sling Bag', 'Material Leatherette Number of Pockets 1 Number of Compartments 1 Closure Magnetic Button Pack of 1 Sales Package 1 Sling Bag Color White', 'White Women Sling Bag', 2, 'sling4(women).webp', 'sling5(women).webp', 'sling6(women).webp', '1000', '2023-09-14 11:12:57', 'true', 'yes'),
(94, 'Canon EOS R50 Mirrorless Camera Body', '4K 30p (6K oversampled) &amp; FHD 120p, Up to 15 frames per second &amp; EOS iTR AF X, Shoot all angles, Dual Pixel CMOS Auto Focus II coupled', 'Canon EOS R50 Mirrorless Camera Body, electronics', 3, 'camera04.jpg', 'camera05.jpg', 'camera06.jpg', '45000', '2023-09-14 11:21:33', 'true', 'no'),
(95, 'Canon EOS R10 Mirrorless Camera Body', '4K UHD (6K oversampling) and 4K 60p, Up to 23 fps continuous shooting with AF/AE tracking, Effective Pixels: 24.2 MP Sensor Type: CMOS', 'Canon EOS R10 Mirrorless Camera Body, Electronics', 3, 'camera07.jpg', 'camera08.jpg', 'camera09.jpg', '83000', '2023-09-14 11:26:27', 'true', 'no'),
(96, 'boAt Airdopes 161', 'Bluetooth version: 5.1 Charge for 10 minute, boAt Immersive Sound - 10mm drivers Up to 40 HRS Total Playback Bluetooth v5.1 IWP Tech', 'boAt Airdopes 161 with 40 Hours Playback, ASAP Charge &amp; 10mm Drivers Bluetooth Headset  (Pebble Black, True Wireless)', 3, 'headphone01.jpg', 'headphone02.jpg', 'headphone03.jpg', '1099', '2023-09-14 11:33:40', 'true', 'yes'),
(97, 'boAt Airdopes 161', 'Bluetooth version: 5.1 Battery life: 40 Hours Wireless Range: 10m Battery Time: upto 40 Hours 10mm Drivers IPX5 Water &amp; Sweat Resistance', 'boAt Airdopes 161 with 40 Hours Playback, ASAP Charge &amp; 10mm Drivers Bluetooth Headset  (Cool Sapphire, True Wireless)', 3, 'headphone04.jpg', 'headphone05.jpg', 'headphone06.jpg', '1099', '2023-09-14 11:37:11', 'true', 'no'),
(98, 'boAt Airdopes 131', 'Bluetooth version: 5.0 / 5.1 Wireless range: 10 m Charging time: 2 Hours Playback Time: Upto 15 to 60 Hours Playback  13MM Drivers 7.IPX4: Sweat Resistance', 'boAt Airdopes 131 with upto 60 Hours and ASAP Charge Bluetooth Headset  (Active Black, True Wireless)', 3, 'headphone07.jpg', 'headphone08.jpg', 'headphone09.jpg', '899', '2023-09-14 11:38:58', 'true', 'no'),
(99, 'HP Ryzen 5 Hexa Core 5500U', 'Stylish &amp; Portable Thin and Light Laptop 15.6 inch Full HD, IPS, micro-edge, Bright View, Brightness: 250 nits, 141 ppi, Color Gamut: 45% NTSC Light Laptop without Optical Disk Drive', 'laptops, hp, electronics', 3, 'laptop04.jpg', 'laptop05.jpg', 'laptop06.jpg', '45990', '2023-09-14 11:48:20', 'true', 'no'),
(100, 'HP Intel Core i3 11th Gen 1115G4', 'Stylish &amp; Portable Thin and Light Laptop 14 inch Full HD, IPS, Micro-Edge, Anti-Glare, Brightness: 250 Nits, 157 PPI, Color Gamut: 45% NTSC Light Laptop without Optical Disk Drive', 'laptops, hp, electronics', 3, 'laptop07.jpg', 'laptop08.jpg', 'laptop09.jpg', '37878', '2023-09-14 11:51:02', 'true', 'no');

-- --------------------------------------------------------

--
-- Table structure for table `user_orders`
--

CREATE TABLE `user_orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_ids` varchar(255) DEFAULT NULL,
  `amount_due` int(255) NOT NULL,
  `invoice_number` int(255) NOT NULL,
  `total_products` int(255) NOT NULL,
  `deliver_address` varchar(255) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `order_status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_payments`
--

CREATE TABLE `user_payments` (
  `payment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `invoice_number` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `payment_mode` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_table`
--

CREATE TABLE `user_table` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_image` varchar(255) NOT NULL,
  `user_address` varchar(255) NOT NULL,
  `user_mobile` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_table`
--
ALTER TABLE `admin_table`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `cart_details`
--
ALTER TABLE `cart_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `orders_pending`
--
ALTER TABLE `orders_pending`
  ADD PRIMARY KEY (`pending_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `user_orders`
--
ALTER TABLE `user_orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `user_payments`
--
ALTER TABLE `user_payments`
  ADD PRIMARY KEY (`payment_id`);

--
-- Indexes for table `user_table`
--
ALTER TABLE `user_table`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_table`
--
ALTER TABLE `admin_table`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart_details`
--
ALTER TABLE `cart_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `orders_pending`
--
ALTER TABLE `orders_pending`
  MODIFY `pending_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `user_orders`
--
ALTER TABLE `user_orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_payments`
--
ALTER TABLE `user_payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_table`
--
ALTER TABLE `user_table`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart_details`
--
ALTER TABLE `cart_details`
  ADD CONSTRAINT `cart_details_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  ADD CONSTRAINT `cart_details_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
