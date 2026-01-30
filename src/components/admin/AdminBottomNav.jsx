import React from "react";
import { Calendar, Plus, Tag, Image as ImageIcon, LayoutDashboard } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export function AdminBottomNav({
    activeTab,
    setActiveTab,
    onAddClick,
    darkMode
}) {
    const handleTabClick = (tabId) => {
        if (tabId === activeTab) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        setActiveTab(tabId);
    };

    const tabs = [
        { id: "stats", icon: LayoutDashboard, label: "Dashboard" },
        { id: "bookings", icon: Calendar, label: "Bookings" },
        { id: "add", icon: Plus, label: "Add", isAction: true },
        { id: "pricing", icon: Tag, label: "Pricing" },
        { id: "gallery", icon: ImageIcon, label: "Gallery" },
    ];

    return (
        <nav
            className={cn(
                "fixed bottom-0 left-0 right-0 z-30 pb-safe pt-2 border-t backdrop-blur-xl transition-all duration-300",
                darkMode
                    ? "bg-neutral-900/80 border-neutral-800/80"
                    : "bg-white/80 border-neutral-200"
            )}
        >
            <div className="flex items-center justify-around px-2 pb-4">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const isAction = tab.isAction;

                    if (isAction) {
                        return (
                            <button
                                key={tab.id}
                                onClick={onAddClick}
                                className="group flex flex-col items-center justify-center -mt-8 active:scale-95 transition-transform"
                                aria-label="Add Booking"
                            >
                                <div className={cn(
                                    "w-14 h-14 rounded-full flex items-center justify-center shadow-lg ring-4 transition-all duration-300",
                                    darkMode
                                        ? "bg-white text-black ring-neutral-900 group-hover:bg-neutral-200"
                                        : "bg-black text-white ring-white group-hover:bg-neutral-800"
                                )}>
                                    <Plus className="w-7 h-7" strokeWidth={2.5} />
                                </div>
                            </button>
                        );
                    }

                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className="flex-1 flex flex-col items-center justify-center py-2 gap-1 relative min-h-[3.5rem]"
                            aria-label={tab.label}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId="activeTab"
                                    className={cn(
                                        "absolute -top-2 h-1 w-8 rounded-full",
                                        darkMode ? "bg-white" : "bg-black"
                                    )}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <div className="relative">
                                <tab.icon
                                    className={cn(
                                        "w-6 h-6 transition-colors duration-300",
                                        isActive
                                            ? (darkMode ? "text-white" : "text-black")
                                            : "text-neutral-400"
                                    )}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
