"use client";
import { useState } from "react";
import axios from "axios";
import {
  X,
  UserPlus,
  Loader2,
  Mail,
  Lock,
  User,
  Briefcase,
} from "lucide-react";

const API_URL = "/api";

export default function AddUserModal({ isOpen, onClose, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    company: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await axios.post(`${API_URL}/auth/register`, formData);

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "employee",
        company: "",
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'>
      {/* Adjusted padding p-8 to p-6 sm:p-8 */}
      <div className='relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 overflow-hidden'>
        <div className='absolute -top-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-10 pointer-events-none'></div>

        <div className='relative z-10 flex justify-between items-center mb-6 sm:mb-8'>
          <h2 className='text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight'>
            Provision User
            <div className='p-2 bg-indigo-50 rounded-xl text-indigo-500 hidden sm:block'>
              <UserPlus size={24} strokeWidth={2.5} />
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

        <form
          onSubmit={handleSubmit}
          className='relative z-10 space-y-4 sm:space-y-5'
        >
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
                className='w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all text-sm font-medium'
                placeholder='Jane Doe'
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
                className='w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all text-sm font-medium'
                placeholder='jane@company.com'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Adjusted to grid-cols-1 sm:grid-cols-2 */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1'>
                Role
              </label>
              <select
                className='w-full px-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all appearance-none cursor-pointer'
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value='employee'>Employee</option>
                <option value='client'>Client</option>
                <option value='admin'>Admin</option>
              </select>
            </div>
            <div>
              <label className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1'>
                Company / Title
              </label>
              <div className='relative'>
                <Briefcase
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
                  size={18}
                />
                <input
                  className='w-full pl-10 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all text-sm font-medium'
                  placeholder='Acme Corp'
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <label className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1'>
              Temporary Password
            </label>
            <div className='relative'>
              <Lock
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                size={18}
              />
              <input
                type='password'
                required
                className='w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all text-sm font-medium tracking-widest'
                placeholder='••••••••'
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
            className='w-full bg-linear-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:hover:scale-100'
          >
            {isSubmitting ? (
              <Loader2 className='animate-spin' size={20} />
            ) : (
              <>
                Create Operative <UserPlus size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
