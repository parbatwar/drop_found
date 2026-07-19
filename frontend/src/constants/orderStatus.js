// constants/orderStatus.js

export const ORDER_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    READY_FOR_PICKUP: 'ready_for_pickup',
    PICKED_UP: 'picked_up',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
    [ORDER_STATUS.PENDING]: 'Pending',
    [ORDER_STATUS.ACCEPTED]: 'Accepted',
    [ORDER_STATUS.REJECTED]: 'Rejected',
    [ORDER_STATUS.READY_FOR_PICKUP]: 'Ready for Pickup',
    [ORDER_STATUS.PICKED_UP]: 'Picked Up',
    [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
    [ORDER_STATUS.DELIVERED]: 'Delivered',
    [ORDER_STATUS.COMPLETED]: 'Completed',
    [ORDER_STATUS.CANCELLED]: 'Cancelled',
};

export const ORDER_STATUS_COLORS = {
    [ORDER_STATUS.PENDING]: 'text-amber-600 bg-amber-50 border-amber-200',
    [ORDER_STATUS.ACCEPTED]: 'text-blue-600 bg-blue-50 border-blue-200',
    [ORDER_STATUS.REJECTED]: 'text-red-600 bg-red-50 border-red-200',
    [ORDER_STATUS.READY_FOR_PICKUP]: 'text-purple-600 bg-purple-50 border-purple-200',
    [ORDER_STATUS.PICKED_UP]: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    [ORDER_STATUS.OUT_FOR_DELIVERY]: 'text-blue-600 bg-blue-50 border-blue-200',
    [ORDER_STATUS.DELIVERED]: 'text-green-600 bg-green-50 border-green-200',
    [ORDER_STATUS.COMPLETED]: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    [ORDER_STATUS.CANCELLED]: 'text-neutral-400 bg-neutral-50 border-neutral-200',
};

export const ORDER_STATUS_ACTIONS = {
    // What buyer can do
    buyer: {
        [ORDER_STATUS.PENDING]: ['cancel'],
        [ORDER_STATUS.ACCEPTED]: ['cancel'],
        [ORDER_STATUS.DELIVERED]: ['review'],
        [ORDER_STATUS.COMPLETED]: [],
        [ORDER_STATUS.REJECTED]: [],
        [ORDER_STATUS.CANCELLED]: [],
    },
    // What seller can do
    seller: {
        [ORDER_STATUS.PENDING]: ['accept', 'reject'],
        [ORDER_STATUS.ACCEPTED]: ['ready_for_pickup', 'cancel'],
        [ORDER_STATUS.READY_FOR_PICKUP]: [],
        [ORDER_STATUS.PICKED_UP]: [],
        [ORDER_STATUS.OUT_FOR_DELIVERY]: [],
        [ORDER_STATUS.DELIVERED]: [],
        [ORDER_STATUS.COMPLETED]: [],
    },
    // What admin can do
    admin: {
        [ORDER_STATUS.PENDING]: ['accept', 'reject', 'cancel'],
        [ORDER_STATUS.ACCEPTED]: ['ready_for_pickup', 'cancel'],
        [ORDER_STATUS.READY_FOR_PICKUP]: ['picked_up'],
        [ORDER_STATUS.PICKED_UP]: ['out_for_delivery'],
        [ORDER_STATUS.OUT_FOR_DELIVERY]: ['delivered'],
        [ORDER_STATUS.DELIVERED]: ['complete'],
        [ORDER_STATUS.COMPLETED]: [],
    },
};