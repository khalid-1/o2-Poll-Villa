import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    addDays,
    format,
    isSameDay,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    addMonths,
    subMonths,
    isBefore,
    isAfter,
    startOfDay
} from "date-fns";
import { cn } from "@/lib/utils";

export function AirbnbCalendar({
    className,
    blockedDates = [],
    selected,
    onSelect,
    viewMode,
    numberOfMonths = 2,
    allowPast = false
}) {
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth < 640 : true
    );

    // Find first month with available dates
    const findFirstAvailableMonth = useCallback(() => {
        const today = startOfDay(new Date());

        for (let i = 0; i < 12; i++) {
            const month = addMonths(startOfMonth(new Date()), i);
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(month);

            // Check each day in the month
            const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
            const hasAvailableDay = days.some(day => {
                if (!allowPast && isBefore(day, today)) return false; // Skip past days
                const isBlocked = blockedDates.some(b => {
                    if (!b) return false;
                    try {
                        const blockedDate = b instanceof Date ? b : new Date(b);
                        if (isNaN(blockedDate.getTime())) return false;
                        return startOfDay(blockedDate).getTime() === startOfDay(day).getTime();
                    } catch { return false; }
                });
                return !isBlocked;
            });

            if (hasAvailableDay) return month;
        }
        return startOfMonth(new Date()); // Fallback to current month
    }, [blockedDates, allowPast]);

    const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));

    // Set initial month to first available when blockedDates load
    useEffect(() => {
        if (blockedDates.length > 0) {
            setCurrentMonth(findFirstAvailableMonth());
        }
    }, [blockedDates, findFirstAvailableMonth]);

    // Detect mobile on mount
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const nextMonth = addMonths(currentMonth, 1);

    // Helper: Check if a specific date is blocked
    const isDateBlocked = useCallback((date) => {
        const dateNormalized = startOfDay(date);
        return blockedDates.some(b => {
            if (!b) return false;
            try {
                const blockedDate = b instanceof Date ? b : new Date(b);
                if (isNaN(blockedDate.getTime())) return false;
                return startOfDay(blockedDate).getTime() === dateNormalized.getTime();
            } catch { return false; }
        });
    }, [blockedDates]);

    // Helper: Check if a date is "checkout only" (blocked but previous day is available)
    // This allows guests to checkout on a blocked date if they check in before it
    const isCheckoutOnly = useCallback((date) => {
        if (!isDateBlocked(date)) return false;
        const previousDay = addDays(date, -1);
        const isPreviousDayPast = isBefore(previousDay, startOfDay(new Date()));
        return !isDateBlocked(previousDay) && (allowPast || !isPreviousDayPast);
    }, [isDateBlocked, allowPast]);

    // Calculate max end date: first blocked date after selected start (exclusive for regular blocked, inclusive for checkout-only)
    const maxEndDate = useMemo(() => {
        if (!selected?.from || selected?.to) return null;
        const startDate = startOfDay(selected.from);

        // Look up to 365 days ahead to find next blocked date
        for (let i = 1; i <= 365; i++) {
            const checkDate = addDays(startDate, i);
            if (isDateBlocked(checkDate)) {
                // This blocked date can be selected as checkout (guests leave on this day)
                return checkDate;
            }
        }
        return null;
    }, [selected?.from, selected?.to, isDateBlocked]);

    // Generate 12 months ahead for mobile scrollable view, starting from first available
    const mobileMonths = useMemo(() => {
        const months = [];
        const startMonth = findFirstAvailableMonth();
        for (let i = 0; i < 12; i++) {
            months.push(addMonths(startMonth, i));
        }
        return months;
    }, [findFirstAvailableMonth]);

    const handlePreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
    const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

    const handleDayClick = (day) => {
        if (!onSelect) return;

        const dayNormalized = startOfDay(day);
        const isPast = isBefore(dayNormalized, startOfDay(new Date()));
        if (!allowPast && isPast) return;

        const isBlocked = isDateBlocked(day);
        const isCheckoutOnlyDate = isCheckoutOnly(day);

        if (selected?.from && !selected.to) {
            // We're selecting an end date
            if (isBefore(dayNormalized, startOfDay(selected.from))) {
                // Clicked before start: start new selection if it's not blocked
                if (isBlocked) return;
                onSelect({ from: day, to: undefined });
            } else if (isSameDay(dayNormalized, startOfDay(selected.from))) {
                // Same day clicked twice - do nothing
            } else {
                // Check if this is a valid end date (checkout-only blocked date is valid)
                const canBeEndDate = !isBlocked || isCheckoutOnlyDate;
                const isWithinMaxEnd = !maxEndDate || !isAfter(dayNormalized, startOfDay(maxEndDate));

                // Check if there are any blocked dates in the range (excluding the checkout day)
                const startDate = startOfDay(selected.from);
                let hasBlockedInRange = false;
                for (let i = 1; i < 365; i++) {
                    const checkDate = addDays(startDate, i);
                    if (isSameDay(checkDate, dayNormalized)) break; // Reached end date
                    if (isDateBlocked(checkDate)) {
                        hasBlockedInRange = true;
                        break;
                    }
                }

                if (canBeEndDate && isWithinMaxEnd && !hasBlockedInRange) {
                    // Valid end date selection
                    onSelect({ from: selected.from, to: day });
                } else if (!isBlocked) {
                    // Not a valid end date, but it's not blocked - start new selection
                    onSelect({ from: day, to: undefined });
                }
                // If it's a blocked date outside valid range, just ignore
            }
        } else {
            // Start new selection - can't start on a blocked date
            if (isBlocked) return;
            onSelect({ from: day, to: undefined });
        }
    };

    const renderMonth = (monthDate, showHeader = true) => {
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="w-full relative z-10">
                {showHeader && (
                    <div className="text-base sm:text-lg font-bold text-center mb-4 text-stone-800">
                        {format(monthDate, "MMMM yyyy")}
                    </div>
                )}

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2">
                    {weekDays.map(d => (
                        <div key={d} className="text-[0.7rem] font-bold text-stone-500 text-center">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-y-1 relative">
                    {calendarDays.map((dayItem, idx) => {
                        // Hide days not in current month (Airbnb style clean look)
                        const isCurrentMonth = isSameDay(dayItem, monthStart) || (isAfter(dayItem, monthStart) && isBefore(dayItem, monthEnd)) || isSameDay(dayItem, monthEnd);

                        // Main padding container for 1:1 aspect ratio
                        if (!isCurrentMonth) {
                            return <div key={idx} className="h-10 sm:h-11 w-full" />;
                        }

                        // Normalize dates to compare only the date part (ignore time)
                        const dayItemNormalized = startOfDay(dayItem);
                        const isBlocked = isDateBlocked(dayItem);
                        const isPast = isBefore(dayItemNormalized, startOfDay(new Date()));
                        const isCheckoutOnlyDate = isCheckoutOnly(dayItem);

                        // Determine if this date should be disabled
                        // Checkout-only dates are enabled when selecting end date
                        const isSelectingEndDate = !!(selected?.from && !selected.to);
                        const isAfterMaxEnd = !!(maxEndDate && isAfter(dayItemNormalized, startOfDay(maxEndDate)));

                        // A date is disabled if:
                        // 1. It's in the past, OR
                        // 2. It's blocked AND (not checkout-only OR we're not selecting end date OR it's after maxEndDate)
                        const isDisabled = (!allowPast && isPast) || (isBlocked && (!isCheckoutOnlyDate || !isSelectingEndDate || isAfterMaxEnd));

                        const isSelectedStart = selected?.from && isSameDay(dayItemNormalized, startOfDay(selected.from));
                        const isSelectedEnd = selected?.to && isSameDay(dayItemNormalized, startOfDay(selected.to));
                        const isInRange = selected?.from && selected?.to && isAfter(dayItemNormalized, startOfDay(selected.from)) && isBefore(dayItemNormalized, startOfDay(selected.to));

                        // Container Styles (The Strip)
                        let containerClass = "relative h-10 sm:h-11 w-full flex items-center justify-center";
                        if (isInRange) {
                            containerClass += " bg-stone-100";
                        } else if (isSelectedStart && selected?.to) {
                            // Start date with range: gradient to right
                            containerClass += " bg-gradient-to-r from-transparent from-50% to-stone-100 to-50%";
                        } else if (isSelectedEnd && selected?.from) {
                            // End date with range: gradient to left
                            containerClass += " bg-gradient-to-l from-transparent from-50% to-stone-100 to-50%";
                        }

                        // Button Styles (The Circle/Text)
                        let buttonClass = "w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm font-medium relative z-20 transition-all border border-transparent";
                        let buttonTitle = "";

                        if (isDisabled) {
                            if (isBlocked && !isCheckoutOnlyDate) {
                                // Fully blocked - strikethrough
                                buttonClass += " text-stone-400 bg-stone-200 cursor-not-allowed line-through decoration-stone-400";
                            } else if (isCheckoutOnlyDate && !isSelectingEndDate) {
                                // Checkout-only but not selecting end date - show as unavailable with tooltip
                                buttonClass += " text-stone-400 bg-stone-100 cursor-not-allowed";
                                buttonTitle = "Checkout only";
                            } else {
                                // Past date
                                buttonClass += " text-stone-300 cursor-not-allowed";
                            }
                        } else if (isSelectedStart || isSelectedEnd) {
                            buttonClass += " bg-stone-900 text-white shadow-md scale-100 font-semibold";
                        } else if (isInRange) {
                            buttonClass += " text-stone-900 hover:bg-stone-200 hover:rounded-full rounded-full";
                        } else if (isCheckoutOnlyDate && isSelectingEndDate && !isAfterMaxEnd) {
                            // Checkout-only date: subtle style with tooltip
                            buttonClass += " text-stone-500 bg-stone-50 hover:border-stone-800 hover:bg-stone-100 border-dashed border-stone-300";
                            buttonTitle = "Checkout only";
                        } else {
                            // Default selectable
                            buttonClass += " hover:border-stone-800 hover:bg-stone-50 active:bg-stone-100";
                            if (isSameDay(dayItem, new Date())) {
                                // Today dot
                                buttonClass += " font-bold after:content-[''] after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-current after:rounded-full";
                            }
                        }

                        return (
                            <div key={idx} className={containerClass}>
                                <button
                                    className={buttonClass}
                                    onClick={() => handleDayClick(dayItem)}
                                    disabled={isDisabled}
                                    title={buttonTitle || undefined}
                                >
                                    {format(dayItem, "d")}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={cn("w-full max-w-[850px] mx-auto select-none", className)}>
            {/* Mobile: Vertical scrolling months (Airbnb-style) */}
            {isMobile && viewMode !== "paged" ? (
                <div className="pb-4 -mx-2">
                    <div className="space-y-10 px-4">
                        {mobileMonths.map((month, idx) => (
                            <div key={idx}>
                                {renderMonth(month, true)}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Desktop: Side-by-side with navigation arrows */
                <div className={cn("relative min-h-[380px]", numberOfMonths === 1 && "w-fit mx-auto min-w-[350px]")}>
                    {/* Navigation Buttons - Absolute positioned relative to content area */}
                    <div className="absolute top-1 left-0 z-20">
                        <button onClick={handlePreviousMonth} className="p-2 rounded-full hover:bg-stone-100 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-stone-600" />
                        </button>
                    </div>
                    <div className="absolute top-1 right-0 z-20">
                        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-stone-100 transition-colors">
                            <ChevronRight className="w-5 h-5 text-stone-600" />
                        </button>
                    </div>

                    {/* Double Calendar Grid */}
                    <div className={cn("flex flex-row justify-center", numberOfMonths > 1 ? "gap-16 px-6" : "px-0")}>
                        <div className="w-full max-w-[390px]">
                            {renderMonth(currentMonth)}
                        </div>
                        {numberOfMonths > 1 && (
                            <div className="w-full max-w-[390px]">
                                {renderMonth(nextMonth)}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
