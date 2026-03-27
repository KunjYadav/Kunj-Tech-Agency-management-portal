/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  Clock,
  ArrowRight,
  Loader2,
  ListFilter,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const API_URL = "/api";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const { user } = useAuth();

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/requests`);
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const handleApprove = async (id) => {
    if (!confirm("Convert this request into an active project?")) return;

    setProcessingId(id);
    try {
      await axios.post(`${API_URL}/projects/approve/${id}`, {});

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "approved" } : req
        )
      );

      alert("Project initialized successfully!");
    } catch (err) {
      console.error("Approval Error:", err.response?.data);
      alert(
        err.response?.data?.message ||
          "Approval failed. Check console for details."
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading)
    return (
      <ProtectedRoute>
        <div className='space-y-8'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse'>
            <div>
              <div className="h-10 w-56 bg-slate-200 rounded-xl mb-3"></div>
              <div className="h-4 w-80 bg-slate-100 rounded-lg"></div>
            </div>
            <div className="h-12 w-40 bg-slate-200 rounded-2xl"></div>
          </div>

          <div className='bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden animate-pulse'>
            <div className='p-6 border-b border-slate-100 bg-slate-50'>
               <div className="flex justify-between">
                  <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
                  <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
                  <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
               </div>
            </div>
            <div className="divide-y divide-slate-100">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="p-6 flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-40 bg-slate-200 rounded-lg"></div>
                    <div className="h-4 w-64 bg-slate-100 rounded-lg"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-slate-200 rounded-lg"></div>
                      <div className="h-3 w-16 bg-slate-100 rounded-lg"></div>
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      <div className='space-y-8'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-4xl font-black text-slate-900 tracking-tight uppercase'>
              {user.role === "admin" ? "Launch Queue" : "Service Requests"}
            </h1>
            <p className='text-slate-500 font-medium mt-1'>
              {user.role === "admin"
                ? "Review and initialize new client project requirements."
                : "Track the status of your submitted service requests."}
            </p>
          </div>
        </div>

        <div className='bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden'>
          <div className='overflow-x-auto pb-2'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-slate-50 border-b border-slate-200'>
                  <th className='px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap min-w-62.5'>
                    Service Details
                  </th>
                  <th className='px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap min-w-45'>
                    Client
                  </th>
                  <th className='hidden md:table-cell px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap'>
                    Budget
                  </th>
                  <th className='px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap'>
                    Status
                  </th>
                  <th className='px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {requests.map((req) => (
                  <tr
                    key={req._id}
                    className='group hover:bg-slate-50/50 transition-colors'
                  >
                    <td className='px-6 py-5 align-middle'>
                      <div className='flex flex-col'>
                        <span className='font-black text-slate-900 text-base'>
                          {req.serviceType}
                        </span>
                        <span className='text-xs text-slate-500 italic line-clamp-2 max-w-sm mt-0.5'>
                          "{req.notes}"
                        </span>
                        <span className='text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2'>
                          ID: {req._id.slice(-6)}
                        </span>
                      </div>
                    </td>

                    <td className='px-6 py-5 align-middle'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-[10px] shrink-0'>
                          {req.client?.name?.charAt(0) || "U"}
                        </div>
                        <div className='flex flex-col min-w-30'>
                          <span className='text-sm font-bold text-slate-700 truncate'>
                            {req.client?.name || "Unknown"}
                          </span>
                          <span className='text-[10px] text-slate-400 font-medium truncate'>
                            {req.client?.company || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className='hidden md:table-cell px-6 py-5 align-middle'>
                      <span className='text-sm font-bold text-slate-700 whitespace-nowrap'>
                        {req.budgetRange || "TBD"}
                      </span>
                    </td>

                    <td className='px-6 py-5 align-middle'>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                          req.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : req.status === "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td className='px-6 py-5 align-middle text-right'>
                      <div className='flex items-center justify-end'>
                        {user.role === "admin" && req.status === "pending" ? (
                          <button
                            disabled={processingId === req._id}
                            onClick={() => handleApprove(req._id)}
                            className='bg-slate-900 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-md disabled:opacity-50 whitespace-nowrap shrink-0'
                          >
                            {processingId === req._id ? (
                              <Loader2 className='animate-spin' size={14} />
                            ) : (
                              <>
                                Approve <ArrowRight size={14} />
                              </>
                            )}
                          </button>
                        ) : req.status === "approved" ? (
                          <div className='inline-flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-3 py-2 rounded-lg whitespace-nowrap'>
                            <CheckCircle size={14} /> Live
                          </div>
                        ) : (
                          <div className='inline-flex items-center gap-1.5 text-slate-400 font-black text-[10px] uppercase tracking-widest whitespace-nowrap'>
                            <Clock size={14} /> Reviewing
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {requests.length === 0 && (
              <div className='py-20 text-center bg-white border-t border-slate-100'>
                <ListFilter className='mx-auto text-slate-300 mb-4' size={48} />
                <p className='text-slate-500 font-bold'>
                  No requests found in the queue.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}