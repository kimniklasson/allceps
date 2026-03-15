import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { ReactNode } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading, displayName } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-[600px] min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!displayName) {
    return <Navigate to="/set-name" replace />;
  }

  return <>{children}</>;
}
