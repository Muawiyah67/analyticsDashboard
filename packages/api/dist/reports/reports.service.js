"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
const pdfkit_1 = __importDefault(require("pdfkit"));
let ReportsService = class ReportsService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async findAll(companyId, page = 1, limit = 10, type, status) {
        let query = this.supabase.getClient()
            .from('reports')
            .select('*', { count: 'exact' })
            .eq('company_id', companyId);
        if (type)
            query = query.eq('type', type);
        if (status)
            query = query.eq('status', status);
        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range((page - 1) * limit, page * limit - 1);
        if (error)
            throw new Error(error.message);
        return {
            data: data || [],
            meta: {
                total: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit),
            },
        };
    }
    async findOne(id, companyId) {
        const { data, error } = await this.supabase.getClient()
            .from('reports')
            .select('*')
            .eq('id', id)
            .eq('company_id', companyId)
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Report not found');
        return data;
    }
    async findBySlug(slug) {
        const { data, error } = await this.supabase.getClient()
            .from('reports')
            .select('*')
            .eq('slug', slug)
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Report not found');
        return data;
    }
    async create(companyId, dto) {
        const slug = this.generateSlug(dto.name);
        // Generate CSV content
        const csvContent = await this.generateCsvContent(companyId, dto.type);
        // Generate PDF once during creation (CPU spike happens here, not on download)
        const pdfBuffer = await this.generatePdfContent(companyId, dto.type, dto.name, csvContent);
        // Upload PDF to Supabase Storage
        const fileName = `${slug}.pdf`;
        const { error: uploadError } = await this.supabase.getClient()
            .storage
            .from('reports')
            .upload(fileName, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true,
        });
        let fileUrl = null;
        if (!uploadError) {
            const { data: urlData } = this.supabase.getClient()
                .storage
                .from('reports')
                .getPublicUrl(fileName);
            fileUrl = urlData.publicUrl;
        }
        // Save report record with file URL
        const { data, error } = await this.supabase.getClient()
            .from('reports')
            .insert({
            ...dto,
            slug,
            company_id: companyId,
            status: 'ready',
            file_url: fileUrl,
            file_content: csvContent,
            file_size: pdfBuffer.length,
            created_at: new Date().toISOString(),
        })
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async remove(id, companyId) {
        const { error } = await this.supabase.getClient()
            .from('reports')
            .delete()
            .eq('id', id)
            .eq('company_id', companyId);
        if (error)
            throw new Error(error.message);
        return { message: 'Report deleted' };
    }
    // Serve cached PDF from Supabase Storage — ZERO CPU
    async getPdfUrl(slug) {
        const report = await this.findBySlug(slug);
        if (!report.file_url) {
            throw new common_1.NotFoundException('PDF not found for this report');
        }
        return report.file_url;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now();
    }
    async generatePdfContent(companyId, type, title, csvContent) {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ margin: 50 });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            // Header
            doc.fontSize(24).font('Helvetica-Bold').text(title, 50, 50);
            doc.fontSize(12).font('Helvetica').text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 80);
            doc.moveDown(2);
            const lines = csvContent.trim().split('\n').filter(l => l.length > 0);
            if (lines.length <= 1) {
                doc.fontSize(14).fillColor('#666').text('No data available for this report.', 50, doc.y);
                doc.fontSize(11).fillColor('#999').text('Create some orders, products, or customers to see data here.', 50, doc.y + 25);
            }
            else {
                const headers = lines[0].split(',').map(h => h.trim());
                const dataRows = lines.slice(1).filter(l => l.trim().length > 0);
                const pageWidth = 550;
                const colWidth = Math.min(120, (pageWidth - 50) / headers.length);
                const headerY = doc.y;
                doc.rect(50, headerY, headers.length * colWidth, 25).fill('#f3f4f6');
                doc.fontSize(10).font('Helvetica-Bold').fillColor('#374151');
                headers.forEach((header, i) => {
                    doc.text(header, 55 + (i * colWidth), headerY + 7, { width: colWidth - 10 });
                });
                doc.moveDown(2);
                doc.moveTo(50, doc.y).lineTo(50 + headers.length * colWidth, doc.y).stroke('#e5e7eb');
                doc.moveDown(0.5);
                doc.fontSize(9).font('Helvetica').fillColor('#4b5563');
                let rowIndex = 0;
                for (const line of dataRows) {
                    const row = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
                    const startY = doc.y;
                    if (rowIndex % 2 === 1) {
                        doc.rect(50, startY - 2, headers.length * colWidth, 18).fill('#f9fafb');
                    }
                    row.forEach((cell, j) => {
                        const displayValue = cell.length > 25 ? cell.substring(0, 22) + '...' : cell;
                        doc.fillColor('#4b5563').text(displayValue, 55 + (j * colWidth), startY, { width: colWidth - 10 });
                    });
                    doc.moveDown();
                    rowIndex++;
                    if (doc.y > 720) {
                        doc.addPage();
                        doc.y = 50;
                    }
                }
                doc.moveTo(50, doc.y).lineTo(50 + headers.length * colWidth, doc.y).stroke('#e5e7eb');
            }
            doc.end();
        });
    }
    async generateCsvContent(companyId, type) {
        let data = [];
        let columns = [];
        switch (type) {
            case 'sales':
                const { data: orders } = await this.supabase.getClient()
                    .from('orders')
                    .select('*')
                    .eq('company_id', companyId);
                data = orders || [];
                columns = ['id', 'customer_id', 'total_amount', 'status', 'created_at'];
                break;
            case 'revenue':
                const { data: revenueOrders } = await this.supabase.getClient()
                    .from('orders')
                    .select('created_at, total_amount')
                    .eq('company_id', companyId);
                data = revenueOrders || [];
                columns = ['created_at', 'total_amount'];
                break;
            case 'analytics':
                const { data: events } = await this.supabase.getClient()
                    .from('analytics_events')
                    .select('*')
                    .eq('company_id', companyId);
                data = events || [];
                columns = ['id', 'event_type', 'page_url', 'created_at'];
                break;
            case 'products':
                const { data: products } = await this.supabase.getClient()
                    .from('products')
                    .select('*')
                    .eq('company_id', companyId);
                data = products || [];
                columns = ['id', 'name', 'price', 'stock', 'status'];
                break;
            case 'customers':
                const { data: customers } = await this.supabase.getClient()
                    .from('customers')
                    .select('*')
                    .eq('company_id', companyId);
                data = customers || [];
                columns = ['id', 'name', 'email', 'created_at'];
                break;
            default:
                return 'Report generated\n';
        }
        return this.toCsv(data, columns);
    }
    toCsv(data, columns) {
        if (!data.length)
            return columns.join(',') + '\n';
        const header = columns.join(',') + '\n';
        const rows = data.map(row => columns.map(col => {
            const val = row[col];
            if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
                return `"${val.replace(/"/g, '""')}"`;
            }
            return val ?? '';
        }).join(',')).join('\n');
        return header + rows + '\n';
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ReportsService);
