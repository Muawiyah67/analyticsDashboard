import { apiClient } from './client';
import { AuthCredentials, AuthResponse, User, ApiResponse } from '@/lib/types';

export class AuthService {
  private static readonly BASE_ENDPOINT = '/auth';

  /**
   * Register new user
   */
  static async register(email: string, password: string, name: string): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>(`${this.BASE_ENDPOINT}/register`, {
      email,
      password,
      name,
    });
  }

  /**
   * Login user
   */
  static async login(credentials: AuthCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(`${this.BASE_ENDPOINT}/login`, credentials);

    if (response.success && response.data?.accessToken) {
      apiClient.setToken(response.data.accessToken);
    }

    return response;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<ApiResponse<void>> {
    apiClient.clearToken();
    return apiClient.post<void>(`${this.BASE_ENDPOINT}/logout`, {});
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(`${this.BASE_ENDPOINT}/refresh`, {
      refreshToken,
    });

    if (response.success && response.data?.accessToken) {
      apiClient.setToken(response.data.accessToken);
    }

    return response;
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`${this.BASE_ENDPOINT}/me`);
  }

  /**
   * Verify token
   */
  static async verifyToken(): Promise<ApiResponse<{ valid: boolean }>> {
    return apiClient.get<{ valid: boolean }>(`${this.BASE_ENDPOINT}/verify`);
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`${this.BASE_ENDPOINT}/forgot-password`, {
      email,
    });
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`${this.BASE_ENDPOINT}/reset-password`, {
      token,
      newPassword,
    });
  }

  /**
   * Change password
   */
  static async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`${this.BASE_ENDPOINT}/change-password`, {
      oldPassword,
      newPassword,
    });
  }

  /**
   * Enable two-factor authentication
   */
  static async enableTwoFactor(): Promise<ApiResponse<{ secret: string; qrCode: string }>> {
    return apiClient.post<{ secret: string; qrCode: string }>(`${this.BASE_ENDPOINT}/2fa/enable`, {});
  }

  /**
   * Verify two-factor authentication
   */
  static async verifyTwoFactor(code: string): Promise<ApiResponse<{ verified: boolean; backupCodes: string[] }>> {
    return apiClient.post<{ verified: boolean; backupCodes: string[] }>(`${this.BASE_ENDPOINT}/2fa/verify`, { code });
  }

  /**
   * Disable two-factor authentication
   */
  static async disableTwoFactor(password: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`${this.BASE_ENDPOINT}/2fa/disable`, { password });
  }
}