export declare enum CustomerStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending"
}
export declare class CreateCustomerDto {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    status?: CustomerStatus;
}
