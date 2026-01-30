import React, { createContext, useContext, useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export default function AdminLayout() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedVilla, setSelectedVilla] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check authentication
        const auth = localStorage.getItem('admin_auth') === 'true';
        const villa = localStorage.getItem('admin_selected_villa');

        setIsAuthenticated(auth);
        if (villa) setSelectedVilla(JSON.parse(villa));

        setIsLoading(false);
    }, []);

    const login = (password) => {
        if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
            localStorage.setItem('admin_auth', 'true');
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('admin_auth');
        localStorage.removeItem('admin_selected_villa');
        setIsAuthenticated(false);
        setSelectedVilla(null);
        navigate('/admin/login');
    };

    const selectVilla = (villa) => {
        localStorage.setItem('admin_selected_villa', JSON.stringify(villa));
        setSelectedVilla(villa);
        navigate('/admin/dashboard');
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-white">Loading...</div>;
    }

    // Redirect logic
    if (!isAuthenticated && location.pathname !== '/admin/login') {
        return <Navigate to="/admin/login" replace />;
    }

    if (isAuthenticated && location.pathname === '/admin/login') {
        if (selectedVilla) {
            return <Navigate to="/admin/dashboard" replace />;
        } else {
            return <Navigate to="/admin/select-villa" replace />;
        }
    }

    // If authenticated but no villa selected, and strict mode is needed, force selection
    // except for the selection page itself
    if (isAuthenticated && !selectedVilla && location.pathname !== '/admin/select-villa') {
        return <Navigate to="/admin/select-villa" replace />;
    }

    return (
        <AdminContext.Provider value={{ isAuthenticated, login, logout, selectedVilla, selectVilla }}>
            <div className="admin-app min-h-screen bg-neutral-50 font-sans text-neutral-900">
                <Outlet />
                <Toaster position="top-center" />
            </div>
        </AdminContext.Provider>
    );
}
