"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className='h-screen flex items-center justify-center bg-slate-50'>
      <div className='animate-pulse font-bold text-slate-400'>
        Loading Workspace...
      </div>
    </div>
  );
}
