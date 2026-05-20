-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 20, 2026 at 05:25 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `si_parkir`
--

-- --------------------------------------------------------

--
-- Table structure for table `history_parkir`
--

CREATE TABLE `history_parkir` (
  `id` int NOT NULL,
  `kode_parkir` varchar(10) NOT NULL,
  `user_id` int DEFAULT NULL,
  `aktivitas` enum('parkir_masuk','parkir_keluar') NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `history_parkir`
--

INSERT INTO `history_parkir` (`id`, `kode_parkir`, `user_id`, `aktivitas`, `timestamp`) VALUES
(24, 'A2', 3, 'parkir_masuk', '2026-05-15 12:06:42'),
(25, 'A2', 3, 'parkir_keluar', '2026-05-15 12:06:49'),
(26, 'A2', 5, 'parkir_keluar', '2026-05-18 10:41:35'),
(27, 'A2', 5, 'parkir_keluar', '2026-05-18 10:41:49');

-- --------------------------------------------------------

--
-- Table structure for table `parkir_slots`
--

CREATE TABLE `parkir_slots` (
  `id` int NOT NULL,
  `kode_parkir` varchar(10) NOT NULL,
  `status` enum('kosong','terisi') NOT NULL DEFAULT 'kosong',
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `parkir_slots`
--

INSERT INTO `parkir_slots` (`id`, `kode_parkir`, `status`, `timestamp`) VALUES
(1, 'A1', 'kosong', '2026-05-05 16:52:14'),
(2, 'A2', 'kosong', '2026-05-05 16:53:04'),
(3, 'A3', 'kosong', '2026-05-05 16:52:14'),
(4, 'A4', 'kosong', '2026-05-05 16:52:14'),
(5, 'A5', 'kosong', '2026-05-05 16:53:05'),
(6, 'A6', 'kosong', '2026-05-05 16:52:14');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `nama` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_card` varchar(50) DEFAULT NULL,
  `role` enum('admin','petugas','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `username`, `email`, `password`, `id_card`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Parlembang Admin', 'admin01', 'admin@parkir.com', '$2b$12$pCjtgBPm9plQVQe2CSQFgOC1aLmRw6.e1vminN06fR17pamKyy/aa', 'CARD001', 'admin', '2026-05-05 09:52:13', '2026-05-05 09:52:13'),
(2, 'Rudi Petugas', 'petugas01', 'petugas@parkir.com', '$2b$12$.wkn.YRWP19AJd.05EpVeeCPfonuKLqAs5BKZzUsWp2XDUOFy87bu', 'CARD002', 'petugas', '2026-05-05 09:52:13', '2026-05-05 09:52:13'),
(3, 'Andi User', 'user01', 'user@parkir.com', '$2b$12$X9tPwqcY0aDaRmC27kkZAOfS1LT.hMP.KXj3bDWYY9RktMM1vjwk2', NULL, 'user', '2026-05-05 09:52:13', '2026-05-05 09:52:13'),
(5, 'bintang', 'tangs', 'bintang@gmail.com', '$2b$12$GEn0JW3o9gEteRKckT564.wy.AXP99ijwYflnpys3Aw6.ikcy0sRq', 'B44801B0', 'user', '2026-05-15 09:46:49', '2026-05-15 09:46:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `history_parkir`
--
ALTER TABLE `history_parkir`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kode_parkir` (`kode_parkir`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `parkir_slots`
--
ALTER TABLE `parkir_slots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_parkir` (`kode_parkir`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `history_parkir`
--
ALTER TABLE `history_parkir`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `parkir_slots`
--
ALTER TABLE `parkir_slots`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `history_parkir`
--
ALTER TABLE `history_parkir`
  ADD CONSTRAINT `history_parkir_ibfk_1` FOREIGN KEY (`kode_parkir`) REFERENCES `parkir_slots` (`kode_parkir`),
  ADD CONSTRAINT `history_parkir_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
