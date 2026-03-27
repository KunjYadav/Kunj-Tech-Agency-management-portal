/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Send, Loader2 } from "lucide-react";

const API_URL = "/api";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || undefined;

export default function MessageCenter({ projectId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || undefined, {
      withCredentials: true,
    });
    setSocketInstance(socket);

    socket.on("connect", () => {
      socket.emit("join_project", projectId);
    });

    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/messages/${projectId}`);
        setMessages(data);
      } catch (err) {
        console.error("Failed to load secure comms history");
      }
    };
    fetchHistory();

    socket.on("receive_message", (data) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === data._id)) return prev;
        return [...prev, data];
      });
    });

    socket.on("error", (err) => {
      console.error("Socket Error:", err.message || err);
    });

    return () => {
      socket.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await axios.post(`${API_URL}/messages`, {
        projectId,
        content: newMessage,
      });
      setNewMessage("");
    } catch (err) {
      alert(err.response?.data?.message || "Comms failure");
    } finally {
      setSending(false);
    }
  };

  return (
    // Changed h-125 to responsive h-[60vh] md:h-125
    <div className='bg-white border border-slate-200 rounded-[2.5rem] flex flex-col h-[60vh] md:h-125 shadow-sm overflow-hidden'>
      <div className='p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center'>
        <h3 className='text-xs font-black text-slate-400 uppercase tracking-widest'>
          ● Live Secure Channel
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex flex-col ${msg.sender._id === currentUser._id ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${
                msg.sender._id === currentUser._id
                  ? "bg-slate-900 text-white rounded-tr-none"
                  : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
              }`}
            >
              <p className='font-black text-[9px] uppercase tracking-widest mb-1 opacity-60'>
                {msg.sender.name}
              </p>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form
        onSubmit={handleSend}
        className='p-3 sm:p-4 bg-white border-t border-slate-100 flex gap-2'
      >
        <input
          type='text'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder='Broadcast...'
          className='flex-1 bg-slate-50 border-none rounded-2xl px-4 py-3 sm:py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium'
        />
        <button
          disabled={sending}
          className='bg-indigo-600 text-white px-5 sm:px-6 rounded-2xl hover:bg-slate-900 transition-all shadow-lg disabled:opacity-50 shrink-0'
        >
          {sending ? (
            <Loader2 className='animate-spin' size={20} />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
}
