/**
 * @file OrderStatusMessage.jsx
 * @description Component for rendering descriptive status messages and accompanying icons 
 * corresponding to various order lifecycle states (such as pickup, out for delivery, completion, or cancellation).
 */

import { ORDER_STATUS } from '../../constants/orderStatus';

function OrderStatusMessage({ status, className = '' }) {
    const messages = {
        [ORDER_STATUS.READY_FOR_PICKUP]: 'Awaiting delivery partner pickup',
        [ORDER_STATUS.PICKED_UP]: 'Package picked up by delivery partner',
        [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Package is out for delivery',
        [ORDER_STATUS.DELIVERED]: 'Package delivered to customer',
        [ORDER_STATUS.COMPLETED]: 'Order completed successfully',
        [ORDER_STATUS.REJECTED]: 'Order was rejected',
        [ORDER_STATUS.CANCELLED]: 'Order was cancelled',
    };

    const icons = {
        [ORDER_STATUS.READY_FOR_PICKUP]: '⏳',
        [ORDER_STATUS.PICKED_UP]: '🚚',
        [ORDER_STATUS.OUT_FOR_DELIVERY]: '🚛',
        [ORDER_STATUS.DELIVERED]: '✅',
        [ORDER_STATUS.COMPLETED]: '✨',
        [ORDER_STATUS.REJECTED]: '❌',
        [ORDER_STATUS.CANCELLED]: '✕',
    };

    const message = messages[status];
    const icon = icons[status];

    if (!message) return null;

    return (
        <div className={`text-center text-xs text-neutral-400 ${className}`}>
            {icon && <span className="mr-1">{icon}</span>}
            {message}
        </div>
    );
}

export default OrderStatusMessage;