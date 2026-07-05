-- =============================================
-- SI PARKIR - Database Migration Script
-- Auto-run saat MySQL container pertama kali start
-- =============================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS `si_parkir` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_0900_ai_ci;

USE `si_parkir`;

-- =============================================
-- TABLE: parkir_slots
-- =============================================
CREATE TABLE IF NOT EXISTS `parkir_slots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kode_parkir` varchar(10) NOT NULL,
  `status` enum('kosong','terisi') NOT NULL DEFAULT 'kosong',
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode_parkir` (`kode_parkir`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- TABLE: users
-- =============================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_card` varchar(50) DEFAULT NULL,
  `role` enum('admin','petugas','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- TABLE: history_parkir
-- =============================================
CREATE TABLE IF NOT EXISTS `history_parkir` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kode_parkir` varchar(10) NOT NULL,
  `user_id` int DEFAULT NULL,
  `aktivitas` enum('parkir_masuk','parkir_keluar') NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `kode_parkir` (`kode_parkir`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `history_parkir_ibfk_1` FOREIGN KEY (`kode_parkir`) REFERENCES `parkir_slots` (`kode_parkir`),
  CONSTRAINT `history_parkir_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- DATA AWAL: parkir_slots (6 slot)
-- =============================================
INSERT IGNORE INTO `parkir_slots` (`kode_parkir`, `status`, `timestamp`) VALUES
('A1', 'kosong', '2026-05-05 16:52:14'),
('A2', 'kosong', '2026-05-05 16:53:04'),
('A3', 'kosong', '2026-05-05 16:52:14'),
('A4', 'kosong', '2026-05-05 16:52:14'),
('A5', 'kosong', '2026-05-05 16:53:05'),
('A6', 'kosong', '2026-05-05 16:52:14');

-- =============================================
-- DATA AWAL: users (admin, petugas, user)
-- Password semua: password123
-- =============================================
INSERT IGNORE INTO `users` (`id`, `nama`, `username`, `email`, `password`, `id_card`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Parlembang Admin', 'admin01', 'admin@parkir.com', '$2b$12$pCjtgBPm9plQVQe2CSQFgOC1aLmRw6.e1vminN06fR17pamKyy/aa', 'CARD001', 'admin', '2026-05-05 09:52:13', '2026-05-05 09:52:13'),
(2, 'Rudi Petugas', 'petugas01', 'petugas@parkir.com', '$2b$12$.wkn.YRWP19AJd.05EpVeeCPfonuKLqAs5BKZzUsWp2XDUOFy87bu', 'CARD002', 'petugas', '2026-05-05 09:52:13', '2026-05-05 09:52:13'),
(3, 'Andi User', 'user01', 'user@parkir.com', '$2b$12$X9tPwqcY0aDaRmC27kkZAOfS1LT.hMP.KXj3bDWYY9RktMM1vjwk2', NULL, 'user', '2026-05-05 09:52:13', '2026-05-05 09:52:13'),
(5, 'bintang', 'tangs', 'bintang@gmail.com', '$2b$12$GEn0JW3o9gEteRKckT564.wy.AXP99ijwYflnpys3Aw6.ikcy0sRq', 'B44801B0', 'user', '2026-05-15 09:46:49', '2026-05-15 09:46:49');

-- =============================================
-- DATA AWAL: history_parkir (contoh data)
-- =============================================
INSERT IGNORE INTO `history_parkir` (`id`, `kode_parkir`, `user_id`, `aktivitas`, `timestamp`) VALUES
(24, 'A2', 3, 'parkir_masuk', '2026-05-15 12:06:42'),
(25, 'A2', 3, 'parkir_keluar', '2026-05-15 12:06:49'),
(26, 'A2', 5, 'parkir_keluar', '2026-05-18 10:41:35'),
(27, 'A2', 5, 'parkir_keluar', '2026-05-18 10:41:49');

-- Set AUTO_INCREMENT
ALTER TABLE `parkir_slots` AUTO_INCREMENT = 7;
ALTER TABLE `users` AUTO_INCREMENT = 6;
ALTER TABLE `history_parkir` AUTO_INCREMENT = 28;

COMMIT;
