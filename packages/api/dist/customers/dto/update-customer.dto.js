"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_customers_dto_1 = require("./create-customers.dto");
class UpdateCustomerDto extends (0, swagger_1.PartialType)(create_customers_dto_1.CreateCustomerDto) {
}
exports.UpdateCustomerDto = UpdateCustomerDto;
