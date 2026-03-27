"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Users,
  LogOut,
  Settings,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import BrandLogo from "./BrandLogo"; // NEW

export default function Sidebar({ onOpenProfile, onOpenBilling }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Projects", href: "/projects", icon: FolderKanban },
    { label: "Requests", href: "/requests", icon: ClipboardList },
  ];

  if (user?.role === "admin") {
    navItems.splice(3, 0, {
      label: "Team Control",
      href: "/team",
      icon: Users,
    });
  }

  return (
    <div className='hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col h-screen fixed top-0 left-0 z-40'>
      <div className='p-8 pb-6'>
        <BrandLogo />
      </div>

      <nav className='flex-1 px-4 space-y-2 mt-4'>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className='p-4 border-t border-slate-100'>
        <div className='flex justify-between items-center bg-slate-50 p-4 rounded-3xl mb-4'>
          <div className='overflow-hidden'>
            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>
              Signed in as
            </p>
            <p className='text-sm font-bold text-slate-900 truncate'>
              {user?.name}
            </p>
            <p className='text-[10px] font-bold text-indigo-600 uppercase'>
              {user?.role}
            </p>
          </div>
          <div className='flex gap-1'>
            <button
              onClick={onOpenBilling}
              className='p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors'
              title='Billing Methods'
            >
              <CreditCard size={18} />
            </button>
            <button
              onClick={onOpenProfile}
              className='p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors'
              title='Edit Profile'
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        <button
          onClick={logout}
          className='w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all'
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
