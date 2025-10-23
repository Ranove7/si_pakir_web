-- Buat database
CREATE DATABASE si_parkir;
USE si_parkir;

-- Tabel parkir_slots
CREATE TABLE parkir_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_parkir VARCHAR(10) NOT NULL UNIQUE,
    status ENUM('empty','occupied') NOT NULL DEFAULT 'empty',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel history_parkir
CREATE TABLE history_parkir (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_parkir VARCHAR(10) NOT NULL,
    aktivitas ENUM('parkir_masuk','parkir_keluar') NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kode_parkir) REFERENCES parkir_slots(kode_parkir)
);
