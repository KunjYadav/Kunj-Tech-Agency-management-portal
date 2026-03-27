/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import { Bell, Package, CheckCheck, Loader2 } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const API_URL = "/api";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || undefined;

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/notifications`);
        setNotifications(data);
      } catch (err) {
        console.error("Notification Fetch Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || undefined, {
      withCredentials: true,
    });

    socket.on("new_notification", (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const markRead = async (id, link) => {
    try {
      await axios.patch(`${API_URL}/notifications/${id}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setIsOpen(false);

      if (link) {
        router.push(link);
      }
    } catch (err) {
      console.error("Error marking read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(`${API_URL}/notifications/read-all`, {});
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking all read", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all'
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className='absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 border-2 border-white rounded-full text-[8px] font-black text-white flex items-center justify-center animate-in zoom-in duration-300'>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-4 w-80 bg-white rounded-3xl border border-slate-200 shadow-2xl z-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
          <div className='p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50'>
            <h3 className='font-black text-slate-900 text-sm'>Notifications</h3>
            <div className='flex items-center gap-3'>
              {loading && (
                <Loader2 size={14} className='animate-spin text-slate-300' />
              )}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className='text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1'
                >
                  <CheckCheck size={12} /> Read All
                </button>
              )}
            </div>
          </div>

          <div className='max-h-96 overflow-y-auto'>
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => markRead(n._id, n.link)}
                  className={`p-4 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${!n.isRead ? "bg-indigo-50/30" : ""}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${!n.isRead ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}
                  >
                    <Package size={18} />
                  </div>
                  <div className='flex-1'>
                    <p
                      className={`text-xs leading-snug ${n.isRead ? "text-slate-500" : "text-slate-900 font-bold"}`}
                    >
                      {n.content}
                    </p>
                    <p className='text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-widest'>
                      {new Date(n.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!n.isRead && (
                    <div className='w-2 h-2 bg-indigo-500 rounded-full mt-2'></div>
                  )}
                </div>
              ))
            ) : (
              <div className='p-10 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest'>
                Workspace is quiet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
