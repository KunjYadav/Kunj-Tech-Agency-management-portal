/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Layers, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Authentication failed. Please check your credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen grid lg:grid-cols-2 bg-white'>
      {/* LEFT SIDE: BRANDING & VISUALS */}
      <div className='hidden lg:flex flex-col justify-center p-12 bg-indigo-600 relative overflow-hidden'>
        <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent)]'></div>

        <div className='relative z-10 max-w-md'>
          <div className='w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center mb-8'>
            <Layers className='text-white' size={28} />
          </div>
          <h1 className='text-5xl font-black text-white tracking-tighter mb-6 leading-tight'>
            Manage your projects with precision.
          </h1>
          <p className='text-indigo-100 text-lg'>
            The all-in-one portal for Kunj Tech Agency. Track development,
            approve requests, and communicate with your team in real-time.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      {/* Adjusted padding from px-8 to px-6 */}
      <div className='flex flex-col justify-center px-6 sm:px-16 lg:px-24 py-12'>
        <div className='max-w-sm w-full mx-auto'>
          <div className='mb-10 text-center lg:text-left'>
            <h2 className='text-3xl font-black text-slate-900 tracking-tight'>
              Welcome back
            </h2>
            <p className='text-slate-500 mt-2 font-medium'>
              Please enter your workspace details.
            </p>
          </div>

          {error && (
            <div className='mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium rounded-xl flex items-center gap-3'>
              <div className='w-1.5 h-1.5 rounded-full bg-rose-500'></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1'>
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
                  className='w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-medium text-slate-900'
                  placeholder='name@company.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1'>
                Password
              </label>
              <div className='relative'>
                <Lock
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                  size={18}
                />
                <input
                  type='password'
                  required
                  className='w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-medium text-slate-900'
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className='w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <Loader2 className='animate-spin' size={20} />
              ) : (
                <>
                  Sign In to Workspace
                  <ArrowRight
                    size={18}
                    className='group-hover:translate-x-1 transition-transform'
                  />
                </>
              )}
            </button>
          </form>

          <p className='mt-8 text-center text-sm text-slate-500 font-medium'>
            Don't have an account?{" "}
            <Link
              href='/register'
              className='text-indigo-600 font-bold hover:underline'
            >
              Contact Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
