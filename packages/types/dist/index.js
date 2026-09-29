"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = exports.UserRole = void 0;
exports.UserRole = {
    CUSTOMER: "CUSTOMER",
    RESTAURANT_OWNER: 'RESTAURANT_OWNER',
    DRIVER: 'DRIVER'
};
exports.OrderStatus = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PREPARING: 'PREPARING',
    READY: 'READY',
    PICKED_UP: 'PICKED_UP',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
};
