/**
 * @file useOrders.js
 * @description Custom React hook for managing user orders, handling state for 
 * order groups, loading status, active filters, and providing methods for 
 * fetching, flattening, filtering, counting, and cancelling orders.
 */


import { useState, useCallback } from 'react';
import { getMyOrderGroups, updateOrderStatus } from '../api/orders';
import { ORDER_STATUS } from '../constants/orderStatus';
import { useToast } from './useToast';

export const useOrders = () => {
    const { showToast } = useToast();
    const [orderGroups, setOrderGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [cancelling, setCancelling] = useState(false);

    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getMyOrderGroups();
            setOrderGroups(res.data || []);
        } catch (err) {
            console.error('Failed to load orders:', err);
            showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    // Get all individual orders with their group info
    const getAllOrders = useCallback(() => {
        const allOrders = [];
        orderGroups.forEach(group => {
            group.orders?.forEach(order => {
                allOrders.push({
                    ...order,
                    groupId: group.id,
                    groupTotal: group.total_amount,
                    groupCreated: group.created_at,
                });
            });
        });
        return allOrders;
    }, [orderGroups]);

    // Get filtered orders based on selected filter
    const getFilteredOrders = useCallback(() => {
        const allOrders = getAllOrders();
        if (selectedFilter === 'all') return allOrders;
        return allOrders.filter(order => order.status === selectedFilter);
    }, [getAllOrders, selectedFilter]);

    // Get count for each filter
    const getFilterCount = useCallback((filterKey) => {
        const allOrders = getAllOrders();
        if (filterKey === 'all') return allOrders.length;
        return allOrders.filter(order => order.status === filterKey).length;
    }, [getAllOrders]);

    // Cancel an order
    const cancelOrder = useCallback(async (orderId) => {
        setCancelling(true);
        try {
            await updateOrderStatus(orderId, { status: ORDER_STATUS.CANCELLED });
            await loadOrders();
            showToast('Order cancelled successfully', 'success');
            return true;
        } catch (err) {
            showToast(err.response?.data?.detail || 'Failed to cancel order', 'error');
            return false;
        } finally {
            setCancelling(false);
        }
    }, [loadOrders, showToast]);

    return {
        orderGroups,
        loading,
        selectedFilter,
        setSelectedFilter,
        cancelling,
        loadOrders,
        getAllOrders,
        getFilteredOrders,
        getFilterCount,
        cancelOrder,
    };
};