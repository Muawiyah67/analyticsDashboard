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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const analytics_service_1 = require("./analytics.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const http_exception_filter_1 = require("../common/filters/http-exception.filter");
const response_interceptor_1 = require("../common/interceptors/response.interceptor");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getStats(companyId) {
        return this.analyticsService.getDashboardStats(companyId);
    }
    async getRevenue(companyId, period = 'month') {
        return this.analyticsService.getRevenueData(companyId, period);
    }
    async getTraffic(companyId, period = 'month') {
        return this.analyticsService.getTrafficData(companyId, period);
    }
    async getTopPages(companyId, limit = '5') {
        return this.analyticsService.getTopPages(companyId, parseInt(limit));
    }
    async getTopProducts(companyId, limit = '5') {
        return this.analyticsService.getTopProducts(companyId, parseInt(limit));
    }
    async getDashboard(companyId) {
        const [stats, revenue, topProducts] = await Promise.all([
            this.analyticsService.getDashboardStats(companyId),
            this.analyticsService.getRevenueData(companyId),
            this.analyticsService.getTopProducts(companyId),
        ]);
        return { stats, revenue, topProducts };
    }
    async export(companyId, format = 'csv') {
        return this.analyticsService.exportAnalytics(companyId, format);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('company_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('revenue'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('company_id')),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRevenue", null);
__decorate([
    (0, common_1.Get)('traffic'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('company_id')),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTraffic", null);
__decorate([
    (0, common_1.Get)('top-pages'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('company_id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTopPages", null);
__decorate([
    (0, common_1.Get)('top-products'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('company_id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTopProducts", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('company_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('company_id')),
    __param(1, (0, common_1.Query)('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "export", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, common_1.Controller)('analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.UseFilters)(http_exception_filter_1.HttpExceptionFilter),
    (0, common_1.UseInterceptors)(response_interceptor_1.ResponseInterceptor),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
