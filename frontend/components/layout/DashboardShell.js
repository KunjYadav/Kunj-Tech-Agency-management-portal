"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import MobileMenu from "@/components/MobileMenu";
import NotificationCenter from "@/components/NotificationCenter";
import EditProfileModal from "@/components/modals/EditProfileModal";
import BillingModal from "@/components/modals/BillingModal";

export default function DashboardShell({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className='h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-400 animate-pulse'>
        Authenticating Workspace...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50 flex'>
      <Sidebar
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenBilling={() => setIsBillingModalOpen(true)}
      />

      <main className='flex-1 lg:ml-72 flex flex-col min-h-screen'>
        <header className='h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 flex items-center justify-between'>
          <button
            className='lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-xl transition-colors'
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className='text-slate-600' />
          </button>

          <div className='flex items-center gap-6 ml-auto'>
            <NotificationCenter />

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className='flex items-center gap-3 pl-6 border-l border-slate-200 text-left hover:opacity-70 transition-opacity cursor-pointer'
            >
              <div className='text-right hidden sm:block'>
                <p className='text-sm font-black text-slate-900 leading-none'>
                  {user.name}
                </p>
                <p className='text-[10px] font-bold text-indigo-600 uppercase tracking-tight mt-1'>
                  {user.role}
                </p>
              </div>
              <div className='w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0'>
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.name?.charAt(0)
                )}
              </div>
            </button>
          </div>
        </header>

        <section className='p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full'>
          {children}
        </section>
      </main>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenBilling={() => setIsBillingModalOpen(true)} 
      />

      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <BillingModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
      />
    </div>
  );
}
