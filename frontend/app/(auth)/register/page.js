"use client";
import { useState } from "react";
import {
  Layers,
  Mail,
  Lock,
  User,
  Building,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = "/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
    company: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await axios.post(`${API_URL}/auth/register`, formData);
      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen grid lg:grid-cols-2 bg-white'>
      <div className='hidden lg:flex flex-col justify-center p-12 bg-indigo-600 relative overflow-hidden'>
        <div className='relative z-10 max-w-md text-white'>
          <div className='w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center mb-8'>
            <Layers size={28} />
          </div>
          <h1 className='text-5xl font-black tracking-tighter mb-6'>
            Join the Network.
          </h1>
          <p className='text-indigo-100 text-lg'>
            Experience professional project management and seamless
            collaboration.
          </p>
        </div>
      </div>

      {/* Adjusted padding from px-8 to px-6 */}
      <div className='flex flex-col justify-center px-6 sm:px-16 lg:px-24 py-12'>
        <div className='max-w-sm w-full mx-auto'>
          <h2 className='text-3xl font-black text-slate-900 mb-2'>
            Client Registration
          </h2>
          <p className='text-slate-500 mb-8 font-medium'>
            Sign up to request services and track projects.
          </p>

          {error && (
            <div className='mb-6 p-4 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-100'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2'>
                Full Name
              </label>
              <div className='relative'>
                <User
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                  size={18}
                />
                <input
                  required
                  className='w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all'
                  placeholder='John Doe'
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2'>
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
                  className='w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all'
                  placeholder='john@company.com'
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2'>
                Company Name
              </label>
              <div className='relative'>
                <Building
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                  size={18}
                />
                <input
                  required
                  className='w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all'
                  placeholder='Acme Corp'
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2'>
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
                  className='w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all'
                  placeholder='••••••••'
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className='w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-4 shadow-xl shadow-indigo-100'
            >
              {isSubmitting ? (
                <Loader2 className='animate-spin' size={20} />
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className='mt-8 text-center text-sm text-slate-500 font-medium'>
            Already have an account?{" "}
            <Link
              href='/login'
              className='text-indigo-600 font-bold hover:underline'
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
