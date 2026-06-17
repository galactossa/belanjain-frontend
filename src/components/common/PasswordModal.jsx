// src/components/common/PasswordModal.jsx

import { X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function PasswordModal({ isOpen, onClose, onConfirm, title, description }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!password.trim()) {
      setError("Password tidak boleh kosong");
      return;
    }
    setError("");
    onConfirm(password);
    setPassword("");
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900">
            {title || "Verifikasi Password"}
          </h2>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* DESCRIPTION */}
        {description && (
          <p className="text-sm text-slate-500 mb-6">{description}</p>
        )}

        {/* PASSWORD INPUT */}
        <div className="relative">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleConfirm();
                }
              }}
              placeholder="Masukkan password Anda"
              className="w-full h-14 rounded-2xl border border-slate-200 px-5 pr-12 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 font-semibold">{error}</p>
          )}
        </div>

        {/* BUTTONS */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            onClick={handleClose}
            className="h-14 rounded-2xl bg-slate-100 font-black text-slate-600 hover:bg-slate-200 transition"
          >
            BATAL
          </button>
          <button
            onClick={handleConfirm}
            className="h-14 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition shadow-lg"
          >
            KONFIRMASI
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasswordModal;
