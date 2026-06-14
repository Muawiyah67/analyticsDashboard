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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopItemsQueryDto = exports.TrafficQueryDto = exports.RevenueQueryDto = exports.AnalyticsStatsQueryDto = exports.TopItemType = exports.TrafficPeriod = exports.RevenuePeriod = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var RevenuePeriod;
(function (RevenuePeriod) {
    RevenuePeriod["DAILY"] = "daily";
    RevenuePeriod["WEEKLY"] = "weekly";
    RevenuePeriod["MONTHLY"] = "monthly";
    RevenuePeriod["QUARTERLY"] = "quarterly";
    RevenuePeriod["ANNUAL"] = "annual";
})(RevenuePeriod || (exports.RevenuePeriod = RevenuePeriod = {}));
var TrafficPeriod;
(function (TrafficPeriod) {
    TrafficPeriod["WEEK"] = "week";
    TrafficPeriod["MONTH"] = "month";
})(TrafficPeriod || (exports.TrafficPeriod = TrafficPeriod = {}));
var TopItemType;
(function (TopItemType) {
    TopItemType["PRODUCTS"] = "products";
    TopItemType["PAGES"] = "pages";
})(TopItemType || (exports.TopItemType = TopItemType = {}));
class AnalyticsStatsQueryDto {
}
exports.AnalyticsStatsQueryDto = AnalyticsStatsQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyticsStatsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyticsStatsQueryDto.prototype, "endDate", void 0);
class RevenueQueryDto {
}
exports.RevenueQueryDto = RevenueQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(RevenuePeriod),
    __metadata("design:type", String)
], RevenueQueryDto.prototype, "period", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RevenueQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RevenueQueryDto.prototype, "endDate", void 0);
class TrafficQueryDto {
}
exports.TrafficQueryDto = TrafficQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TrafficPeriod),
    __metadata("design:type", String)
], TrafficQueryDto.prototype, "period", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrafficQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrafficQueryDto.prototype, "endDate", void 0);
class TopItemsQueryDto {
    constructor() {
        this.limit = 10;
    }
}
exports.TopItemsQueryDto = TopItemsQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], TopItemsQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TopItemType),
    __metadata("design:type", String)
], TopItemsQueryDto.prototype, "type", void 0);
