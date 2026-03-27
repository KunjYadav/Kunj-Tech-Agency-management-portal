"use client";
import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = "/api";

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/auth/register`, formData);
      router.push("/admin/login");
    } catch (err) {
      setError(err.response?.data?.message || "Admin registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-md bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl'>
        <div className='text-center mb-10'>
          <div className='w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-200'>
            <ShieldCheck className='text-white' size={32} />
          </div>
          <h1 className='text-3xl font-black text-slate-900 tracking-tight'>
            System Root
          </h1>
          <p className='text-slate-500 font-medium mt-2'>
            Initialize Administrator Account
          </p>
        </div>

        {error && (
          <div className='mb-6 p-4 bg-rose-50 text-rose-600 text-xs font-bold rounded-2xl border border-rose-100'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1'>
            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>
              Full Name
            </label>
            <div className='relative'>
              <User
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                size={18}
              />
              <input
                required
                className='w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-rose-500 transition-all font-bold'
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className='space-y-1'>
            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>
              Admin Email
            </label>
            <div className='relative'>
              <Mail
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                size={18}
              />
              <input
                type='email'
                required
                className='w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-rose-500 transition-all font-bold'
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className='space-y-1'>
            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>
              Master Password
            </label>
            <div className='relative'>
              <Lock
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                size={18}
              />
              <input
                type='password'
                required
                className='w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-rose-500 transition-all font-bold'
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className='w-full bg-rose-600 text-white py-4 rounded-2xl font-black hover:bg-rose-700 transition-all flex items-center justify-center gap-2 mt-6 shadow-xl shadow-rose-100'
          >
            {isSubmitting ? (
              <Loader2 className='animate-spin' />
            ) : (
              <>
                Create Admin <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
