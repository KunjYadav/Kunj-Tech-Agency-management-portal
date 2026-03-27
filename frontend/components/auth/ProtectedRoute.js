"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // No user found, kick to login
        router.push("/login");
      } else if (adminOnly && user.role !== "admin") {
        // User exists but isn't an admin
        router.push("/dashboard");
      }
    }
  }, [user, loading, router, adminOnly]);

  // Show a loading state while checking authorization
  if (loading || !user || (adminOnly && user.role !== "admin")) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Verifying Clearance...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}