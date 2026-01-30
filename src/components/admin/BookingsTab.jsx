import React, { useState } from "react";
import { format, differenceInDays } from "date-fns";
import {
    Loader2,
    Calendar,
    CheckCircle2,
    Minus,
    Trash2,
    Filter,
    ArrowUpRight,
    Check,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function BookingsTab({ bookings, onRefresh, darkMode }) {
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBookings, setSelectedBookings] = useState([]);
    const [selectionMode, setSelectionMode] = useState(false);

    const cardBase = cn(
        "rounded-3xl border shadow-sm backdrop-blur transition-all duration-200 overflow-hidden active:scale-[0.99]",
        darkMode
            ? "bg-neutral-900/70 border-neutral-800/80 text-neutral-100 shadow-black/30"
            : "bg-white/90 border-neutral-200 text-neutral-900"
    );

    const panelBase = cn(
        "rounded-3xl border p-4 shadow-sm backdrop-blur",
        darkMode
            ? "bg-neutral-900/70 border-neutral-800/80 text-neutral-100 shadow-black/30"
            : "bg-white/90 border-neutral-200 text-neutral-900"
    );

    const filteredBookings = bookings.filter(b => {
        const normalizedStatus = b.status === "pending" ? "inquiry" : b.status;
        if (filter === "all") return true;
        if (filter === "inquiry") return b.status === "inquiry" || b.status === "pending";
        if (filter === "confirmed") return normalizedStatus === "confirmed";
        if (filter === "cancelled") return normalizedStatus === "cancelled";
        return true;
    });

    const visibleBookings = filteredBookings.filter((booking) => {
        const name = (booking.customerName || "").toLowerCase();
        // const email = (booking.guest_email || "").toLowerCase();
        const matchesSearch = searchQuery.toLowerCase()
            ? (name.includes(searchQuery.toLowerCase()))
            : true;

        if (!matchesSearch) return false;
        return true;
    });

    return (
        <div className="p-4 pt-3 space-y-3 pb-32">
            <div className={panelBase}>
                {/* Filter Pills */}
                <div className={cn("grid grid-cols-4 p-1 rounded-xl", darkMode ? "bg-neutral-900/50" : "bg-neutral-100/50")}>
                    {["all", "inquiry", "confirmed", "cancelled"].map((f) => {
                        const isSelected = filter === f;
                        return (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "relative flex items-center justify-center py-2 rounded-lg text-xs font-medium transition-colors duration-200",
                                    isSelected
                                        ? (darkMode ? "text-white" : "text-neutral-900")
                                        : (darkMode ? "text-neutral-400 hover:text-neutral-200" : "text-neutral-500 hover:text-neutral-700")
                                )}
                            >
                                {isSelected && (
                                    <motion.div
                                        layoutId="activeFilter"
                                        className={cn(
                                            "absolute inset-0 rounded-lg shadow-sm",
                                            darkMode ? "bg-neutral-800" : "bg-white"
                                        )}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">
                                    {f === "inquiry" ? "Inquiry" : f.charAt(0).toUpperCase() + f.slice(1)}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-3 mt-3">
                    <div className="flex items-center gap-2">
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search guest"
                            className={cn(
                                "flex-1 h-10 px-3 rounded-xl border bg-transparent",
                                darkMode ? "text-white border-neutral-800 placeholder:text-neutral-500" : "text-gray-900 border-gray-200"
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-3">
                {visibleBookings.map((booking) => {
                    const bookingId = booking._id || booking.id;
                    const normalizedStatus = booking.status === "pending" ? "inquiry" : booking.status;
                    const statusLabel = normalizedStatus
                        ? normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)
                        : "Unknown";
                    const isConfirmed = booking.status === "confirmed";
                    const nights = differenceInDays(new Date(booking.endDate), new Date(booking.startDate));

                    return (
                        <div
                            key={bookingId}
                            className={cn(
                                "group relative",
                                cardBase,
                                selectedBookings.includes(bookingId) && (darkMode ? "ring-2 ring-white/20 border-white/40" : "ring-2 ring-black/5 border-black/20")
                            )}
                        >
                            <div className="flex items-stretch p-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 pr-2">
                                        <h3 className={cn("font-semibold truncate", darkMode ? "text-neutral-200" : "text-neutral-900")}>{booking.customerName}</h3>
                                    </div>
                                    <p className={cn("text-sm mt-1", darkMode ? "text-neutral-400" : "text-neutral-500")}>
                                        <span className="font-mono text-xs opacity-60">#{String(bookingId).slice(0, 8).toUpperCase()}</span>
                                        <span className="mx-1.5">·</span>
                                        {format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d')} · {nights} nights
                                    </p>
                                </div>
                                <div className="flex flex-col items-end justify-between">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-bold leading-none",
                                        isConfirmed
                                            ? (darkMode ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "bg-teal-50 text-teal-700 border border-teal-200")
                                            : normalizedStatus === "inquiry"
                                                ? (darkMode ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-amber-50 text-amber-700 border border-amber-200")
                                                : normalizedStatus === "cancelled"
                                                    ? (darkMode ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-red-50 text-red-700 border border-red-200")
                                                    : (darkMode ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-blue-50 text-blue-700 border border-blue-200")
                                    )}>
                                        {statusLabel}
                                    </span>
                                    {(booking.totalAmount !== null && booking.totalAmount !== undefined) && (
                                        <div className={cn("flex items-baseline gap-0.5", darkMode ? "text-white" : "text-neutral-900")}>
                                            <span className="text-lg font-bold tracking-tight">
                                                {booking.totalAmount.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] font-medium opacity-60 translate-y-[-1px]">AED</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {visibleBookings.length === 0 && (
                    <div className="text-center py-16">
                        <Calendar className={cn("w-12 h-12 mx-auto mb-3", darkMode ? "text-neutral-700" : "text-neutral-300")} />
                        <p className={darkMode ? "text-neutral-500" : "text-neutral-500"}>No bookings found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
