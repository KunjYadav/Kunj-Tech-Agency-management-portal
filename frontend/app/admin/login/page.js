/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, Lock, Mail, Loader2, Key } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser.role === "admin") {
        router.push("/dashboard");
      } else {
        setError("Access Denied: Admin credentials required.");
      }
    } catch (err) {
      setError("Invalid credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-xl border border-slate-100'>
          <div className='flex justify-center mb-8'>
            <div className='w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg'>
              <Key size={28} />
            </div>
          </div>

          <div className='text-center mb-10'>
            <h2 className='text-2xl font-black text-slate-900 tracking-tight'>
              Admin Gateway
            </h2>
            <p className='text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest'>
              Secure Entry Point
            </p>
          </div>

          {error && (
            <div className='mb-6 p-4 bg-rose-50 text-rose-600 text-xs font-bold rounded-2xl border border-rose-100 flex items-center gap-2'>
              <ShieldAlert size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='relative'>
              <Mail
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                size={18}
              />
              <input
                type='email'
                required
                placeholder='Admin Email'
                className='w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-slate-900'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='relative'>
              <Lock
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                size={18}
              />
              <input
                type='password'
                required
                placeholder='Password'
                className='w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-slate-900'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isSubmitting}
              className='w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg'
            >
              {isSubmitting ? (
                <Loader2 className='animate-spin' />
              ) : (
                "Authorize Access"
              )}
            </button>
          </form>
        </div>

        <p className='text-center mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest'>
          Portal v1.0 • Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
