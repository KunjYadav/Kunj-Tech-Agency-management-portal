/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import StatsGrid from "@/components/dashboard/StatsGrid";
import ProjectTable from "@/components/dashboard/ProjectTable";
import CreateRequestModal from "@/components/modals/CreateRequestModal";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [greeting, setGreeting] = useState("Welcome");
  const [todayDate, setTodayDate] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    // Determine greeting based on local time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Format today's date using the requested format
    setTodayDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    );
  }, []);

  const handleRequestSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className='space-y-10'>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div>
          <p className='text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-2'>
            {todayDate}
          </p>
          <h1 className='text-4xl lg:text-5xl font-black text-slate-900 tracking-tight'>
            {greeting},{" "}
            <span className='bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-cyan-500'>
              {user?.name?.split(" ")[0]}
            </span>
          </h1>
          <p className='text-slate-500 font-medium mt-2'>
            Here is what's happening in your workspace today.
          </p>
        </div>
      </div>

      <StatsGrid key={`stats-${refreshKey}`} />

      <div className='grid lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm'>
          <ProjectTable key={`table-${refreshKey}`} />
        </div>

        <div className='space-y-6'>
          {/* Upgraded Premium Assistance Card */}
          <div className='bg-linear-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden group'>
            {/* Animated Glow Element */}
            <div className='absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 blur-3xl rounded-full group-hover:bg-cyan-400 transition-colors duration-700'></div>

            <div className='relative z-10'>
              <h3 className='text-xl font-black mb-2'>Need Assistance?</h3>
              <p className='text-slate-400 text-sm mb-8 font-medium leading-relaxed'>
                Open a new service request and our engineering team will get
                back to you immediately.
              </p>
              <button
                type='button'
                onClick={() => setIsModalOpen(true)}
                className='w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] hover:shadow-xl active:scale-95 transition-all duration-200'
              >
                Create Request
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreateRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRequestSuccess}
      />
    </div>
  );
}
