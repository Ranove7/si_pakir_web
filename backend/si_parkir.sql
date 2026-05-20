-- Buat database
CREATE DATABASE si_parkir;
USE si_parkir;

-- =========================
-- Tabel users
-- =========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    id_card VARCHAR(50) NULL,
    role ENUM('admin', 'petugas', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dummy akun user (password sudah bcrypt)
INSERT INTO users (nama, username, email, password, id_card, role) VALUES
('Parlembang Admin', 'admin01', 'admin@parkir.com', '$2b$12$pCjtgBPm9plQVQe2CSQFgOC1aLmRw6.e1vminN06fR17pamKyy/aa', 'CARD001', 'admin'),
('Rudi Petugas', 'petugas01', 'petugas@parkir.com', '$2b$12$.wkn.YRWP19AJd.05EpVeeCPfonuKLqAs5BKZzUsWp2XDUOFy87bu', 'CARD002', 'petugas'),
('Andi User', 'user01', 'user@parkir.com', '$2b$12$X9tPwqcY0aDaRmC27kkZAOfS1LT.hMP.KXj3bDWYY9RktMM1vjwk2', NULL, 'user');

-- =========================
-- Tabel parkir_slots
-- =========================
CREATE TABLE parkir_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_parkir VARCHAR(10) NOT NULL UNIQUE,
    status ENUM('kosong','terisi') NOT NULL DEFAULT 'kosong',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dummy slot parkir A1 - A6
INSERT INTO parkir_slots (kode_parkir, status) VALUES
('A1', 'kosong'),
('A2', 'terisi'),
('A3', 'kosong'),
('A4', 'kosong'),
('A5', 'terisi'),
('A6', 'kosong');

-- =========================
-- Tabel history_parkir
-- =========================
CREATE TABLE history_parkir (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_parkir VARCHAR(10) NOT NULL,
    user_id INT,
    aktivitas ENUM('parkir_masuk','parkir_keluar') NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kode_parkir) REFERENCES parkir_slots(kode_parkir),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Dummy history parkir
INSERT INTO history_parkir (kode_parkir, user_id, aktivitas) VALUES
('A2', 3, 'parkir_masuk'),
('A5', 2, 'parkir_masuk');