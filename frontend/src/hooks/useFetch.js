// frontend/src/hooks/useFetch.js
import { useState, useEffect, useCallback } from 'react';

export const useFetch = (fetchFn, deps = [], options = {}) => {
    const { 
        immediate = true, 
        initialData = null,
        onSuccess = null,
        onError = null,
    } = options;

    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState('');

    const refetch = useCallback(async (...args) => {
        setLoading(true);
        setError('');
        try {
            const result = await fetchFn(...args);
            setData(result);
            if (onSuccess) onSuccess(result);
            return result;
        } catch (err) {
            const message = err.response?.data?.detail || err.message || 'Something went wrong';
            setError(message);
            if (onError) onError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchFn, onSuccess, onError]);

    useEffect(() => {
        if (immediate) {
            refetch();
        }
    }, deps);

    return { data, loading, error, refetch, setData };
};

export default useFetch;