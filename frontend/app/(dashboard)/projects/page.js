/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ExternalLink, Plus, Layers } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const API_URL = "/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  if (loading)
    return (
      <ProtectedRoute>
        <div className='space-y-10'>
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
            <div className='animate-pulse'>
              <div className='h-14 w-64 bg-slate-200 rounded-2xl mb-4'></div>
              <div className='h-5 w-96 bg-slate-100 rounded-lg'></div>
            </div>
            <div className='h-12 w-40 bg-slate-200 rounded-2xl animate-pulse'></div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className='bg-white border border-slate-100 p-6 sm:p-8 rounded-[3rem] min-h-80 animate-pulse flex flex-col justify-between'
              >
                <div>
                  <div className='h-6 w-24 bg-slate-200 rounded-full mb-6'></div>
                  <div className='h-8 w-3/4 bg-slate-200 rounded-xl mb-3'></div>
                  <div className='h-4 w-full bg-slate-100 rounded-lg mb-2'></div>
                  <div className='h-4 w-2/3 bg-slate-100 rounded-lg'></div>
                </div>
                <div className='space-y-4'>
                  <div className='h-2 w-full bg-slate-100 rounded-full mb-6'></div>
                  <div className='flex justify-between items-center pt-4 border-t border-slate-50'>
                    <div className='h-8 w-20 bg-slate-200 rounded-full'></div>
                    <div className='h-4 w-16 bg-slate-100 rounded-lg'></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      <div className='space-y-10'>
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
          <div>
            {/* Adjusted Title size for Mobile */}
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none'>
              The Fleet
            </h1>
            <p className='text-slate-500 font-medium mt-2 max-w-md'>
              {user.role === "admin"
                ? "Global overview of all active initiatives and deployments."
                : "Active projects currently assigned to your profile."}
            </p>
          </div>

          {(user.role === "client" || user.role === "admin") && (
            <Link
              href='/requests/new'
              className='bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-200 w-fit'
            >
              <Plus size={18} /> New Request
            </Link>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {projects.map((project) => (
            <Link
              href={`/projects/${project._id}`}
              key={project._id}
              className='group bg-white border border-slate-200 p-6 sm:p-8 rounded-[3rem] hover:border-indigo-500 transition-all hover:shadow-2xl hover:shadow-indigo-50/50 flex flex-col justify-between min-h-80'
            >
              <div>
                <div className='flex justify-between items-start mb-6'>
                  <div
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      project.status === "Completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {project.status}
                  </div>
                  <ExternalLink
                    size={20}
                    className='text-slate-300 group-hover:text-indigo-600 transition-colors'
                  />
                </div>

                <h3 className='text-2xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight uppercase'>
                  {project.name}
                </h3>
                <p className='text-slate-500 text-sm italic line-clamp-2 mb-6'>
                  "
                  {project.description ||
                    "In-depth development mission in progress..."}
                  "
                </p>
              </div>

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex justify-between items-end'>
                    <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                      Momentum
                    </span>
                    <span className='text-sm font-black text-slate-900'>
                      {project.progress}%
                    </span>
                  </div>
                  <div className='h-2 w-full bg-slate-100 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-slate-900 rounded-full transition-all duration-1000'
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className='flex items-center justify-between pt-4 border-t border-slate-50'>
                  <div className='flex -space-x-2'>
                    {project.assignedEmployees?.slice(0, 3).map((emp, i) => (
                      <div
                        key={i}
                        className='w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600'
                      >
                        {emp.name.charAt(0)}
                      </div>
                    ))}
                    {project.assignedEmployees?.length > 3 && (
                      <div className='w-8 h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white'>
                        +{project.assignedEmployees.length - 3}
                      </div>
                    )}
                  </div>
                  <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest truncate ml-2'>
                    {project.client?.company || "Internal"}
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {projects.length === 0 && (
            <div className='col-span-full py-32 text-center bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200'>
              <Layers className='mx-auto text-slate-300 mb-4' size={64} />
              <p className='text-slate-500 font-black text-xl uppercase tracking-tighter'>
                No active missions found.
              </p>
              <p className='text-slate-400 text-sm mt-1'>
                Check back later or initiate a new request.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
