import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  VideoOff, Wifi, WifiOff, Activity, Zap,
  Maximize, Minimize, Eye, EyeOff
} from "lucide-react";

export default function WebcamViewer() {
  const [isConnected, setIsConnected] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState(null);
  const [showBoxes, setShowBoxes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slots, setSlots] = useState({});
  const [fps, setFps] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const outputRef = useRef(null);
  const wsRef = useRef(null);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const fpsCountRef = useRef(0);
  const showBoxesRef = useRef(showBoxes);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    showBoxesRef.current = showBoxes;
  }, [showBoxes]);

  const getWsUrl = () => {
    const url = new URL(API_URL);
    const wsProtocol = url.protocol === "https:" ? "wss:" : "ws:";
    return `${wsProtocol}//${url.host}/camera/ws`;
  };

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment"
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraReady(true);
        setError(null);
      }
    } catch (err) {
      setError("Tidak bisa akses kamera: " + err.message);
      setIsCameraReady(false);
    }
  }, []);

  const startSendingFrames = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const ws = wsRef.current;
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      if (!video || video.readyState < 2) return;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const frameData = canvas.toDataURL("image/jpeg", 0.8);
      ws.send(JSON.stringify({
        frame: frameData,
        show_boxes: showBoxesRef.current
      }));
    }, 200);
  }, []);

  const stopSendingFrames = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(getWsUrl());
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
      startSendingFrames();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (outputRef.current && data.frame) {
          outputRef.current.src = data.frame;
        }
        if (data.slots) {
          setSlots(data.slots);
        }
        fpsCountRef.current += 1;
      } catch (e) {
        console.error("WS parse error:", e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      stopSendingFrames();
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = () => {
      setError("Gagal konek ke server. Auto-reconnect dalam 3 detik...");
    };
  }, [startSendingFrames, stopSendingFrames]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFps(fpsCountRef.current);
      fpsCountRef.current = 0;
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    startCamera();
    connectWebSocket();
    return () => {
      stopSendingFrames();
      wsRef.current?.close();
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  const terisiCount = Object.values(slots).filter(s => s === "terisi").length;
  const kosongCount = Object.values(slots).filter(s => s === "kosong").length;

  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-75 animate-pulse" />
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

        <div className="flex gap-2 flex-wrap">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
            isCameraReady ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
          }`}>
            {isCameraReady
              ? <><Wifi size={16} className="text-green-400 animate-pulse" /><span className="text-green-300 text-sm font-semibold">Kamera ON</span></>
              : <><WifiOff size={16} className="text-red-400" /><span className="text-red-300 text-sm font-semibold">Kamera OFF</span></>
            }
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
            isConnected ? "bg-blue-500/10 border-blue-500/20" : "bg-slate-500/10 border-slate-500/20"
          }`}>
            <Zap size={16} className={isConnected ? "text-blue-400 animate-pulse" : "text-slate-400"} />
            <span className={`text-sm font-semibold ${isConnected ? "text-blue-300" : "text-slate-400"}`}>
              {isConnected ? `AI Active · ${fps} FPS` : "Connecting..."}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowBoxes(prev => !prev)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
            showBoxes
              ? "bg-purple-600 border-purple-500 text-white hover:bg-purple-700"
              : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
          }`}
        >
          {showBoxes
            ? <><Eye size={18} /><span className="text-sm font-semibold">Boxes ON</span></>
            : <><EyeOff size={18} /><span className="text-sm font-semibold">Boxes OFF</span></>
          }
        </button>
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-lg transition-all"
        >
          {isFullscreen
            ? <><Minimize size={18} /><span className="text-sm font-semibold">Exit Fullscreen</span></>
            : <><Maximize size={18} /><span className="text-sm font-semibold">Fullscreen</span></>
          }
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Video Container */}
      <div ref={containerRef} className="relative rounded-2xl overflow-hidden bg-slate-900/50 border border-white/10 shadow-xl">
        <video ref={videoRef} className="hidden" muted playsInline />
        <canvas ref={canvasRef} className="hidden" />

        {isConnected ? (
          <img ref={outputRef} alt="YOLO Detection Output" className="w-full h-auto block" />
        ) : (
          <div className="aspect-video flex items-center justify-center">
            <div className="text-center p-8">
              <VideoOff className="mx-auto mb-4 text-slate-500" size={64} />
              <p className="text-slate-400 font-semibold text-lg">
                {isCameraReady ? "Menghubungkan ke server..." : "Menunggu akses kamera..."}
              </p>
              <p className="text-slate-500 text-sm mt-2">Pastikan kamera diizinkan di browser</p>
            </div>
          </div>
        )}

        {isConnected && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full" />
            <span className="text-white text-sm font-bold">● LIVE</span>
          </div>
        )}

        {showBoxes && isConnected && (
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/10">
            <p className="text-white text-xs font-semibold mb-2">📊 Slot Status:</p>
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span className="text-white text-xs">Kosong ({kosongCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span className="text-white text-xs">Terisi ({terisiCount})</span>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10">
            <p className="text-white text-xs font-mono">🌐 getUserMedia</p>
          </div>
          {isConnected && showBoxes && (
            <div className="bg-gradient-to-r from-purple-600/70 to-pink-600/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
              <p className="text-white text-xs font-bold">🤖 YOLOv5 Active</p>
            </div>
          )}
          {isConnected && !showBoxes && (
            <div className="bg-gradient-to-r from-green-600/70 to-emerald-600/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
              <p className="text-white text-xs font-bold">👁️ Clean View</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
        <div className="backdrop-blur-xl bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-slate-400 mb-1">Sumber Kamera</p>
          <p className="text-white font-semibold">🌐 Browser getUserMedia</p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-slate-400 mb-1">Detection Model</p>
          <p className="text-white font-semibold">🤖 YOLOv5</p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-slate-400 mb-1">View Mode</p>
          <p className="text-white font-semibold">{showBoxes ? "📦 Boxes ON" : "👁️ Clean View"}</p>
        </div>
      </div>

      <div className="mt-4 backdrop-blur-xl bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
        <p className="text-blue-200 text-sm">
          <span className="font-bold">💡 </span>
          Kamera diakses langsung dari browser. Frame dikirim ke server via WebSocket,
          diproses YOLO, lalu hasil ditampilkan real-time.
          {showBoxes
            ? <> Klik <span className="font-semibold">"Boxes OFF"</span> untuk tampilan bersih.</>
            : <> Klik <span className="font-semibold">"Boxes ON"</span> untuk melihat deteksi YOLO.</>
          }
        </p>
      </div>
    </div>
  );
}