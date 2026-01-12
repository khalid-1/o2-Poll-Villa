import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';

const BookingCalendar = ({ bookedDatesRaw = [], villaName = "O2 Pool Villa" }) => {
    const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
    const [selectedRange, setSelectedRange] = useState({ from: undefined, to: undefined });
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Convert raw booked dates to Date objects
    const blockedDates = useMemo(() =>
        bookedDatesRaw.map(d => startOfDay(new Date(d)))
        , [bookedDatesRaw]);

    const isDateBlocked = useCallback((date) => {
        const dateNormalized = startOfDay(date);
        return blockedDates.some(b => isSameDay(b, dateNormalized));
    }, [blockedDates]);

    const isCheckoutOnly = useCallback((date) => {
        if (!isDateBlocked(date)) return false;
        const previousDay = addDays(date, -1);
        return !isDateBlocked(previousDay) && !isBefore(previousDay, startOfDay(new Date()));
    }, [isDateBlocked]);

    const handleDayClick = (day) => {
        const dayNormalized = startOfDay(day);
        if (isBefore(dayNormalized, startOfDay(new Date()))) return;

        const isBlocked = isDateBlocked(day);
        const isCheckoutOnlyDate = isCheckoutOnly(day);

        if (selectedRange.from && !selectedRange.to) {
            // Selecting end date
            if (isBefore(dayNormalized, startOfDay(selectedRange.from))) {
                if (isBlocked) return;
                setSelectedRange({ from: day, to: undefined });
            } else if (isSameDay(dayNormalized, startOfDay(selectedRange.from))) {
                setSelectedRange({ from: undefined, to: undefined });
            } else {
                // Check for blocked dates in range
                let dayToCheck = addDays(selectedRange.from, 1);
                let hasBlockedInRange = false;
                while (isBefore(dayToCheck, dayNormalized)) {
                    if (isDateBlocked(dayToCheck)) {
                        hasBlockedInRange = true;
                        break;
                    }
                    dayToCheck = addDays(dayToCheck, 1);
                }

                if (!hasBlockedInRange && (!isBlocked || isCheckoutOnlyDate)) {
                    setSelectedRange({ from: selectedRange.from, to: day });
                } else if (!isBlocked) {
                    setSelectedRange({ from: day, to: undefined });
                }
            }
        } else {
            if (isBlocked) return;
            setSelectedRange({ from: day, to: undefined });
        }
    };

    const renderMonth = (monthDate, showHeader = true) => {
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="w-full">
                {showHeader && (
                    <div className="text-lg font-bold text-gray-900 mb-6 text-center">
                        {format(monthDate, "MMMM yyyy")}
                    </div>
                )}
                <div className="grid grid-cols-7 mb-4">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                        <div key={d} className="text-[11px] font-bold text-gray-400 text-center uppercase tracking-wider">
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                    {calendarDays.map((day, idx) => {
                        const isCurrentMonth = isSameDay(day, monthStart) || (isAfter(day, monthStart) && isBefore(day, monthEnd)) || isSameDay(day, monthEnd);
                        if (!isCurrentMonth) return <div key={idx} className="h-10 w-full" />;

                        const dayNormalized = startOfDay(day);
                        const isBlocked = isDateBlocked(day);
                        const isPast = isBefore(dayNormalized, startOfDay(new Date()));
                        const isCheckoutOnlyDate = isCheckoutOnly(day);
                        const isSelectingEndDate = !!(selectedRange.from && !selectedRange.to);
                        const isDisabled = isPast || (isBlocked && (!isCheckoutOnlyDate || !isSelectingEndDate));

                        const isSelectedStart = selectedRange.from && isSameDay(dayNormalized, startOfDay(selectedRange.from));
                        const isSelectedEnd = selectedRange.to && isSameDay(dayNormalized, startOfDay(selectedRange.to));
                        const isInRange = selectedRange.from && selectedRange.to && isAfter(dayNormalized, startOfDay(selectedRange.from)) && isBefore(dayNormalized, startOfDay(selectedRange.to));

                        let containerClass = "relative h-11 w-full flex items-center justify-center";
                        if (isInRange) containerClass += " bg-cyan-50";
                        else if (isSelectedStart && selectedRange.to) containerClass += " bg-gradient-to-r from-transparent from-50% to-cyan-50 to-50%";
                        else if (isSelectedEnd && selectedRange.from) containerClass += " bg-gradient-to-l from-transparent from-50% to-cyan-50 to-50%";

                        let buttonClass = "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium relative z-10 transition-all border border-transparent";
                        if (isDisabled) {
                            buttonClass += isBlocked && !isCheckoutOnlyDate ? " text-red-400 bg-red-50/50 cursor-not-allowed line-through" : " text-gray-200 cursor-not-allowed";
                        } else if (isSelectedStart || isSelectedEnd) {
                            buttonClass += " bg-gray-900 text-white shadow-lg font-bold";
                        } else if (isInRange) {
                            buttonClass += " text-cyan-700 hover:bg-cyan-100";
                        } else if (isCheckoutOnlyDate && isSelectingEndDate) {
                            buttonClass += " text-gray-600 bg-gray-50 border-dashed border-gray-300 hover:border-gray-900";
                        } else {
                            buttonClass += " hover:border-gray-900 hover:bg-gray-50 text-gray-700";
                            if (isSameDay(day, new Date())) buttonClass += " font-bold after:content-[''] after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-cyan-500 after:rounded-full";
                        }

                        return (
                            <div key={idx} className={containerClass}>
                                <button className={buttonClass} onClick={() => handleDayClick(day)} disabled={isDisabled}>
                                    {format(day, "d")}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-premium p-6 md:p-12 border border-blue-50/50">
                {isMobile ? (
                    <div className="space-y-12">
                        <div className="flex justify-between items-center mb-6">
                            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-50 rounded-full">
                                <ChevronLeft size={24} />
                            </button>
                            <span className="font-bold text-lg">{format(currentMonth, "MMMM yyyy")}</span>
                            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-50 rounded-full">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                        {renderMonth(currentMonth, false)}
                    </div>
                ) : (
                    <div className="relative">
                        <div className="absolute top-0 inset-x-0 flex justify-between px-2">
                            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                        <div className="flex gap-16 justify-center">
                            <div className="flex-1 max-w-sm">{renderMonth(currentMonth)}</div>
                            <div className="flex-1 max-w-sm">{renderMonth(addMonths(currentMonth, 1))}</div>
                        </div>
                    </div>
                )}

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-white border border-gray-300"></div>
                            <span>Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-50 border border-red-100 line-through text-red-400"></div>
                            <span>Booked</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-900 shadow-sm"></div>
                            <span>Selected</span>
                        </div>
                    </div>

                    {selectedRange.from && (
                        <div className="bg-cyan-50 border border-cyan-100/50 px-6 py-3 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="text-cyan-800 font-bold flex items-center gap-2">
                                <Calendar size={16} />
                                {format(selectedRange.from, "MMM d")}
                                {selectedRange.to ? ` — ${format(selectedRange.to, "MMM d")}` : " — Select end date"}
                            </div>
                            {selectedRange.to && (
                                <button onClick={() => setSelectedRange({ from: undefined, to: undefined })} className="p-1 hover:bg-cyan-100 rounded-full transition-colors text-cyan-600">
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingCalendar;
