import { apiClient } from './client';
import { Report, CreateReportDto, ApiResponse } from '@nexus/shared';

interface ReportsListResponse {
  data: Report[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class ReportService {
  private static readonly BASE_ENDPOINT = '/reports';

  static async getReports(): Promise<ApiResponse<ReportsListResponse>> {
    return apiClient.get<ReportsListResponse>(this.BASE_ENDPOINT);
  }

  static async generateReport(data: CreateReportDto): Promise<ApiResponse<Report>> {
    return apiClient.post<Report>(this.BASE_ENDPOINT, data);
  }

  // Download report by slug as PDF
  static async downloadReport(slug: string): Promise<Blob> {
    // Encode the slug to handle special characters in URLs
    const encodedSlug = encodeURIComponent(slug);
    const url = `${apiClient.baseUrl}${this.BASE_ENDPOINT}/download/${encodedSlug}`;
    
    console.log('Downloading from:', url); // Debug log
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Download failed: ${response.status} - ${errorText}`);
    }
    
    return response.blob();
  }
}