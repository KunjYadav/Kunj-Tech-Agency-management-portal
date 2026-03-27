/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState, use } from "react";
import axios from "axios";
import { ArrowLeft, Layout, Loader2, Target, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MessageCenter from "@/components/projects/MessageCenter";
import ProjectFiles from "@/components/projects/ProjectFiles";

const API_URL = "/api";

export default function ProjectDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newProgress, setNewProgress] = useState(0);

  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [assigning, setAssigning] = useState(false);

  const fetchProject = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/projects/${params.id}`);
      setProject(data);
      setNewProgress(data.progress);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Project not found or access denied.");
      router.push("/projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProject();
  }, [user, params.id]);

  useEffect(() => {
    if (user?.role === "admin") {
      axios
        .get(`${API_URL}/auth/users`)
        .then(({ data }) => {
          setAvailableEmployees(data.filter((u) => u.role === "employee"));
        })
        .catch((err) => console.error("Failed to fetch users", err));
    }
  }, [user]);

  const handleUpdateProgress = async () => {
    setUpdating(true);
    try {
      await axios.patch(`${API_URL}/projects/${params.id}`, {
        progress: newProgress,
      });
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmployee) return;
    setAssigning(true);
    try {
      await axios.patch(`${API_URL}/projects/${params.id}/assign`, {
        employeeId: selectedEmployee,
      });
      fetchProject();
      setSelectedEmployee("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign employee");
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassignEmployee = async (employeeId) => {
    if (!confirm("Remove this operative from the project?")) return;
    try {
      await axios.patch(`${API_URL}/projects/${params.id}/unassign`, {
        employeeId,
      });
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unassign employee");
    }
  };

  if (loading)
    return (
      <ProtectedRoute>
        <div className='max-w-5xl mx-auto space-y-8 animate-pulse'>
          <div className='h-6 w-32 bg-slate-200 rounded-md'></div>

          <div className='flex justify-between items-center gap-6'>
            <div>
              <div className='h-4 w-40 bg-slate-200 rounded-full mb-4'></div>
              <div className='h-12 w-80 bg-slate-200 rounded-2xl'></div>
            </div>
            <div className='w-40 h-24 bg-slate-200 rounded-3xl'></div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2 space-y-8'>
              <div className='h-40 bg-slate-200 rounded-[2.5rem]'></div>
              <div className='h-64 bg-slate-200 rounded-[2.5rem]'></div>
              <div className='h-32 bg-slate-200 rounded-[2.5rem]'></div>
              <div className='h-96 bg-slate-200 rounded-[2.5rem]'></div>
            </div>
            <div className='lg:col-span-1 space-y-6'>
              <div className='h-125 bg-slate-200 rounded-[2.5rem]'></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      <div className='max-w-5xl mx-auto space-y-8'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors'
        >
          <ArrowLeft size={20} /> BACK TO FLEET
        </button>

        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
          <div>
            <div className='flex items-center gap-3 mb-2'>
              <span className='bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter'>
                {project.status}
              </span>
              <span className='text-slate-400 text-[10px] font-black tracking-widest uppercase'>
                ID: {project._id.slice(-8)}
              </span>
            </div>
            {/* Adjusted Title size for Mobile */}
            <h1 className='text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase'>
              {project.name}
            </h1>
          </div>

          <div className='bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4'>
            <div className='text-right'>
              <p className='text-[10px] font-black text-slate-400 uppercase'>
                Completion
              </p>
              <p className='text-2xl font-black text-slate-900'>
                {project.progress}%
              </p>
            </div>
            <div className='w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white'>
              <Target size={32} />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-8'>
            <div className='bg-white border border-slate-200 rounded-[2.5rem] p-6 sm:p-8 shadow-sm'>
              <h3 className='text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2'>
                <Layout size={16} /> Mission Briefing
              </h3>
              <p className='text-slate-600 leading-relaxed text-lg italic'>
                "{project.description || "No additional description provided."}"
              </p>
            </div>

            <ProjectFiles
              projectId={project._id}
              initialFiles={project.attachments}
              onUploadSuccess={(updatedProject) => setProject(updatedProject)}
            />

            {(user.role === "admin" || user.role === "employee") && (
              <div className='bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-6 sm:p-8'>
                <h3 className='text-xs font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2'>
                  <TrendingUp size={16} /> Update Progress
                </h3>
                <div className='flex flex-col md:flex-row items-center gap-6'>
                  <input
                    type='range'
                    min='0'
                    max='100'
                    value={newProgress}
                    onChange={(e) => setNewProgress(e.target.value)}
                    className='w-full h-3 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600'
                  />
                  <div className='flex items-center justify-between w-full md:w-auto gap-4 min-w-45'>
                    <span className='font-black text-2xl text-indigo-900'>
                      {newProgress}%
                    </span>
                    <button
                      onClick={handleUpdateProgress}
                      disabled={updating}
                      className='bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shrink-0'
                    >
                      {updating ? (
                        <Loader2 className='animate-spin' size={16} />
                      ) : (
                        "Sync"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <MessageCenter projectId={project._id} currentUser={user} />
          </div>

          <div className='lg:col-span-1 space-y-6'>
            <div className='bg-slate-900 text-white rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-xl'>
              <div>
                <span className='text-[10px] font-black text-slate-400 uppercase block mb-2'>
                  Stakeholder
                </span>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-black'>
                    {project.client?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className='font-bold leading-none'>
                      {project.client?.name}
                    </p>
                    <p className='text-[10px] text-slate-400'>
                      {project.client?.company}
                    </p>
                  </div>
                </div>
              </div>

              <div className='pt-6 border-t border-slate-800'>
                <span className='text-[10px] font-black text-slate-400 uppercase block mb-4'>
                  Deployed Team
                </span>
                <div className='space-y-3'>
                  {project.assignedEmployees?.map((emp) => (
                    <div
                      key={emp._id}
                      className='flex items-center justify-between gap-3'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-[10px] font-bold text-white'>
                          {emp.name.charAt(0)}
                        </div>
                        <span className='text-sm font-medium text-slate-300'>
                          {emp.name}
                        </span>
                      </div>

                      {user?.role === "admin" && (
                        <button
                          onClick={() => handleUnassignEmployee(emp._id)}
                          className='text-[10px] text-rose-500 hover:text-rose-400 font-bold uppercase tracking-widest transition-colors'
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  {project.assignedEmployees?.length === 0 && (
                    <p className='text-xs text-slate-500 italic'>
                      No operatives assigned yet.
                    </p>
                  )}
                </div>

                {user?.role === "admin" && (
                  <div className='mt-6 flex flex-col gap-2'>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className='w-full bg-slate-800 text-slate-300 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500'
                    >
                      <option value=''>+ Select Operative</option>
                      {availableEmployees
                        .filter(
                          (emp) =>
                            !project.assignedEmployees.find(
                              (e) => e._id === emp._id,
                            ),
                        )
                        .map((emp) => (
                          <option key={emp._id} value={emp._id}>
                            {emp.name}
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={handleAssignEmployee}
                      disabled={!selectedEmployee || assigning}
                      className='w-full bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-500 disabled:opacity-50 transition-all'
                    >
                      {assigning ? "Assigning..." : "Assign to Project"}
                    </button>
                  </div>
                )}
              </div>

              <div className='pt-6 border-t border-slate-800 space-y-4'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='text-slate-400 uppercase font-black'>
                    Started
                  </span>
                  <span className='font-bold text-slate-300'>
                    {new Date(project.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className='flex items-center justify-between text-xs'>
                  <span className='text-slate-400 uppercase font-black'>
                    Budget
                  </span>
                  <span className='font-bold text-indigo-400'>
                    {project.budget || "TBD"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
