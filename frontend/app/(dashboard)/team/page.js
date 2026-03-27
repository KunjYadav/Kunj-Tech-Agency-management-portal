"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Trash2,
  Edit2,
  Mail,
  Briefcase,
  Building2,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AddUserModal from "@/components/modals/AddUserModal";
import EditUserModal from "@/components/modals/EditUserModal";

const API_URL = "/api";

export default function TeamPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/auth/users`);
      setUsers(data);
    } catch (err) {
      console.error("Error fetching team", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchUsers();
  }, [currentUser]);

  const handleDelete = async (id, name) => {
    if (
      !confirm(
        `Are you sure you want to offboard ${name}? This action is permanent.`,
      )
    )
      return;

    try {
      await axios.delete(`${API_URL}/auth/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Deletion failed");
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  if (loading)
    return (
      <ProtectedRoute>
        <div className='space-y-10'>
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
            <div className='animate-pulse'>
              <div className='h-12 w-64 bg-slate-200 rounded-2xl mb-4'></div>
              <div className='h-5 w-80 bg-slate-100 rounded-lg'></div>
            </div>
            <div className='flex gap-4 animate-pulse'>
              <div className='h-12 w-48 bg-slate-200 rounded-2xl'></div>
              <div className='h-12 w-32 bg-slate-200 rounded-2xl'></div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className='bg-white border border-slate-100 rounded-[2.5rem] p-6 h-64 animate-pulse flex flex-col justify-between'
              >
                <div className='flex justify-between items-start'>
                  <div className='w-16 h-16 rounded-[1.25rem] bg-slate-200'></div>
                  <div className='flex gap-2'>
                    <div className='w-9 h-9 bg-slate-100 rounded-xl'></div>
                    <div className='w-9 h-9 bg-slate-100 rounded-xl'></div>
                  </div>
                </div>
                <div className='space-y-3 mt-4'>
                  <div className='h-6 w-1/2 bg-slate-200 rounded-lg'></div>
                  <div className='h-4 w-1/4 bg-slate-100 rounded-full mb-4'></div>
                  <div className='h-4 w-3/4 bg-slate-100 rounded-lg'></div>
                  <div className='h-4 w-2/3 bg-slate-100 rounded-lg'></div>
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
            <h1 className='text-4xl lg:text-5xl font-black text-slate-900 tracking-tight uppercase'>
              Command{" "}
              <span className='bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-cyan-500'>
                Center
              </span>
            </h1>
            <p className='text-slate-500 font-medium mt-2'>
              Manage permissions and personnel across the organization.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row items-center gap-4'>
            <div className='bg-white border border-slate-100 shadow-sm px-6 py-3 rounded-2xl flex items-center justify-between w-full sm:w-auto gap-6'>
              <div className='text-left sm:text-right'>
                <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                  Total Operatives
                </p>
                <p className='text-2xl font-black text-slate-900 leading-none mt-1'>
                  {users.length}
                </p>
              </div>
              <Users className='text-indigo-500' size={28} strokeWidth={2.5} />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className='w-full sm:w-auto bg-linear-to-r from-indigo-600 to-violet-600 text-white h-full px-8 py-4 sm:py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-200 active:scale-95 transition-all duration-200'
            >
              <UserPlus size={18} /> Provision
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {users.map((user) => {
            const roleStyles = {
              admin: {
                gradient: "from-slate-800 to-slate-900",
                badge: "border-slate-200 text-slate-600 bg-slate-50",
              },
              employee: {
                gradient: "from-indigo-500 to-violet-600",
                badge: "border-indigo-100 text-indigo-600 bg-indigo-50",
              },
              client: {
                gradient: "from-emerald-400 to-teal-500",
                badge: "border-emerald-100 text-emerald-600 bg-emerald-50",
              },
            };
            const theme = roleStyles[user.role] || roleStyles.client;

            return (
              <div
                key={user._id}
                className='group bg-white border border-slate-100 rounded-[2.5rem] p-6 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col h-full'
              >
                <div
                  className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-5 bg-linear-to-br ${theme.linear} group-hover:opacity-15 transition-opacity duration-500 pointer-events-none`}
                ></div>

                <div className='relative z-10 flex justify-between items-start mb-6'>
                  <div
                    className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-slate-200 bg-linear-to-br ${theme.gradient} overflow-hidden shrink-0`}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>

                  <div className='flex gap-1.5'>
                    <button
                      onClick={() => handleEditClick(user)}
                      className='p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors'
                      title='Edit Profile'
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      disabled={user._id === currentUser._id}
                      className='p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                      title='Offboard Operative'
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className='relative z-10 flex-1'>
                  <h3 className='text-xl font-black text-slate-900 uppercase tracking-tight mb-1 truncate'>
                    {user.name}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${theme.badge}`}
                  >
                    {user.role}
                  </span>

                  <div className='mt-6 space-y-3'>
                    <div className='flex items-center gap-3 text-slate-500 text-sm'>
                      <div className='w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0'>
                        <Mail size={14} />
                      </div>
                      <span className='truncate font-medium'>{user.email}</span>
                    </div>

                    <div className='flex items-center gap-3 text-slate-500 text-sm'>
                      <div className='w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0'>
                        {user.role === "client" ? (
                          <Building2 size={14} />
                        ) : (
                          <Briefcase size={14} />
                        )}
                      </div>
                      <span className='truncate font-bold text-slate-700'>
                        {user.company || user.position || "Independent"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='relative z-10 mt-8 pt-4 border-t border-slate-100 flex items-center justify-between'>
                  <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                    Security Clearance
                  </p>
                  <div className='flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg'>
                    <ShieldCheck size={14} /> Verified
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchUsers}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchUsers}
        userToEdit={selectedUser}
      />
    </ProtectedRoute>
  );
}
