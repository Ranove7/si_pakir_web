# 🎬 SCRIPT NARASI VIDEO DEMO
## Implementasi DevOps pada Sistem Informasi Parkir
**Nama:** Ranove Farrel Cavalera | **NIM:** E41232061
**Mata Kuliah:** Workshop Developer Operational | **Dosen:** Bu Arvita

---

> **📌 Tips Sebelum Rekam:**
> - Gunakan OBS Studio atau Loom untuk screen recording
> - Resolusi minimal 1080p, mic aktif
> - Buka semua tab browser terlebih dahulu sebelum rekam
> - Estimasi total durasi: **8–10 menit**

---

## 🎬 SCENE 1 — OPENING (±45 detik)

**[Tampilkan: Slide Cover Presentasi di browser]**

> *"Assalamualaikum warahmatullahi wabarakatuh.*
>
> *Perkenalkan, nama saya Ranove Farrel Cavalera, NIM E41232061, dari Program Studi Teknik Informatika Politeknik Negeri Jember.*
>
> *Dalam video ini saya akan melakukan demo implementasi DevOps pada Sistem Informasi Parkir yang telah saya deploy di VPS production sebagai tugas perbaikan nilai mata kuliah Workshop Developer Operational, yang dibimbing oleh Bu Arvita.*
>
> *Sistem yang saya bangun mencakup: Dockerisasi aplikasi, pipeline CI/CD otomatis dengan GitHub Actions, serta sistem monitoring menggunakan Prometheus dan Grafana.*
>
> *Langsung saja kita mulai!"*

---

## 🎬 SCENE 2 — INFRASTRUKTUR DOCKER (±2 menit)

**[Buka terminal SSH ke VPS atau terminal yang sudah tersambung]**

> *"Pertama, saya akan tunjukkan infrastruktur Docker yang berjalan di VPS dengan IP 202.155.143.247.*
>
> *Saya jalankan perintah berikut untuk melihat semua container yang aktif:"*

**[Ketik dan jalankan:]**
```
	
```

> *"Bisa dilihat di sini ada 7 container yang semuanya berstatus Running.*
>
> *Yang pertama, **si_parkir_db** — ini adalah database MySQL 8.0 yang menyimpan seluruh data parkir.*
>
> *Kedua, **si_parkir_backend** — ini backend FastAPI Python yang menyediakan REST API dan WebSocket untuk deteksi parkir menggunakan YOLO.*
>
> *Ketiga, **si_parkir_frontend** — ini frontend React yang di-serve menggunakan Nginx, sekaligus berfungsi sebagai reverse proxy.*
>
> *Keempat dan kelima, **si_parkir_prometheus** dan **si_parkir_grafana** — ini sistem monitoring kita.*
>
> *Dan terakhir, **si_parkir_node_exporter** dan **si_parkir_cadvisor** — keduanya bertanggung jawab mengumpulkan metrics dari server dan container."*

**[Jalankan:]**
```
sudo docker -H unix:///var/run/docker.sock network inspect si_parkir_net --format "{{range .Containers}}{{.Name}} {{end}}"
```

> *"Semua container terhubung dalam satu Docker network bernama **si_parkir_net**, sehingga mereka bisa saling berkomunikasi menggunakan nama container, bukan IP address."*

---

## 🎬 SCENE 3 — DEMO APLIKASI SI PARKIR (±1.5 menit)

**[Buka browser → `http://202.155.143.247`]**

> *"Sekarang kita lihat aplikasi Sistem Informasi Parkir yang sudah berjalan di VPS.*
>
> *Ini adalah tampilan utama aplikasi — bisa diakses dari internet melalui port 80 berkat reverse proxy Nginx yang sudah kita konfigurasi.*
>
> *Saya coba login ke dalam sistem..."*

**[Login ke aplikasi]**

> *"Setelah masuk, kita bisa melihat dashboard parkir yang menampilkan status slot parkir secara real-time.*
>
> *Data ini dikomunikasikan antara frontend React dan backend FastAPI melalui path `/api/` yang dirutekan oleh Nginx."*

**[Navigasi singkat di aplikasi, tunjukkan 1-2 halaman]**

> *"Aplikasi berjalan lancar tanpa error di environment production VPS."*

---

## 🎬 SCENE 4 — PROMETHEUS MONITORING (±2 menit)

**[Buka tab baru → `http://202.155.143.247/prometheus/targets`]**

> *"Selanjutnya kita lihat sistem monitoring Prometheus.*
>
> *Ini adalah halaman **Target Health** Prometheus yang bisa diakses melalui path `/prometheus/` di port 80 — sebelumnya saya perlu melewati konfigurasi khusus karena firewall VPS hanya membuka port 22 dan 80.*
>
> *Bisa dilihat ada **4 scrape target** yang semuanya berstatus UP atau hijau."*

**[Zoom ke bagian target list]**

> *"**node-exporter** — mengumpulkan metrics CPU, RAM, Disk, dan Network dari server VPS secara langsung.*
>
> ***cadvisor** — mengumpulkan metrics resource usage dari setiap Docker container.*
>
> ***backend** — ini endpoint `/metrics` yang saya tambahkan ke FastAPI menggunakan library prometheus-fastapi-instrumentator, untuk memantau jumlah request HTTP dan latency API.*
>
> *Dan **prometheus** sendiri juga memonitor dirinya sendiri.*
>
> *Prometheus melakukan scraping ke semua target ini setiap **15 detik** secara otomatis."*

**[Klik salah satu target, misalnya node-exporter → lihat endpoint-nya]**

> *"Data yang dikumpulkan inilah yang kemudian divisualisasikan di Grafana."*

---

## 🎬 SCENE 5 — GRAFANA DASHBOARD (±2 menit)

**[Buka tab baru → `http://202.155.143.247/grafana/`]**

> *"Sekarang kita buka Grafana untuk melihat dashboard monitoring secara visual.*
>
> *Grafana ini juga bisa diakses lewat port 80 melalui path `/grafana/`."*

**[Login Grafana jika perlu: admin / admin123]**

**[Buka dashboard Node Exporter Full]**

> *"Ini adalah dashboard **Node Exporter Full** dengan ID 1860 yang sudah saya import.*
>
> *Dashboard ini menampilkan kondisi VPS secara real-time."*

**[Tunjukkan panel CPU Usage]**

> *"Di sini kita bisa melihat **penggunaan CPU** saat ini beserta load average 1 menit, 5 menit, dan 15 menit terakhir."*

**[Scroll ke panel Memory]**

> *"Ini panel **RAM** — kita bisa lihat berapa memori yang terpakai dari total yang tersedia di server."*

**[Scroll ke panel Disk & Network]**

> *"Dan ini **Disk** dan **Network** — kita bisa memantau penggunaan storage dan bandwidth secara live.*
>
> *Dengan monitoring seperti ini, kita bisa mendeteksi masalah performa jauh sebelum server down."*

---

## 🎬 SCENE 6 — CI/CD PIPELINE GITHUB ACTIONS (±1.5 menit)

**[Buka browser → `https://github.com/Ranove7/si_pakir_web/actions`]**

> *"Terakhir, saya tunjukkan pipeline CI/CD yang saya buat menggunakan GitHub Actions.*
>
> *Ini adalah halaman Actions di repository GitHub saya."*

**[Klik workflow run yang sudah selesai]**

> *"Bisa dilihat di sini ada riwayat deployment otomatis.*
>
> *Cara kerjanya sederhana: setiap kali saya push kode baru ke branch **main**, GitHub Actions secara otomatis akan:"*

**[Tunjukkan langkah-langkah di dalam workflow run]**

> *"Pertama, **SSH ke VPS** menggunakan credentials yang disimpan di GitHub Secrets — jadi password VPS tidak pernah terekspos di kode.*
>
> *Kedua, **git pull** untuk mengambil kode terbaru.*
>
> *Ketiga, **docker compose up --build** untuk membangun ulang container yang perubahannya terdeteksi.*
>
> *Dan container baru langsung running — proses ini berlangsung otomatis tanpa saya perlu masuk ke VPS secara manual.*
>
> *Inilah inti dari praktik **Continuous Deployment** dalam DevOps."*

---

## 🎬 SCENE 7 — CLOSING (±30 detik)

**[Tampilkan kembali Slide Penutup presentasi]**

> *"Demikian demo implementasi DevOps pada Sistem Informasi Parkir yang telah saya bangun.*
>
> **kita telah berhasil mengimplementasikan:**
> - **Containerisasi** dengan Docker Compose untuk 7 service
> - **CI/CD otomatis** dengan GitHub Actions
> - **Monitoring real-time** dengan Prometheus dan Grafana
> - **Reverse proxy** dengan Nginx untuk akses terpusat
>
> *Terima kasih kepada Bu Arvita atas memberikan saya perbaikan nilai dalam mata kuliah Workshop Developer Operational.*
>
> *Wassalamualaikum warahmatullahi wabarakatuh."*

---

## 📋 CHECKLIST SEBELUM REKAM

- [✓] VPS semua container running (`docker ps`)
- [✓ ] Browser tab 1: `http://202.155.143.247` (aplikasi)
- [✓ ] Browser tab 2: `http://202.155.143.247/prometheus/targets`
- [ ✓] Browser tab 3: `http://202.155.143.247/grafana/` (sudah login)
- [✓ ] Browser tab 4: `https://github.com/Ranove7/si_pakir_web/actions`
- [✓ ] Terminal SSH ke VPS sudah terbuka
- [✓ ] Presentasi HTML sudah terbuka di browser
- [ ✓] Mic sudah ditest, tidak ada noise
- [ ✓] Screen recorder sudah siap (OBS / Loom / dll)

---

## ⏱️ ESTIMASI WAKTU

| Scene | Konten | Durasi |
|---|---|---|
| 1 | Opening | ~45 detik |
| 2 | Infrastruktur Docker | ~2 menit |
| 3 | Demo Aplikasi | ~1.5 menit |
| 4 | Prometheus Targets | ~2 menit |
| 5 | Grafana Dashboard | ~2 menit |
| 6 | CI/CD GitHub Actions | ~1.5 menit |
| 7 | Closing | ~30 detik |
| **Total** | | **~10 menit** |
