"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const API_URL = "/api";

const StatusBadge = ({ status }) => {
  const styles = {
    Planning: "bg-blue-50 text-blue-600",
    Development: "bg-indigo-50 text-indigo-600",
    Testing: "bg-amber-50 text-amber-600",
    Completed: "bg-emerald-50 text-emerald-600",
    "On Hold": "bg-rose-50 text-rose-600",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${styles[status] || "bg-slate-50 text-slate-500"}`}
    >
      {status}
    </span>
  );
};

export default function ProjectTable() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/projects`);
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProjects();
  }, [user]);

  if (loading)
    return (
      <div className='space-y-4 py-4'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='h-20 bg-slate-50 rounded-2xl animate-pulse border border-slate-100'
          />
        ))}
      </div>
    );

  return (
    <div className='overflow-x-auto pb-2'>
      <table className='w-full text-left border-separate border-spacing-y-3 min-w-150'>
        <thead>
          <tr className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>
            <th className='px-4 pb-2 whitespace-nowrap min-w-45'>
              Project Identity
            </th>
            <th className='px-4 pb-2 whitespace-nowrap min-w-37.5'>
              Stakeholder
            </th>
            <th className='hidden md:table-cell px-4 pb-2 whitespace-nowrap'>
              Completion
            </th>
            <th className='px-4 pb-2 whitespace-nowrap'>Status</th>
            <th className='px-4 pb-2 whitespace-nowrap text-right'>Access</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project._id}
              className='group bg-white hover:bg-slate-50/50 transition-all shadow-sm hover:shadow-md'
            >
              <td className='px-4 py-5 rounded-l-2xl border-y border-l border-slate-100 align-middle'>
                <div className='flex flex-col'>
                  <span className='font-black text-slate-900 text-sm truncate'>
                    {project.name}
                  </span>
                  <span className='text-[10px] font-bold text-slate-400 uppercase mt-0.5'>
                    ID: {project._id.substring(project._id.length - 6)}
                  </span>
                </div>
              </td>
              <td className='px-4 py-5 border-y border-slate-100 align-middle'>
                <div className='flex items-center gap-2'>
                  <div className='w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-[10px] shrink-0'>
                    {project.client?.name?.charAt(0) || "C"}
                  </div>
                  <div className='flex flex-col min-w-25'>
                    <span className='text-xs font-bold text-slate-700 truncate'>
                      {project.client?.name || "N/A"}
                    </span>
                    <span className='text-[9px] text-slate-400 font-medium truncate'>
                      {project.client?.company}
                    </span>
                  </div>
                </div>
              </td>
              <td className='hidden md:table-cell px-4 py-5 border-y border-slate-100 w-44 align-middle'>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between text-[10px] font-black text-slate-900'>
                    <span>{project.progress}%</span>
                  </div>
                  <div className='w-full h-1.5 bg-slate-100 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-indigo-500 rounded-full transition-all duration-700 ease-out'
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className='px-4 py-5 border-y border-slate-100 align-middle'>
                <div className='whitespace-nowrap'>
                  <StatusBadge status={project.status} />
                </div>
              </td>
              <td className='px-4 py-5 rounded-r-2xl border-y border-r border-slate-100 text-right align-middle'>
                <Link
                  href={`/projects/${project._id}`}
                  className='inline-flex p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm hover:shadow-indigo-100 shrink-0'
                >
                  <ExternalLink size={18} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {projects.length === 0 && (
        <div className='text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 mt-4'>
          <p className='text-slate-400 font-bold text-xs uppercase tracking-widest'>
            No active deployments found.
          </p>
        </div>
      )}
    </div>
  );
}
