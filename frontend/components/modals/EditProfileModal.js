"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { X, User, Mail, Lock, Loader2, Settings, Camera } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_URL = "/api";

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, updateLocalUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Step 1: Upload avatar if changed
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", avatarFile);
        
        const avatarRes = await axios.post(`${API_URL}/auth/profile/avatar`, avatarFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        updateLocalUser(avatarRes.data);
        setAvatarFile(null); // Clear selected file after successful upload
      }

      // Step 2: Update remaining profile fields
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      const { data } = await axios.put(`${API_URL}/auth/profile`, payload);

      updateLocalUser(data);
      setSuccess("Profile updated successfully!");

      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'>
      <div className='relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 overflow-hidden'>
        <div className='absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl opacity-10 pointer-events-none'></div>

        <div className='relative z-10 flex justify-between items-center mb-6 sm:mb-8'>
          <h2 className='text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight'>
            My Profile
            <div className='p-2 bg-emerald-50 rounded-xl text-emerald-500 hidden sm:block'>
              <Settings size={24} strokeWidth={2.5} />
            </div>
          </h2>
          <button
            type='button'
            onClick={onClose}
            className='p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors'
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className='relative z-10 mb-6 p-4 bg-rose-50 text-rose-600 text-xs font-bold rounded-2xl border border-rose-100 flex items-center gap-2'>
            <div className='w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0'></div>
            {error}
          </div>
        )}

        {success && (
          <div className='relative z-10 mb-6 p-4 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-2xl border border-emerald-100 flex items-center gap-2'>
            <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0'></div>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className='relative z-10 space-y-4 sm:space-y-5'>
          
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center text-slate-300 shrink-0">
                 {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                    <User size={40} />
                 )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white cursor-pointer shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:-translate-y-1 transition-all">
                <Camera size={18} />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>
          </div>

          <div>
            <label className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1'>
              Full Name
            </label>
            <div className='relative'>
              <User
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                size={18}
              />
              <input
                required
                className='w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all text-sm font-medium'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1'>
              Email Address
            </label>
            <div className='relative'>
              <Mail
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                size={18}
              />
              <input
                type='email'
                required
                className='w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all text-sm font-medium'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1'>
              New Password{" "}
              <span className='text-slate-300 font-bold ml-1'>(Optional)</span>
            </label>
            <div className='relative'>
              <Lock
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                size={18}
              />
              <input
                type='password'
                className='w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all text-sm font-medium tracking-widest'
                placeholder='Leave blank to keep current'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-linear-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:hover:scale-100'
          >
            {isSubmitting ? (
              <Loader2 className='animate-spin' size={20} />
            ) : (
              "Save Settings"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
