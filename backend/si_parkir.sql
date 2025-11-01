-- Buat database
CREATE DATABASE si_parkir;
USE si_parkir;

-- Tabel user
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(50) NOT NULL,
    role ENUM('admin') NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Menambahkan user admin
INSERT INTO user (nama, role, username, password)
VALUES ('Administrator', 'admin', 'admin', 'admin123');

-- Tabel parkir_slots
CREATE TABLE parkir_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_parkir VARCHAR(10) NOT NULL UNIQUE,
    status ENUM('kosong','terisi') NOT NULL DEFAULT 'kosong',
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
