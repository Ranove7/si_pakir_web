#!/bin/bash
# ==============================================
# SCRIPT SETUP DEVOPS - SI PARKIR
# VPS Ubuntu 22.04
# ==============================================

set -e  # Hentikan jika ada error

echo "=============================================="
echo "  🚀 SETUP DEVOPS SI PARKIR"
echo "  VPS: $(hostname -I | awk '{print $1}')"
echo "=============================================="

# =====================
# 1. UPDATE SISTEM
# =====================
echo ""
echo "📦 [1/6] Update sistem..."
sudo apt-get update -y
sudo apt-get upgrade -y

# =====================
# 2. INSTALL DOCKER
# =====================
echo ""
echo "🐳 [2/6] Install Docker..."

# Hapus versi lama jika ada
sudo apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Install dependencies
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Tambah Docker GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Tambah Docker repository
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Tambah user ke grup docker
sudo usermod -aG docker $USER

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

echo "✅ Docker berhasil diinstall: $(docker --version)"

# =====================
# 3. INSTALL GIT
# =====================
echo ""
echo "📁 [3/6] Install Git..."
sudo apt-get install -y git
echo "✅ Git: $(git --version)"

# =====================
# 4. CLONE PROJECT
# =====================
echo ""
echo "📥 [4/6] Clone project dari GitHub..."

cd /home/ubuntu

if [ -d "si_pakir_web" ]; then
    echo "⚠️  Folder sudah ada, pull update..."
    cd si_pakir_web
    git pull origin main
else
    git clone https://github.com/Ranove7/si_pakir_web.git
    cd si_pakir_web
fi

# =====================
# 5. BUAT FILE .env
# =====================
echo ""
echo "⚙️  [5/6] Setup environment variables..."

if [ ! -f ".env" ]; then
cat > .env << 'EOF'
# Database
DB_ROOT_PASSWORD=rootVPS2024!
DB_NAME=si_parkir
DB_USER=parkir_user
DB_PASSWORD=parkir_pass2024!

# YOLO Settings
YOLO_MODEL_PATH=model_yolo/best.pt
DETECTION_INTERVAL=0.5
CAMERA_INDEX=0
CAMERA_BUFFER_SIZE=1
SKIP_FRAMES=2
MAX_FRAME_WIDTH=1280
CONFIDENCE_THRESHOLD=0.5

# Grafana
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin123
EOF
echo "✅ File .env berhasil dibuat"
else
    echo "⚠️  File .env sudah ada, skip..."
fi

# =====================
# 6. JALANKAN DOCKER COMPOSE
# =====================
echo ""
echo "🐳 [6/6] Menjalankan semua container..."
sudo docker compose up -d --build

echo ""
echo "=============================================="
echo "  ✅ SETUP SELESAI!"
echo "=============================================="
echo ""
IP=$(hostname -I | awk '{print $1}')
echo "  🌐 Aplikasi Frontend : http://$IP"
echo "  🔌 Backend API       : http://$IP:8000"
echo "  📊 Grafana Dashboard : http://$IP:3000"
echo "     Username: admin | Password: admin123"
echo "  🔍 Prometheus        : http://$IP:9090"
echo "  📦 cAdvisor          : http://$IP:8080"
echo ""
echo "  📋 Cek status container:"
echo "     sudo docker compose ps"
echo "=============================================="
