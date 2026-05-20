import React, { useState, useEffect, useRef } from "react";
import { Video, VideoOff, Wifi, WifiOff, Activity, Zap, Maximize, Minimize, Eye, EyeOff } from "lucide-react";

export default function WebcamViewer() {
  const [isOnline, setIsOnline] = useState(false);
  const [error, setError] = useState(false);
  const [yoloEnabled, setYoloEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBoxes, setShowBoxes] = useState(true);
  const containerRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    checkCameraStatus();
    const interval = setInterval(checkCameraStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Handle fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const checkCameraStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/camera/status`);
      const data = await response.json();
      setIsOnline(data.status === "online");
      setYoloEnabled(data.yolo_enabled || false);
      setError(false);
    } catch (err) {
      setError(true);
      setIsOnline(false);
    }
  };

  // ✅ Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // ✅ Toggle Boxes
  const toggleBoxes = () => {
    setShowBoxes(!showBoxes);
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-75 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
              <Activity className="text-white" size={24} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Kamera LIVE
            </h2>
            <p className="text-slate-400 text-sm">Real-time parking monitoring with AI</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex gap-2">
          {/* Camera Status */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              isOnline
                ? "bg-green-500/10 border-green-500/20"
                : "bg-red-500/10 border-red-500/20"
            }`}
          >
            {isOnline ? (
              <>
                <Wifi size={16} className="text-green-400 animate-pulse" />
                <span className="text-green-300 text-sm font-semibold">
                  Camera Online
                </span>
              </>
            ) : (
              <>
                <WifiOff size={16} className="text-red-400" />
                <span className="text-red-300 text-sm font-semibold">
                  Camera Offline
                </span>
              </>
            )}
          </div>

          {/* YOLO Status */}
          {yoloEnabled && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-blue-500/10 border-blue-500/20">
              <Zap size={16} className="text-blue-400 animate-pulse" />
              <span className="text-blue-300 text-sm font-semibold">
                AI Active
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2 mb-4">
        {/* Toggle Boxes Button */}
        <button
          onClick={toggleBoxes}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
            showBoxes
              ? "bg-purple-600 border-purple-500 text-white hover:bg-purple-700"
              : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
          }`}
        >
          {showBoxes ? (
            <>
              <Eye size={18} />
              <span className="text-sm font-semibold">Boxes ON</span>
            </>
          ) : (
            <>
              <EyeOff size={18} />
              <span className="text-sm font-semibold">Boxes OFF</span>
            </>
          )}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-lg transition-all duration-300"
        >
          {isFullscreen ? (
            <>
              <Minimize size={18} />
              <span className="text-sm font-semibold">Exit Fullscreen</span>
            </>
          ) : (
            <>
              <Maximize size={18} />
              <span className="text-sm font-semibold">Fullscreen</span>
            </>
          )}
        </button>
      </div>

      {/* Video Stream Container */}
      <div
        ref={containerRef}
        className={`relative rounded-2xl overflow-hidden bg-slate-900/50 border border-white/10 shadow-xl ${
          isFullscreen ? "fullscreen-container" : ""
        }`}
      >
        {error ? (
          <div className="aspect-video flex items-center justify-center">
            <div className="text-center p-8">
              <VideoOff className="mx-auto mb-4 text-red-400" size={64} />
              <p className="text-slate-300 font-semibold mb-2 text-lg">
                Unable to connect to camera
              </p>
              <p className="text-slate-500 text-sm mb-4">
                Please check your backend server is running
              </p>
              <button
                onClick={checkCameraStatus}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg hover:shadow-purple-500/50"
              >
                🔄 Retry Connection
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Video Stream - URL berubah sesuai showBoxes */}
            <img
              key={showBoxes ? "boxes-on" : "boxes-off"}
              src={`${API_URL}/camera/feed?show_boxes=${showBoxes}`}
              alt="YOLO Object Detection Live Feed"
              className="w-full h-auto"
              onError={() => setError(true)}
              onLoad={() => setError(false)}
            />
            
            {/* Live Indicator (Overlay) */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg animate-pulse">
              <div className="w-3 h-3 bg-white rounded-full animate-ping absolute"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="text-white text-sm font-bold ml-2">● LIVE</span>
            </div>

            {/* Info Badges */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              {/* Resolution */}
              <div className="bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10">
                <p className="text-white text-xs font-mono">📹 1920 x 1080</p>
              </div>
              
              {/* YOLO Badge */}
              {yoloEnabled && showBoxes && (
                <div className="bg-gradient-to-r from-purple-600/70 to-pink-600/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
                  <p className="text-white text-xs font-bold">🤖 YOLO v5 Active</p>
                </div>
              )}

              {/* Clean Mode Badge */}
              {!showBoxes && (
                <div className="bg-gradient-to-r from-green-600/70 to-emerald-600/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
                  <p className="text-white text-xs font-bold">👁️ Clean View</p>
                </div>
              )}
            </div>

            {/* Legend - Only show when boxes are ON */}
            {showBoxes && (
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/10">
                <p className="text-white text-xs font-semibold mb-2">📊 Slot Status:</p>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-white text-xs">Kosong</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-white text-xs">Terisi</span>
                  </div>
                </div>
              </div>
            )}

            {/* Fullscreen Controls Overlay */}
            {isFullscreen && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-full">
                  <p className="text-white text-sm font-semibold">Press ESC to exit fullscreen</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info Footer */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
        <div className="backdrop-blur-xl bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-slate-400 mb-1">Webcam Source</p>
          <p className="text-white font-semibold">📹 Camera Index 0</p>
        </div>
        
        <div className="backdrop-blur-xl bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-slate-400 mb-1">Detection Model</p>
          <p className="text-white font-semibold">🤖 YOLOv5</p>
        </div>
        
        <div className="backdrop-blur-xl bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-slate-400 mb-1">View Mode</p>
          <p className="text-white font-semibold">
            {showBoxes ? "📦 Boxes ON" : "👁️ Clean View"}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mt-4 backdrop-blur-xl bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
        <p className="text-blue-200 text-sm">
          <span className="font-bold">💡:</span> 
          {showBoxes ? (
            <> Menampilkan kotak deteksi YOLO. Klik <span className="font-semibold">"Boxes OFF"</span> untuk tampilan bersih tanpa kotak deteksi YOLO.</>
          ) : (
            <> Tampilan bersih aktif. Klik <span className="font-semibold">"Boxes ON"</span> untuk melihat tampilan menggunakan YOLO.</>
          )}
        </p>
      </div>

      <style jsx>{`
        .fullscreen-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          background: black;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fullscreen-container img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
}