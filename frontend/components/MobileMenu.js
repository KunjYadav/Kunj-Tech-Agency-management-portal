"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
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

export default function MobileMenu({
  isOpen,
  onClose,
  onOpenProfile,
  onOpenBilling,
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!isOpen) return null;

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
    <div className='fixed inset-0 z-50 lg:hidden'>
      <div
        className='fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity'
        onClick={onClose}
      ></div>

      <div className='fixed inset-y-0 left-0 w-72 bg-white p-6 shadow-2xl flex flex-col animate-in slide-in-from-left-8 duration-300'>
        <div className='flex items-center justify-between mb-8'>
          <BrandLogo onClick={onClose} />
          <button
            onClick={onClose}
            className='p-2 hover:bg-slate-100 rounded-full transition-colors'
          >
            <X className='text-slate-500' />
          </button>
        </div>

        <nav className='space-y-2 flex-1'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
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

        <div className='pt-6 border-t border-slate-100 space-y-2'>
          <button
            onClick={() => {
              onClose();
              onOpenBilling();
            }}
            className='w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all'
          >
            <CreditCard size={20} />
            Payment Methods
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenProfile();
            }}
            className='w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all'
          >
            <Settings size={20} />
            Edit Profile
          </button>

          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className='w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all'
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
