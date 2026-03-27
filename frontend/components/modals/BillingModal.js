/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { X, CreditCard, Trash2, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_URL = "/api";

export default function BillingModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    cardHolder: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
  });

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/billing`);
      setMethods(data);
    } catch (err) {
      console.error("Failed to fetch billing", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) fetchMethods();
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (formData.cardNumber.length < 15) {
      return setError("Invalid card number");
    }

    setAdding(true);
    setError("");

    try {
      await axios.post(`${API_URL}/billing`, formData);
      setFormData({
        cardHolder: "",
        cardNumber: "",
        expMonth: "",
        expYear: "",
      });
      fetchMethods();
    } catch (err) {
      setError("Failed to save card");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/billing/${id}`);
      setMethods(methods.filter((m) => m._id !== id));
    } catch (err) {
      alert("Could not remove card");
    }
  };

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'>
      {/* Adjusted padding p-8 to p-6 sm:p-8 */}
      <div className='relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 overflow-hidden'>
        <div className='absolute -top-10 -right-10 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-10 pointer-events-none'></div>

        <div className='relative z-10 flex justify-between items-center mb-6 sm:mb-8'>
          <h2 className='text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight'>
            Payment
            <div className='p-2 bg-blue-50 rounded-xl text-blue-500 hidden sm:block'>
              <CreditCard size={24} strokeWidth={2.5} />
            </div>
          </h2>
          <button
            onClick={onClose}
            className='p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors'
          >
            <X size={20} />
          </button>
        </div>

        <div className='relative z-10 mb-8 space-y-3'>
          <h3 className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1'>
            Active Methods
          </h3>

          {loading ? (
            <div className='flex justify-center p-4'>
              <Loader2 className='animate-spin text-blue-500' />
            </div>
          ) : methods.length > 0 ? (
            methods.map((m) => (
              <div
                key={m._id}
                className='group relative overflow-hidden flex items-center justify-between p-4 sm:p-5 border border-slate-100 rounded-3xl bg-slate-50 hover:border-blue-200 hover:shadow-md transition-all'
              >
                <div className='flex items-center gap-3 sm:gap-4 relative z-10'>
                  <div className='w-12 sm:w-14 h-9 sm:h-10 bg-linear-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] font-black uppercase tracking-wider shadow-inner border border-slate-700 shrink-0'>
                    {m.brand}
                  </div>
                  <div>
                    <p className='text-xs sm:text-sm font-black text-slate-900 tracking-widest'>
                      •••• {m.last4}
                    </p>
                    <p className='text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5'>
                      Expires {m.expMonth}/{m.expYear}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(m._id)}
                  className='relative z-10 p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors shrink-0'
                  title='Remove Card'
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className='p-6 border-2 border-dashed border-slate-100 rounded-3xl text-center bg-slate-50/50'>
              <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>
                No saved methods
              </p>
            </div>
          )}
        </div>

        <div className='relative z-10 pt-6 sm:pt-8 border-t border-slate-100'>
          <h3 className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1'>
            Add New Card
          </h3>

          {error && (
            <div className='mb-4 p-3 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl border border-rose-100 flex items-center gap-2'>
              <div className='w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0'></div>
              {error}
            </div>
          )}

          <form onSubmit={handleAddCard} className='space-y-4'>
            <input
              required
              placeholder='Cardholder Name'
              className='w-full px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 text-sm font-medium transition-all'
              value={formData.cardHolder}
              onChange={(e) =>
                setFormData({ ...formData, cardHolder: e.target.value })
              }
            />
            <input
              required
              maxLength='16'
              placeholder='Card Number'
              className='w-full px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 text-sm font-medium tracking-widest transition-all'
              value={formData.cardNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cardNumber: e.target.value.replace(/\D/g, ""),
                })
              }
            />
            <div className='grid grid-cols-2 gap-4'>
              <input
                required
                maxLength='2'
                placeholder='Month (MM)'
                className='w-full px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 text-sm font-medium text-center transition-all'
                value={formData.expMonth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expMonth: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
              <input
                required
                maxLength='2'
                placeholder='Year (YY)'
                className='w-full px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 text-sm font-medium text-center transition-all'
                value={formData.expYear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expYear: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
            </div>

            <button
              disabled={adding}
              className='w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-200 transition-all disabled:opacity-50 disabled:hover:scale-100 mt-2'
            >
              {adding ? (
                <Loader2 size={18} className='animate-spin' />
              ) : (
                <>
                  <Plus size={16} /> Save Card
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
