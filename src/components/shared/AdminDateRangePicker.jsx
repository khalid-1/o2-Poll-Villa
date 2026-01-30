import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AirbnbCalendar } from "./AirbnbCalendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function AdminDateRangePicker({
    className,
    dateRange,
    onDateChange,
    darkMode = false,
    allowPast = false,
    size = "md",
}) {
    const [focusedInput, setFocusedInput] = React.useState("startDate");
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSelect = (range) => {
        onDateChange(range);

        // Auto-switch focus or close
        if (focusedInput === "startDate" && range?.from) {
            setFocusedInput("endDate");
        } else if (focusedInput === "endDate" && range?.to) {
            setFocusedInput(null);
            // Close popover logic if needed - keeping it open to verify date
        }
    };

    return (
        <div className={cn("grid gap-2", className)}>
            {(() => {
                const tabPadding = size === "lg" ? "p-4" : "p-3";
                const valueClass = size === "lg" ? "text-base font-semibold" : "text-sm font-semibold";
                const labelClass = size === "lg" ? "text-xs font-medium uppercase tracking-wider mb-1" : "text-xs font-medium uppercase tracking-wider mb-1";
                return (
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                            <div className="flex gap-4">
                                {/* Check-in Tab */}
                                <div
                                    onClick={() => {
                                        setFocusedInput("startDate");
                                        setIsOpen(true);
                                    }}
                                    className={cn(
                                        "flex-1 rounded-xl border cursor-pointer transition-all",
                                        tabPadding,
                                        focusedInput === "startDate" && isOpen
                                            ? (darkMode ? "bg-neutral-900/60 border-white ring-1 ring-white/20" : "bg-white border-neutral-900 ring-1 ring-neutral-900/10")
                                            : (darkMode ? "bg-neutral-900/60 border-neutral-700 hover:border-neutral-500" : "bg-white border-neutral-200 hover:border-neutral-300")
                                    )}
                                >
                                    <div className={cn(labelClass, darkMode ? "text-neutral-400" : "text-neutral-500")}>
                                        Check-in
                                    </div>
                                    <div className={cn(valueClass, darkMode ? "text-white" : "text-stone-900")}>
                                        {dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "Select Date"}
                                    </div>
                                </div>

                                {/* Check-out Tab */}
                                <div
                                    onClick={() => {
                                        setFocusedInput("endDate");
                                        setIsOpen(true);
                                    }}
                                    className={cn(
                                        "flex-1 rounded-xl border cursor-pointer transition-all",
                                        tabPadding,
                                        focusedInput === "endDate" && isOpen
                                            ? (darkMode ? "bg-neutral-900/60 border-white ring-1 ring-white/20" : "bg-white border-neutral-900 ring-1 ring-neutral-900/10")
                                            : (darkMode ? "bg-neutral-900/60 border-neutral-700 hover:border-neutral-500" : "bg-white border-neutral-200 hover:border-neutral-300")
                                    )}
                                >
                                    <div className={cn(labelClass, darkMode ? "text-neutral-400" : "text-neutral-500")}>
                                        Check-out
                                    </div>
                                    <div className={cn(valueClass, darkMode ? "text-white" : "text-stone-900")}>
                                        {dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "Select Date"}
                                    </div>
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-[calc(100vw-32px)] sm:w-auto p-0 border-none shadow-xl rounded-xl overflow-hidden z-[70]"
                            align="start"
                            sideOffset={8}
                        >
                            <div className="bg-white p-4 max-h-[350px] overflow-y-auto overscroll-contain">
                                <AirbnbCalendar
                                    blockedDates={[]}
                                    selected={dateRange}
                                    onSelect={handleSelect}
                                    focusedInput={focusedInput}
                                    allowPast={allowPast}
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                );
            })()}
        </div>
    );
}
