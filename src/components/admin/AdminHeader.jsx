import React, { useState } from "react";
import { format } from "date-fns";
import { Sun, Moon, RefreshCw, LogOut, ChevronDown, Building2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/layouts/AdminLayout";
import { villas } from "@/lib/constants";
import adminLogo from "@/assets/admin_logo.png"; // We might need to handle this image path

export function AdminHeader({ activeTab, darkMode, toggleDarkMode }) {
    const { logout, selectedVilla, selectVilla } = useAdmin();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRefresh = () => {
        setLoading(true);
        // Simulate refresh or trigger context refresh if needed
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-30 px-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-4 flex items-center justify-between shrink-0 transition-all duration-300 ${darkMode ? "bg-neutral-950/80 border-b border-neutral-800/50 backdrop-blur-xl" : "bg-white/80 border-b border-neutral-100 backdrop-blur-xl"}`}>
            <div className="flex flex-col">
                <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-neutral-900"}`}>
                    {
                        {
                            stats: "Dashboard",
                            bookings: "Bookings",
                            pricing: "Pricing",
                            gallery: "Gallery"
                        }[activeTab]
                    }
                </h1>
            </div>

            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleDarkMode}
                    className={`p-2.5 rounded-full transition-all duration-200 ${darkMode
                        ? "bg-white/5 hover:bg-white/10 text-neutral-300 ring-1 ring-white/10"
                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600 ring-1 ring-black/5"
                        }`}
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.button>

                {/* Profile/Villa Menu */}
                <div className="relative z-50">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                        // onBlur removed to allow interaction with dropdown items
                        className={`relative w-10 h-10 rounded-full overflow-hidden ring-2 transition-all duration-200 ${darkMode
                            ? "ring-white/10 hover:ring-white/20"
                            : "ring-black/5 hover:ring-black/10"
                            }`}
                    >
                        {selectedVilla?.image ? (
                            <img
                                src={selectedVilla.image}
                                alt={selectedVilla.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600" />
                        )}
                    </motion.button>

                    <AnimatePresence>
                        {profileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className={`absolute right-0 top-full mt-3 w-64 rounded-2xl shadow-2xl border p-2 overflow-hidden ${darkMode
                                    ? "bg-neutral-900 border-neutral-800"
                                    : "bg-white border-neutral-100"
                                    }`}
                            >
                                <div className={`px-3 py-2 border-b mb-2 ${darkMode ? "border-neutral-800" : "border-neutral-100"}`}>
                                    <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-neutral-900"}`}>Admin</p>
                                    <p className={`text-xs ${darkMode ? "text-neutral-400" : "text-neutral-500"}`}>
                                        admin@10poolvilla.com
                                    </p>
                                </div>

                                {/* Villa Selection */}
                                <div className="mb-2">
                                    <p className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-neutral-500" : "text-neutral-400"}`}>
                                        Switch Property
                                    </p>
                                    {villas.map((villa) => (
                                        <button
                                            key={villa.id}
                                            onClick={() => {
                                                selectVilla(villa);
                                                setProfileMenuOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${selectedVilla?.id === villa.id
                                                ? (darkMode ? "bg-white/10 text-white" : "bg-neutral-100 text-neutral-900")
                                                : (darkMode ? "text-neutral-400 hover:text-white hover:bg-white/5" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50")
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${villa.id === "villa-3" ? "bg-emerald-500" : "bg-blue-500"}`} />
                                                {villa.name}
                                            </div>
                                            {selectedVilla?.id === villa.id && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>

                                <div className={`h-px my-2 ${darkMode ? "bg-neutral-800" : "bg-neutral-100"}`} />

                                <button
                                    onClick={() => {
                                        handleRefresh();
                                        setProfileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${darkMode
                                        ? "text-neutral-300 hover:bg-white/5 hover:text-white"
                                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                                        }`}
                                >
                                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                                    Refresh Data
                                </button>

                                <button
                                    onClick={logout}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mt-1 ${darkMode
                                        ? "text-red-400 hover:bg-red-500/10"
                                        : "text-red-500 hover:bg-red-50"
                                        }`}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
