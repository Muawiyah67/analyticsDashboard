import { ApiResponse } from "@nexus/shared";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  company: Company;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export class AuthService {
  static async register(
    email: string,
    password: string,
    name: string,
    companyName?: string,
    companySize?: string,
    plan?: string
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name,
        companyName,
        companySize,
        plan,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || "Registration failed" };
    }

    if (data.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
    }

    return data;
  }

  static async login(credentials: AuthCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || "Login failed" };
    }

    if (data.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
    }

    return data;
  }

  static async logout(): Promise<ApiResponse<void>> {
    localStorage.removeItem("accessToken");
    return { success: true, message: "Logged out" };
  }

  static async getCurrentUser(): Promise<ApiResponse<User & { company?: Company }>> {
    const token = localStorage.getItem("accessToken");
    if (!token) return { success: false, message: "Not authenticated" };

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || "Failed to get user" };
    }

    return data;
  }

  static async getUserName(): Promise<string> {
    const { data, success } = await this.getCurrentUser();
    if (!success || !data) return "User";
    return data.name || data.email?.split("@")[0] || "User";
  }

  static getToken(): string | null {
    return localStorage.getItem("accessToken");
  }
}