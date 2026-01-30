import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AdminBottomNav } from "../../components/admin/AdminBottomNav";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { BookingFormSheet } from "../../components/admin/BookingFormSheet";
import { InstallPrompt } from "../../components/admin/InstallPrompt";
import { DashboardTab } from "../../components/admin/DashboardTab";
import { useAdmin } from "../../layouts/AdminLayout";
import { BookingsTab } from "../../components/admin/BookingsTab";
import { PricingTab } from "../../components/admin/PricingTab";
import { GalleryTab } from "../../components/admin/GalleryTab";

// Import `api` from the generated code, usually:
// import { api } from "../../convex/_generated/api"; 
// But since I'm not sure of the exact setup, I will assume it's available or user needs to fix import.
// Actually, standard is import { api } from "../../../convex/_generated/api";
// Let's adjust import.

export default function AdminDashboard() {
    const { selectedVilla } = useAdmin();
    const [activeTab, setActiveTab] = useState("stats");
    const [darkMode, setDarkMode] = useState(true);
    const [showInstallPrompt, setShowInstallPrompt] = useState(true);

    const bookings = useQuery(api.admin.getBookings,
        selectedVilla ? { villaIdentifier: selectedVilla.id } : "skip"
    ) || [];

    const loading = !bookings;

    const renderContent = () => {
        switch (activeTab) {
            case "stats":
                return <DashboardTab bookings={bookings} loading={loading} darkMode={darkMode} villaName={selectedVilla?.name} />;
            case "bookings":
                return <BookingsTab bookings={bookings} onRefresh={() => { }} darkMode={darkMode} />;
            case "pricing":
                return <PricingTab darkMode={darkMode} />;
            case "gallery":
                return <GalleryTab darkMode={darkMode} />;
            default:
                return null;
        }
    };

    const createBookingMutation = useMutation(api.admin.createBooking);
    const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleAddBooking = async (data) => {
        if (!selectedVilla) return;
        setProcessing(true);
        try {
            await createBookingMutation({
                villaIdentifier: selectedVilla.id, // Use identifier from local config
                guest_name: data.guest_name,
                guest_email: data.guest_email,
                guest_phone: data.guest_phone,
                guest_count: data.guest_count,
                startDate: new Date(data.start_date).getTime(),
                endDate: new Date(data.end_date).getTime(),
                total_amount: data.total_amount,
                status: data.status,
                booking_source: data.booking_source,
            });
            setIsBookingSheetOpen(false);
        } catch (error) {
            console.error("Failed to create booking:", error);
            // toast.error("Failed to create booking");
        } finally {
            setProcessing(false);
        }
    };

    // Need to ensuring selectedVilla has the actual _id. 
    // The current selectedVilla from localStorage might strictly be the config object {id: "villa-3", ...} without the DB _id.
    // If we only have identifier, we need to fetch the villa document first or use an action that looks it up.
    // However, createBooking takes villaId: v.id("villas").
    // We might need to change createBooking to take identifier like getBookings, or fetch the villa first here.
    // For now, let's assume we can query the villa by identifier in the component or updating createBooking to take identifier.
    // Actually, updating createBooking to take identifier is safer/easier if we don't have the ID handy.

    // Let's modify handleAddBooking to be aware of this, but first let's render the sheet.

    return (
        <div className={`flex flex-col h-screen ${darkMode ? "bg-neutral-950" : "bg-neutral-50"}`}>
            <AdminHeader
                activeTab={activeTab}
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode(!darkMode)}
            />

            {/* {showInstallPrompt && (
                <div className="absolute top-0 left-0 z-[100]">
                    <InstallPrompt onBypass={() => setShowInstallPrompt(false)} />
                </div>
            )} */}

            <div className={`flex-1 overflow-hidden relative pt-[calc(env(safe-area-inset-top,0px)+7rem)]`}>
                <div className="h-full overflow-y-auto pb-32">
                    {renderContent()}
                </div>
            </div>

            <AdminBottomNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onAddClick={() => setIsBookingSheetOpen(true)}
                darkMode={darkMode}
            />

            <BookingFormSheet
                isOpen={isBookingSheetOpen}
                onClose={() => setIsBookingSheetOpen(false)}
                mode="add"
                onSubmit={handleAddBooking}
                darkMode={darkMode}
                processing={processing}
            />
        </div>
    );
}
