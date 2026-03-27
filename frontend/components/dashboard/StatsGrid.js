"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_URL = "/api";

const StatCard = ({ title, value, icon: Icon, gradientClass, shadowClass }) => (
  <div className='group bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 relative overflow-hidden'>
    <div
      className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 ${gradientClass}`}
    ></div>

    <div className='flex items-center justify-between mb-4 relative z-10'>
      <div
        className={`p-3.5 rounded-2xl text-white ${gradientClass} ${shadowClass}`}
      >
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <span className='text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-indigo-400 transition-colors'>
        Live
      </span>
    </div>
    <div className='relative z-10'>
      <h3 className='text-slate-500 font-bold text-sm'>{title}</h3>
      <p className='text-4xl font-black text-slate-900 mt-1 tracking-tight'>
        {value ?? 0}
      </p>
    </div>
  </div>
);

export default function StatsGrid() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/dashboard/stats`);
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='h-36 bg-slate-50 rounded-4xl animate-pulse border border-slate-100'
          ></div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {user.role === "admin" && (
        <>
          <StatCard
            title='Total Projects'
            value={stats.projectCount}
            icon={Briefcase}
            gradientClass='bg-gradient-to-br from-indigo-500 to-indigo-600'
            shadowClass='shadow-lg shadow-indigo-200'
          />
          <StatCard
            title='Total Users'
            value={stats.userCount}
            icon={Users}
            gradientClass='bg-gradient-to-br from-cyan-400 to-blue-500'
            shadowClass='shadow-lg shadow-cyan-200'
          />
          <StatCard
            title='Pending Requests'
            value={stats.pendingRequests}
            icon={Clock}
            gradientClass='bg-gradient-to-br from-violet-500 to-fuchsia-500'
            shadowClass='shadow-lg shadow-violet-200'
          />
          <StatCard
            title='Active Employees'
            value={stats.activeEmployees}
            icon={BarChart3}
            gradientClass='bg-gradient-to-br from-emerald-400 to-teal-500'
            shadowClass='shadow-lg shadow-emerald-200'
          />
        </>
      )}

      {user.role === "employee" && (
        <>
          <StatCard
            title='Assigned Projects'
            value={stats.activeProjects}
            icon={Briefcase}
            gradientClass='bg-gradient-to-br from-indigo-500 to-blue-600'
            shadowClass='shadow-lg shadow-indigo-200'
          />
          <StatCard
            title='Completed Tasks'
            value={stats.completedProjects}
            icon={CheckCircle2}
            gradientClass='bg-gradient-to-br from-emerald-400 to-teal-500'
            shadowClass='shadow-lg shadow-emerald-200'
          />
          <StatCard
            title='Success Rate'
            value='100%'
            icon={BarChart3}
            gradientClass='bg-gradient-to-br from-violet-500 to-fuchsia-500'
            shadowClass='shadow-lg shadow-violet-200'
          />
        </>
      )}

      {user.role === "client" && (
        <>
          <StatCard
            title='My Requests'
            value={stats.totalRequests}
            icon={AlertCircle}
            gradientClass='bg-gradient-to-br from-amber-400 to-orange-500'
            shadowClass='shadow-lg shadow-orange-200'
          />
          <StatCard
            title='Active Projects'
            value={stats.activeProjects}
            icon={BarChart3}
            gradientClass='bg-gradient-to-br from-indigo-500 to-blue-600'
            shadowClass='shadow-lg shadow-indigo-200'
          />
          <StatCard
            title='Archived'
            value='0'
            icon={CheckCircle2}
            gradientClass='bg-gradient-to-br from-slate-400 to-slate-500'
            shadowClass='shadow-lg shadow-slate-200'
          />
        </>
      )}
    </div>
  );
}
