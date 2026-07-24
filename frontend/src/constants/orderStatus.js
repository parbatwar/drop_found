// frontend/src/constants/orderStatus.js

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
    [ORDER_STATUS.PENDING]: 'bg-amber-50 text-amber-600 border-amber-200',
    [ORDER_STATUS.ACCEPTED]: 'bg-blue-50 text-blue-600 border-blue-200',
    [ORDER_STATUS.REJECTED]: 'bg-red-50 text-red-600 border-red-200',
    [ORDER_STATUS.READY_FOR_PICKUP]: 'bg-purple-50 text-purple-600 border-purple-200',
    [ORDER_STATUS.PICKED_UP]: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    [ORDER_STATUS.OUT_FOR_DELIVERY]: 'bg-blue-50 text-blue-600 border-blue-200',
    [ORDER_STATUS.DELIVERED]: 'bg-green-50 text-green-600 border-green-200',
    [ORDER_STATUS.COMPLETED]: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    [ORDER_STATUS.CANCELLED]: 'bg-neutral-50 text-neutral-400 border-neutral-200',
};

// For verification status badges (seller/admin)
export const VERIFICATION_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};

export const VERIFICATION_STATUS_LABELS = {
    [VERIFICATION_STATUS.PENDING]: 'Pending',
    [VERIFICATION_STATUS.APPROVED]: 'Approved',
    [VERIFICATION_STATUS.REJECTED]: 'Rejected',
};

export const VERIFICATION_STATUS_COLORS = {
    [VERIFICATION_STATUS.PENDING]: 'bg-amber-50 text-amber-600 border-amber-200',
    [VERIFICATION_STATUS.APPROVED]: 'bg-green-50 text-green-600 border-green-200',
    [VERIFICATION_STATUS.REJECTED]: 'bg-red-50 text-red-600 border-red-200',
};

// Order status action mappings
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

// Helper function to get tracking steps
export const getTrackingSteps = () => [
    { key: ORDER_STATUS.PENDING, label: 'Order Placed' },
    { key: ORDER_STATUS.ACCEPTED, label: 'Accepted' },
    { key: ORDER_STATUS.READY_FOR_PICKUP, label: 'Ready for Pickup' },
    { key: ORDER_STATUS.PICKED_UP, label: 'Picked Up' },
    { key: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Out for Delivery' },
    { key: ORDER_STATUS.DELIVERED, label: 'Delivered' },
    { key: ORDER_STATUS.COMPLETED, label: 'Completed' },
];

// Helper function to get step index
export const getStepIndex = (status) => {
    const orderFlow = [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.ACCEPTED,
        ORDER_STATUS.READY_FOR_PICKUP,
        ORDER_STATUS.PICKED_UP,
        ORDER_STATUS.OUT_FOR_DELIVERY,
        ORDER_STATUS.DELIVERED,
        ORDER_STATUS.COMPLETED,
    ];
    return orderFlow.indexOf(status);
};