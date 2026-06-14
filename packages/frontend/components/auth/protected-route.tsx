"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthService } from "@/lib/api/auth.service";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('=== PROTECTED ROUTE ===');
      const token = AuthService.getToken();
      console.log('Token from localStorage:', token ? `exists (${token.length} chars)` : 'NULL');
      
      if (!token) {
        console.log('No token, redirecting to login');
        router.push("/login");
        return;
      }

      console.log('Calling getCurrentUser()...');
      const result = await AuthService.getCurrentUser();
      console.log('getCurrentUser result:', result);
      
      if (!result.success) {
        console.log('getCurrentUser FAILED:', result.message);
        AuthService.logout();
        router.push("/login");
        return;
      }

      console.log('Auth check PASSED');
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}