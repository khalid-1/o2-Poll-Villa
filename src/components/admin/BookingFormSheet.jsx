import React, { useState, useEffect } from "react";
import { Loader2, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AdminDateRangePicker } from "@/components/shared/AdminDateRangePicker";
import { Portal } from "@/components/ui/portal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BookingFormSheet({
    isOpen,
    onClose,
    mode,
    initialData,
    onSubmit,
    darkMode,
    processing
}) {
    const [formData, setFormData] = useState({
        guest_name: "",
        guest_email: "",
        guest_phone: "",
        start_date: "",
        end_date: "",
        guest_count: 2,
        total_amount: 0,
        status: "inquiry",
        booking_source: "Direct",
        custom_source: ""
    });
    const [includeStripeFees, setIncludeStripeFees] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && initialData) {
                setFormData({
                    guest_name: initialData.guest_name || "",
                    guest_email: initialData.guest_email || "",
                    guest_phone: initialData.guest_phone || "",
                    start_date: initialData.start_date || "",
                    end_date: initialData.end_date || "",
                    guest_count: initialData.guest_count || 2,
                    total_amount: initialData.total_amount || 0,
                    status: initialData.status === "pending" ? "inquiry" : (initialData.status || "inquiry"),
                    booking_source: ["Direct", "Airbnb", "Booking.com"].includes(initialData.booking_source)
                        ? (initialData.booking_source || "Direct")
                        : (initialData.booking_source ? "Other" : "Direct"),
                    custom_source: ["Direct", "Airbnb", "Booking.com"].includes(initialData.booking_source)
                        ? ""
                        : (initialData.booking_source || "")
                });
                setIncludeStripeFees(false);
            } else {
                setFormData({
                    guest_name: "",
                    guest_email: "",
                    guest_phone: "",
                    start_date: "",
                    end_date: "",
                    guest_count: 2,
                    total_amount: 0,
                    status: "inquiry",
                    booking_source: "Direct",
                    custom_source: ""
                });
                setIncludeStripeFees(false);
            }
        }
    }, [isOpen, mode, initialData]);

    const roundCurrency = (value) => Math.round(value * 100) / 100;

    const addBookingSubtotal = formData.total_amount || 0;
    const addBookingFee = includeStripeFees ? roundCurrency(addBookingSubtotal * 0.05) : 0;
    const addBookingTotal = includeStripeFees
        ? roundCurrency(addBookingSubtotal + addBookingFee)
        : addBookingSubtotal;

    const handleSubmit = async () => {
        const submissionData = { ...formData };
        if (mode === "add" && includeStripeFees) {
            submissionData.total_amount = addBookingTotal;
        }

        // Handle Custom Source
        if (submissionData.booking_source === "Other") {
            submissionData.booking_source = submissionData.custom_source;
        }
        delete submissionData.custom_source;

        await onSubmit(submissionData);
    };

    const inputClass = cn(
        "h-14 text-[15px] px-4 rounded-2xl border shadow-sm transition-colors focus-visible:ring-1",
        darkMode
            ? "bg-neutral-900/60 border-neutral-700 text-white placeholder-neutral-500 focus-visible:ring-white/20 focus-visible:border-white"
            : "bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus-visible:ring-neutral-900/10 focus-visible:border-neutral-900"
    );
    const selectClass = cn(
        "flex h-14 w-full rounded-2xl border px-4 text-[15px] items-center shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1",
        darkMode
            ? "bg-neutral-900/60 border-neutral-700 text-white focus-visible:ring-white/20 focus-visible:border-white"
            : "bg-white border-neutral-200 text-neutral-900 focus-visible:ring-neutral-900/10 focus-visible:border-neutral-900"
    );

    // Check primary button class - keeping original logic
    const primaryButtonClass = darkMode
        ? "bg-white text-neutral-900 hover:bg-neutral-200"
        : "bg-neutral-900 text-white hover:bg-neutral-800";

    const addInputClass = inputClass;

    return (
        <AnimatePresence>
            {isOpen && (
                <Portal>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-[60]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.5 }}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100 || info.velocity.y > 500) {
                                onClose();
                            }
                        }}
                        className={`fixed bottom-0 left-0 right-0 rounded-t-3xl z-[60] max-h-[85vh] flex flex-col overflow-hidden pb-0 ${darkMode ? "bg-neutral-900 text-white" : "bg-white"}`}
                        style={{ touchAction: "none" }}
                    >
                        {/* Drag Handle */}
                        <div className={`flex justify-center py-3 cursor-grab active:cursor-grabbing sticky top-0 z-10 ${darkMode ? "bg-neutral-900" : "bg-white"}`}>
                            <div className={`w-10 h-1 rounded-full ${darkMode ? "bg-neutral-700" : "bg-neutral-300"}`} />
                        </div>

                        {/* Scrollable Content */}
                        <div className="px-5 pb-6 overflow-y-auto flex-1 min-h-0" style={{ WebkitOverflowScrolling: "touch" }}>
                            <h2 className="text-xl font-bold mb-4">
                                {mode === "add" ? "Add Booking" : "Edit Booking"}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <Input
                                        value={formData.guest_name}
                                        onChange={e => setFormData({ ...formData, guest_name: e.target.value })}
                                        className={mode === "add" ? addInputClass : inputClass}
                                        placeholder="Guest name"
                                        aria-label="Guest name"
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="email"
                                        value={formData.guest_email}
                                        onChange={e => setFormData({ ...formData, guest_email: e.target.value })}
                                        className={mode === "add" ? addInputClass : inputClass}
                                        placeholder="Email"
                                        aria-label="Email"
                                    />
                                </div>
                                <div>
                                    <Input
                                        value={formData.guest_phone}
                                        onChange={e => setFormData({ ...formData, guest_phone: e.target.value })}
                                        className={mode === "add" ? addInputClass : inputClass}
                                        placeholder="Phone"
                                        aria-label="Phone"
                                    />
                                </div>

                                {/* Date inputs using unified picker */}
                                <div>
                                    <div className="mb-4">
                                        <AdminDateRangePicker
                                            className="gap-3"
                                            dateRange={{
                                                from: formData.start_date ? new Date(formData.start_date) : undefined,
                                                to: formData.end_date ? new Date(formData.end_date) : undefined
                                            }}
                                            onDateChange={(range) => {
                                                setFormData({
                                                    ...formData,
                                                    start_date: range?.from ? format(range.from, 'yyyy-MM-dd') : '',
                                                    end_date: range?.to ? format(range.to, 'yyyy-MM-dd') : ''
                                                });
                                            }}
                                            darkMode={darkMode}
                                            allowPast={true}
                                            size="lg"
                                        />
                                    </div>

                                    <div className={mode === "edit" ? "grid gap-3 grid-cols-3" : "grid gap-4 grid-cols-1 sm:grid-cols-2"}>
                                        <div>
                                            {mode === "add" ? (
                                                <div className={cn(addInputClass, "flex items-center justify-between px-3")}>
                                                    <button
                                                        onClick={() => setFormData(prev => ({ ...prev, guest_count: Math.max(1, prev.guest_count - 1) }))}
                                                        className={cn("p-1 rounded-full hover:bg-neutral-100 disabled:opacity-30 transition-colors", darkMode ? "hover:bg-neutral-800" : "")}
                                                        disabled={formData.guest_count <= 1}
                                                        type="button"
                                                    >
                                                        <Minus className="w-4 h-4 cursor-pointer" />
                                                    </button>
                                                    <span className={cn("font-medium", darkMode ? "text-white" : "text-neutral-900")}>
                                                        {formData.guest_count} Guest{formData.guest_count > 1 ? 's' : ''}
                                                    </span>
                                                    <button
                                                        onClick={() => setFormData(prev => ({ ...prev, guest_count: Math.min(8, prev.guest_count + 1) }))}
                                                        className={cn("p-1 rounded-full hover:bg-neutral-100 disabled:opacity-30 transition-colors", darkMode ? "hover:bg-neutral-800" : "")}
                                                        disabled={formData.guest_count >= 8}
                                                        type="button"
                                                    >
                                                        <Plus className="w-4 h-4 cursor-pointer" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <select
                                                    value={formData.guest_count}
                                                    onChange={e => setFormData({ ...formData, guest_count: parseInt(e.target.value) || 1 })}
                                                    className={selectClass}
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                                        <option key={num} value={num} className={darkMode ? "bg-neutral-800" : "bg-white"}>{num} Guest{num > 1 ? 's' : ''}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>

                                        {mode === "edit" && (
                                            <div>
                                                <select
                                                    value={formData.status}
                                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                                    className={selectClass}
                                                >
                                                    <option value="inquiry" className={darkMode ? "bg-neutral-800" : "bg-white"}>Inquiry</option>
                                                    <option value="confirmed" className={darkMode ? "bg-neutral-800" : "bg-white"}>Confirmed</option>
                                                    <option value="cancelled" className={darkMode ? "bg-neutral-800" : "bg-white"}>Cancelled</option>
                                                </select>
                                            </div>
                                        )}

                                        <div>
                                            <select
                                                value={formData.booking_source}
                                                onChange={e => setFormData({ ...formData, booking_source: e.target.value })}
                                                className={selectClass}
                                            >
                                                <option value="Direct" className={darkMode ? "bg-neutral-800" : "bg-white"}>Direct</option>
                                                <option value="Airbnb" className={darkMode ? "bg-neutral-800" : "bg-white"}>Airbnb</option>
                                                <option value="Booking.com" className={darkMode ? "bg-neutral-800" : "bg-white"}>Booking.com</option>
                                                <option value="Other" className={darkMode ? "bg-neutral-800" : "bg-white"}>Other</option>
                                            </select>
                                        </div>

                                        {formData.booking_source === "Other" && (
                                            <div className={mode === "edit" ? "col-span-3" : "col-span-2"}>
                                                <Input
                                                    value={formData.custom_source}
                                                    onChange={e => setFormData({ ...formData, custom_source: e.target.value })}
                                                    className={mode === "add" ? addInputClass : inputClass}
                                                    placeholder="Specify Source (e.g. Agoda, Walk-in)"
                                                />
                                            </div>
                                        )}

                                        <div className={mode === "edit" ? "col-span-3" : ""}>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    value={formData.total_amount || ""}
                                                    onChange={e => setFormData({ ...formData, total_amount: parseFloat(e.target.value) || 0 })}
                                                    className={cn(mode === "add" ? addInputClass : inputClass, mode === "add" && "pr-36")}
                                                    placeholder="Amount (AED)"
                                                    aria-label="Amount (AED)"
                                                />
                                                {mode === "add" && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                        <div className={`h-6 w-px ${darkMode ? "bg-neutral-700" : "bg-neutral-200"}`} />
                                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                                            <input
                                                                type="checkbox"
                                                                checked={includeStripeFees}
                                                                onChange={(e) => setIncludeStripeFees(e.target.checked)}
                                                                className={`w-4 h-4 rounded border ${darkMode ? "border-neutral-600 bg-neutral-800" : "border-neutral-300"}`}
                                                            />
                                                            <span className={`text-[13px] font-medium ${darkMode ? "text-neutral-300" : "text-neutral-600"}`}>
                                                                + 5% VAT
                                                            </span>
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                            {mode === "add" && includeStripeFees && addBookingSubtotal > 0 && (
                                                <div className="mt-2 text-right">
                                                    <p className={`text-xs ${darkMode ? "text-neutral-400" : "text-neutral-500"}`}>
                                                        Total to charge: <span className={darkMode ? "text-white font-medium" : "text-neutral-900 font-medium"}>{addBookingTotal.toLocaleString()} AED</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div className={cn("px-5 py-4 border-t pb-safe mt-auto", darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-100")}>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className={`flex-1 ${mode === "add" ? "h-14 rounded-2xl" : "h-12"} ${darkMode
                                        ? "bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700"
                                        : "bg-white border-neutral-200 hover:bg-neutral-50"}`}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className={cn("flex-1 text-base font-medium", mode === "add" ? "h-14 rounded-2xl" : "h-12", primaryButtonClass)}
                                >
                                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === "add" ? "Add Booking" : "Save")}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </Portal>
            )}
        </AnimatePresence>
    );
}
