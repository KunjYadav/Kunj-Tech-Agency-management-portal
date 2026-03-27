"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Send,
  CheckCircle2,
  Globe,
  Layers,
  Smartphone,
  Cloud,
  Loader2,
} from "lucide-react";

const API_URL = "/api";

export default function NewRequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: "Enterprise Web Apps",
    notes: "",
    budgetRange: "₹10k - ₹25k",
  });

  const services = [
    { name: "Enterprise Web Apps", icon: Globe },
    { name: "Design Systems", icon: Layers },
    { name: "Mobile Excellence", icon: Smartphone },
    { name: "Cloud Migration", icon: Cloud },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/requests`, formData);
      setSuccess(true);
      setTimeout(() => router.push("/requests"), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className='h-[70vh] flex flex-col items-center justify-center text-center animate-in zoom-in duration-300'>
        <div className='w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-100'>
          <CheckCircle2 size={40} />
        </div>
        <h2 className='text-3xl font-black text-slate-900 mb-2'>
          Request Received!
        </h2>
        <p className='text-slate-500 font-medium'>
          Our team will review your proposal and get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-black text-slate-900 tracking-tight'>
          Request New Service
        </h1>
        <p className='text-slate-500 font-medium'>
          Pitch your project to the Kunj Tech Agency development team.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {services.map((s) => (
            <div
              key={s.name}
              onClick={() => setFormData({ ...formData, serviceType: s.name })}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                formData.serviceType === s.name
                  ? "border-indigo-600 bg-indigo-50/50"
                  : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${formData.serviceType === s.name ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}
              >
                <s.icon size={20} />
              </div>
              <span
                className={`font-bold text-sm ${formData.serviceType === s.name ? "text-indigo-900" : "text-slate-600"}`}
              >
                {s.name}
              </span>
            </div>
          ))}
        </div>

        <div className='space-y-2'>
          <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>
            Project Details
          </label>
          <textarea
            required
            rows={5}
            className='w-full p-6 bg-white border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-slate-700'
            placeholder='Tell us about your requirements, goals, and timeline...'
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
        </div>

        <div className='space-y-2'>
          <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>
            Estimated Budget Range
          </label>
          <select
            className='w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-700'
            value={formData.budgetRange}
            onChange={(e) =>
              setFormData({ ...formData, budgetRange: e.target.value })
            }
          >
            <option>₹5k - ₹10k</option>
            <option>₹10k - ₹25k</option>
            <option>₹25k - ₹50k</option>
            <option>₹50k+</option>
          </select>
        </div>

        <button
          disabled={isSubmitting}
          className='w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50'
        >
          {isSubmitting ? (
            <Loader2 className='animate-spin' size={24} />
          ) : (
            <>
              Submit Proposal
              <Send size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
