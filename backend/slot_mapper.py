import cv2
import numpy as np

"""
🎯 PARKING SLOT COORDINATE MAPPER
Tool untuk mapping koordinat slot parkir secara interaktif

CARA PAKAI:
1. Jalankan script ini
2. Webcam akan terbuka
3. Tekan SPASI untuk capture frame
4. Klik 2 titik untuk setiap slot (pojok kiri-atas, pojok kanan-bawah)
5. Urutan klik: A1 -> A2 -> A3 -> A4 -> A5 -> A6
6. Koordinat akan tersimpan dan ditampilkan di terminal
7. Copy-paste ke config.py

KONTROL:
- SPASI: Capture frame untuk mapping
- R: Reset koordinat
- S: Save koordinat
- Q: Keluar
"""

class SlotMapper:
    def __init__(self):
        self.slots = {
            "A1": [], "A2": [], "A3": [], 
            "A4": [], "A5": [], "A6": []
        }
        self.current_slot = "A1"
        self.slot_order = ["A1", "A2", "A3", "A4", "A5", "A6"]
        self.current_index = 0
        self.temp_point = None
        self.captured_frame = None
        self.mapping_mode = False
        
    def mouse_callback(self, event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN and self.mapping_mode:
            current = self.slot_order[self.current_index]
            
            if len(self.slots[current]) == 0:
                # Titik pertama (kiri-atas)
                self.slots[current].append((x, y))
                self.temp_point = (x, y)
                print(f"✅ {current} - Point 1: ({x}, {y})")
                
            elif len(self.slots[current]) == 1:
                # Titik kedua (kanan-bawah)
                self.slots[current].append((x, y))
                print(f"✅ {current} - Point 2: ({x}, {y})")
                print(f"📦 {current} koordinat: {self.slots[current]}\n")
                
                # Pindah ke slot berikutnya
                self.current_index += 1
                self.temp_point = None
                
                if self.current_index >= len(self.slot_order):
                    print("🎉 SEMUA SLOT SUDAH DI-MAP!")
                    print("Tekan 'S' untuk save, atau 'R' untuk reset")
    
    def draw_slots(self, frame):
        """Gambar slot yang sudah di-map"""
        display = frame.copy()
        
        for slot_name in self.slot_order:
            coords = self.slots[slot_name]
            
            if len(coords) == 2:
                # Slot sudah lengkap
                x1, y1 = coords[0]
                x2, y2 = coords[1]
                cv2.rectangle(display, (x1, y1), (x2, y2), (0, 255, 0), 3)
                cv2.putText(display, slot_name, (x1, y1 - 10),
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            
            elif len(coords) == 1:
                # Baru 1 titik
                x1, y1 = coords[0]
                cv2.circle(display, (x1, y1), 5, (255, 0, 0), -1)
        
        # Tampilkan instruksi
        if self.current_index < len(self.slot_order):
            current = self.slot_order[self.current_index]
            point_num = len(self.slots[current]) + 1
            instruction = f"Klik titik {point_num} untuk slot {current}"
            cv2.putText(display, instruction, (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
        
        return display
    
    def reset_mapping(self):
        """Reset semua koordinat"""
        self.slots = {k: [] for k in self.slot_order}
        self.current_index = 0
        self.temp_point = None
        print("🔄 Mapping direset!")
    
    def save_coordinates(self):
        """Generate kode Python untuk config.py"""
        print("\n" + "="*60)
        print("📋 COPY KODE INI KE config.py:")
        print("="*60)
        print("\nSLOT_MAPPING = {")
        
        for slot_name in self.slot_order:
            coords = self.slots[slot_name]
            if len(coords) == 2:
                x1, y1 = coords[0]
                x2, y2 = coords[1]
                # Pastikan x1 < x2 dan y1 < y2
                x1, x2 = min(x1, x2), max(x1, x2)
                y1, y2 = min(y1, y2), max(y1, y2)
                print(f'    "{slot_name}": ({x1}, {y1}, {x2}, {y2}),')
        
        print("}\n")
        print("="*60)
        print("✅ Koordinat berhasil di-generate!")
        print("="*60)
    
    def run(self):
        print("🎥 Membuka webcam...")
        cap = cv2.VideoCapture(0)
        
        # Set resolusi Full HD
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)
        
        if not cap.isOpened():
            print("❌ Gagal membuka webcam!")
            return
        
        print("✅ Webcam terbuka!")
        print("\n📖 INSTRUKSI:")
        print("1. Atur posisi kamera agar semua slot terlihat")
        print("2. Tekan SPASI untuk capture frame")
        print("3. Klik 2 titik untuk setiap slot (pojok kiri-atas, kanan-bawah)")
        print("4. Urutan: A1 -> A2 -> A3 -> A4 -> A5 -> A6")
        print("5. Tekan 'S' untuk save koordinat")
        print("6. Tekan 'R' untuk reset")
        print("7. Tekan 'Q' untuk keluar\n")
        
        cv2.namedWindow("Slot Mapper")
        cv2.setMouseCallback("Slot Mapper", self.mouse_callback)
        
        while True:
            if not self.mapping_mode:
                # Mode preview
                ret, frame = cap.read()
                if not ret:
                    continue
                
                display = frame.copy()
                cv2.putText(display, "Tekan SPASI untuk mulai mapping", (10, 30),
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
                cv2.imshow("Slot Mapper", display)
            
            else:
                # Mode mapping
                display = self.draw_slots(self.captured_frame)
                cv2.imshow("Slot Mapper", display)
            
            key = cv2.waitKey(1) & 0xFF
            
            if key == ord(' ') and not self.mapping_mode:
                # Capture frame
                ret, frame = cap.read()
                if ret:
                    self.captured_frame = frame.copy()
                    self.mapping_mode = True
                    print("📸 Frame captured! Mulai mapping...\n")
            
            elif key == ord('r'):
                # Reset
                self.reset_mapping()
            
            elif key == ord('s'):
                # Save
                if self.current_index >= len(self.slot_order):
                    self.save_coordinates()
                else:
                    print("⚠️ Belum semua slot di-map!")
            
            elif key == ord('q'):
                # Quit
                print("👋 Keluar...")
                break
        
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    mapper = SlotMapper()
    mapper.run()