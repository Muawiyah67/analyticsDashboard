"use strict";
/* ============================================================================
   PAGINATION & COMMON TYPES
   ============================================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportStatus = exports.ReportType = exports.ProductStatus = exports.OrderStatus = exports.UserStatus = exports.UserRole = void 0;
/* ============================================================================
   USER TYPES
   ============================================================================ */
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["USER"] = "user";
    UserRole["VIEWER"] = "viewer";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
/* ============================================================================
   ORDER TYPES
   ============================================================================ */
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["COMPLETED"] = "completed";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
/* ============================================================================
   PRODUCT TYPES
   ============================================================================ */
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["ACTIVE"] = "active";
    ProductStatus["INACTIVE"] = "inactive";
    ProductStatus["OUT_OF_STOCK"] = "out_of_stock";
    ProductStatus["DISCONTINUED"] = "discontinued";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
/* ============================================================================
   REPORT TYPES
   ============================================================================ */
var ReportType;
(function (ReportType) {
    ReportType["SALES"] = "sales";
    ReportType["REVENUE"] = "revenue";
    ReportType["ANALYTICS"] = "analytics";
    ReportType["PRODUCTS"] = "products";
    ReportType["CUSTOMERS"] = "customers";
    ReportType["FORECAST"] = "forecast";
})(ReportType || (exports.ReportType = ReportType = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "pending";
    ReportStatus["GENERATING"] = "generating";
    ReportStatus["READY"] = "ready";
    ReportStatus["FAILED"] = "failed";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
