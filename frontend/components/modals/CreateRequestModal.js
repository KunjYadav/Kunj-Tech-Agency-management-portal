"use client";
import { useState } from "react";
import axios from "axios";
import { X, Send, Loader2, Sparkles } from "lucide-react";

const API_URL = "/api";

export default function CreateRequestModal({ isOpen, onClose, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    serviceType: "Enterprise Web Apps",
    notes: "",
    budgetRange: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/requests`, formData);

      console.log("Success:", response.data);
      setFormData({
        serviceType: "Enterprise Web Apps",
        notes: "",
        budgetRange: "",
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Axios Error:", err.response || err);
      setError(
        err.response?.data?.message ||
          "Connection failed. Is the server running?",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'>
      {/* Adjusted padding p-8 to p-6 sm:p-8 */}
      <div className='relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-6 sm:p-8'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-black text-slate-900 flex items-center gap-2'>
            New Request <Sparkles className='text-indigo-500' size={20} />
          </h2>
          <button
            type='button'
            onClick={onClose}
            className='p-2 hover:bg-slate-100 rounded-full'
          >
            <X size={20} className='text-slate-400' />
          </button>
        </div>

        {error && (
          <div className='mb-6 p-4 bg-rose-50 text-rose-600 text-xs font-bold rounded-2xl border border-rose-100'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-5'>
          <div>
            <label className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>
              Service
            </label>
            <select
              className='w-full px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold'
              value={formData.serviceType}
              onChange={(e) =>
                setFormData({ ...formData, serviceType: e.target.value })
              }
            >
              <option value='Enterprise Web Apps'>Enterprise Web Apps</option>
              <option value='Design Systems'>Design Systems</option>
              <option value='Mobile Excellence'>Mobile Excellence</option>
              <option value='Cloud Migration'>Cloud Migration</option>
            </select>
          </div>

          <div>
            <label className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>
              Budget
            </label>
            <input
              type='text'
              required
              placeholder='e.g. ₹10k'
              className='w-full px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-2xl'
              value={formData.budgetRange}
              onChange={(e) =>
                setFormData({ ...formData, budgetRange: e.target.value })
              }
            />
          </div>

          <div>
            <label className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>
              Notes
            </label>
            <textarea
              required
              rows='3'
              className='w-full px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none'
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2'
          >
            {isSubmitting ? (
              <Loader2 className='animate-spin' />
            ) : (
              <>
                Send Request <Send size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}