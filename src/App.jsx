import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
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
import heroImage from './assets/image.png';
import o2VillaImage from './assets/o2_villa.png';
import {
    Wind,
    Droplets,
    MapPin,
    Calendar,
    Star,
    Users,
    Wifi,
    Coffee,
    Tv,
    Car,
    CheckIcon,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Mail,
    Phone,
    Instagram,
    Facebook,
    ArrowUp,
    Utensils,
    Mountain,
    Waves,
    Lock,
    Key,
    Shield
} from 'lucide-react';

import BookingCalendar from './components/BookingCalendar';
import { GlowingCard } from './components/ui/SpotlightCard';
import { FadeInWhenVisible, StaggerContainer, StaggerItem } from './components/ui/AnimatedButton';

const CATEGORIZED_AMENITIES = [
    {
        category: "Scenic views",
        items: [
            { icon: Mountain, label: "Mountain view" },
            { icon: Waves, label: "Pool view" },
            { icon: Droplets, label: "Garden view" }
        ]
    },
    {
        category: "Bathroom",
        items: [
            { icon: Droplets, label: "Bathtub" },
            { icon: Wind, label: "Hair dryer" },
            { icon: Star, label: "Cleaning products" },
            { icon: Droplets, label: "Shampoo & Conditioner" },
            { icon: Droplets, label: "Hot water" }
        ]
    },
    {
        category: "Bedroom & laundry",
        items: [
            { icon: Wind, label: "Washer" },
            { icon: CheckIcon, label: "Essentials (Towels, bed sheets, soap, toilet paper)" },
            { icon: CheckIcon, label: "Hangers" },
            { icon: CheckIcon, label: "Bed linens" },
            { icon: CheckIcon, label: "Extra pillows and blankets" },
            { icon: CheckIcon, label: "Room-darkening shades" },
            { icon: CheckIcon, label: "Iron" },
            { icon: Shield, label: "Safe" },
            { icon: CheckIcon, label: "Wardrobe" }
        ]
    },
    {
        category: "Entertainment",
        items: [
            { icon: Tv, label: "55\" HDTV with Netflix, premium cable" },
            { icon: Wifi, label: "Sound system" },
            { icon: Users, label: "Pool table" }
        ]
    },
    {
        category: "Heating and cooling",
        items: [
            { icon: Wind, label: "Central air conditioning" },
            { icon: Wind, label: "Ceiling fan" }
        ]
    },
    {
        category: "Internet and office",
        items: [
            { icon: Wifi, label: "Fast wifi – 502 Mbps" },
            { icon: Coffee, label: "Dedicated workspace" }
        ]
    },
    {
        category: "Kitchen and dining",
        items: [
            { icon: Utensils, label: "Kitchen" },
            { icon: Utensils, label: "Refrigerator" },
            { icon: Utensils, label: "Microwave" },
            { icon: Utensils, label: "Cooking basics" },
            { icon: Utensils, label: "Dishes and silverware" },
            { icon: Utensils, label: "Freezer" },
            { icon: Utensils, label: "Dishwasher" },
            { icon: Utensils, label: "Stove & Oven" },
            { icon: Coffee, label: "Coffee maker" },
            { icon: Utensils, label: "Toaster" },
            { icon: Utensils, label: "BBQ grill" },
            { icon: Utensils, label: "Dining table" }
        ]
    },
    {
        category: "Location features",
        items: [
            { icon: Key, label: "Private entrance" },
            { icon: MapPin, label: "Resort access" }
        ]
    },
    {
        category: "Outdoor",
        items: [
            { icon: Coffee, label: "Private patio or balcony" },
            { icon: Droplets, label: "Private backyard" },
            { icon: Coffee, label: "Outdoor furniture" },
            { icon: Utensils, label: "Outdoor dining area" }
        ]
    },
    {
        category: "Parking and facilities",
        items: [
            { icon: Car, label: "Free driveway parking on premises – 2 spaces" },
            { icon: Droplets, label: "Private outdoor pool - infinity, open 24 hours" }
        ]
    },
    {
        category: "Services",
        items: [
            { icon: Key, label: "Self check-in" },
            { icon: Lock, label: "Smart lock" },
            { icon: Calendar, label: "Long term stays allowed" }
        ]
    }
];

// --- Mock Data ---

const VILLAS = [
    {
        id: 1,
        name: "O2 Pool Villa",
        description: "A breath of fresh air. This 3-bedroom villa features an infinity pool, open-air living spaces, and a modern design focused on ventilation and light.",
        price: "1,500",
        rating: 4.92,
        reviews: 128,
        guests: 6,
        bedrooms: 3,
        beds: 4,
        baths: 3,
        images: [
            o2VillaImage,
            o2VillaImage,
            o2VillaImage
        ],
        amenities: ["Private Pool", "Fast Wifi", "Smart TV", "Free Parking", "Kitchen"]
    },
    {
        id: 2,
        name: "Villa 17",
        description: "Immerse yourself in luxury. Villa Ozone offers a larger garden area, a jacuzzi integrated into the main pool, and a rooftop terrace for sunset views.",
        price: "1,500",
        rating: 4.98,
        reviews: 86,
        guests: 8,
        bedrooms: 4,
        beds: 5,
        baths: 4,
        images: [
            heroImage,
            heroImage,
            heroImage
        ],
        amenities: ["Jacuzzi", "Rooftop Terrace", "BBQ Grill", "Sound System", "Workspace"]
    }
];

// Mock Booked Dates (In a real app, this comes from parsing the iCal feed)
// Format: 'YYYY-MM-DD'
const MOCK_BOOKED_DATES = [
    '2024-06-15', '2024-06-16', '2024-06-17',
    '2024-06-25', '2024-06-26',
    '2024-07-02', '2024-07-03', '2024-07-04', '2024-07-05'
];

// --- Components ---

const Navigation = ({ activeTab, setActiveTab, isScrolled }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isSolid = isScrolled || activeTab !== 'home';

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const menuVariants = {
        closed: {
            opacity: 0,
            backdropFilter: "blur(0px)",
            transition: { duration: 0.3 }
        },
        open: {
            opacity: 1,
            backdropFilter: "blur(16px)",
            transition: { duration: 0.3 }
        }
    };

    const containerVariants = {
        closed: { x: "100%", transition: { ease: "easeInOut", duration: 0.4 } },
        open: {
            x: 0,
            transition: {
                ease: "easeOut",
                duration: 0.4,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, y: 20 },
        open: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSolid ? 'bg-white shadow-md py-4'
                : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center cursor-pointer group" onClick={() => setActiveTab('home')}>
                        <span className={`text-2xl font-bold tracking-tight ${isSolid ? 'text-gray-900' : 'text-white'}`}>
                            O<span className="text-xs align-baseline relative top-1">2</span> <span className={isSolid ? 'text-cyan-600' : 'text-cyan-300'}>Pool Villa</span>
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {['home', 'villas', 'availability', 'contact'].map((item) => (
                            <button key={item} onClick={() => setActiveTab(item)}
                                className={`text-sm font-medium hover:text-cyan-500 transition-colors capitalize ${activeTab === item
                                    ? 'text-cyan-500'
                                    : (isSolid ? 'text-gray-600' : 'text-white/90')
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                        <button
                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg">
                            Book Now
                        </button>
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-2 rounded-md transition-colors relative z-[60] ${isMobileMenuOpen ? 'text-gray-900' : (isSolid ? 'text-gray-900' : 'text-white')}`}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Full Screen Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 z-50 bg-white/90"
                    >
                        {/* Menu Content */}
                        <motion.div
                            className="h-full flex flex-col justify-center items-center px-6 pb-32"
                            variants={containerVariants}
                        >
                            <div className="flex flex-col items-center space-y-8 mb-12">
                                {['home', 'villas', 'availability', 'contact'].map((item) => (
                                    <motion.button
                                        key={item}
                                        variants={itemVariants}
                                        onClick={() => {
                                            setActiveTab(item);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`text-4xl font-bold capitalize transition-all duration-300 ${activeTab === item ? 'text-cyan-600' : 'text-gray-900'}`}
                                        whileHover={{ scale: 1.1, color: "#0891b2" }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {item}
                                    </motion.button>
                                ))}
                            </div>

                            <motion.button
                                variants={itemVariants}
                                onClick={() => {
                                    setActiveTab('availability');
                                    setIsMobileMenuOpen(false);
                                }}
                                className="bg-cyan-600 text-white py-4 px-12 rounded-full font-bold text-xl shadow-xl shadow-cyan-200/50 flex items-center gap-3"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Calendar size={24} />
                                Book Your Stay
                            </motion.button>

                            <motion.div
                                variants={itemVariants}
                                className="absolute bottom-12 flex gap-8"
                            >
                                <a href="https://www.instagram.com/o2poolvilla/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-600 transition-colors">
                                    <Instagram size={32} />
                                </a>
                                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-600 transition-colors">
                                    <Facebook size={32} />
                                </a>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const Hero = ({ setActiveTab }) => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Parallax Background */}
            <motion.div className="absolute inset-0 z-0" style={{ y }}>
                <img src={heroImage}
                    alt="O2 Pool Villa Hero" className="w-full h-full object-cover scale-110" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
            </motion.div>

            {/* Animated Spotlight Effect */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse-glow" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float" />
            </div>

            <motion.div
                className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16"
                style={{ opacity }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                >
                    <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                        Breathe in the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-200 animate-gradient-text">Luxury</span>
                    </h1>
                </motion.div>

                <motion.p
                    className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                >
                    Experience the perfect element of relaxation at O2 Pool Villa.
                    Your private sanctuary where modern design meets natural serenity.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                >
                    <motion.button
                        onClick={() => setActiveTab('villas')}
                        className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-full font-bold shadow-xl flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        View Villas
                    </motion.button>
                    <motion.button
                        onClick={() => setActiveTab('availability')}
                        className="w-full sm:w-auto px-8 py-4 bg-cyan-600/90 backdrop-blur-sm text-white rounded-full font-bold shadow-xl flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 211, 238, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <Calendar size={20} />
                        Check Dates
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <motion.div
                    className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-2"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <motion.div
                        className="w-1.5 h-1.5 bg-white rounded-full"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
};

const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prev = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative h-64 md:h-72 w-full overflow-hidden group">
            <img src={images[currentIndex]} alt="Villa"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />

            {/* Navigation Arrows - Only show on hover */}
            <div
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={prev} className="p-1 bg-white/90 rounded-full shadow-lg hover:bg-white text-gray-800">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={next} className="p-1 bg-white/90 rounded-full shadow-lg hover:bg-white text-gray-800">
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5">
                {images.map((_, idx) => (
                    <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-3'
                        : 'bg-white/50'}`} />
                ))}
            </div>
        </div>
    );
};

const VillaCard = ({ villa, index = 0 }) => (
    <motion.div
        className="bg-white rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-shadow duration-500 border border-gray-100 group"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
            duration: 0.6,
            delay: index * 0.15,
            ease: [0.25, 0.4, 0.25, 1]
        }}
        whileHover={{ y: -8 }}
    >
        <ImageCarousel images={villa.images} />

        <div className="p-6">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-700 transition-colors">
                    {villa.name}
                </h3>
                <div className="flex items-center space-x-1 text-sm font-medium text-gray-800">
                    <Star size={14} className="fill-black text-black" />
                    <span>{villa.rating}</span>
                    <span className="text-gray-400 font-normal">({villa.reviews})</span>
                </div>
            </div>

            <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
                {villa.description}
            </p>

            <div className="flex items-center gap-4 text-gray-500 text-sm mb-6">
                <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{villa.guests} guests</span>
                </div>
                <div className="flex items-center gap-1">
                    <Droplets size={16} />
                    <span>{villa.baths} baths</span>
                </div>
                <div className="flex items-center gap-1">
                    <Wind size={16} />
                    <span>AC</span>
                </div>
            </div>

            <div className="flex items-end justify-between border-t border-gray-100 pt-4">
                <div>
                    <span className="text-xs text-gray-500 font-medium block mb-0.5">From</span>
                    <span className="text-xl font-bold text-gray-900">AED {villa.price}</span>
                    <span className="text-gray-500 text-sm font-medium"> / night</span>
                </div>
                <motion.button
                    className="px-5 py-2.5 md:px-6 md:py-3 bg-gray-900 text-white rounded-xl font-bold text-xs md:text-sm shadow-lg"
                    whileHover={{ scale: 1.05, backgroundColor: "#0891b2" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    View Details
                </motion.button>
            </div>
        </div>
    </motion.div>
);

const AvailabilitySection = ({ setActiveTab }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <BookingCalendar bookedDatesRaw={MOCK_BOOKED_DATES} />

        <div className="mt-16 max-w-3xl mx-auto text-center bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <h3 className="font-bold text-lg mb-2">Need help with your dates?</h3>
            <p className="text-gray-600 mb-6 font-light">
                Sometimes we have cancellations or waiting lists. Contact us directly to double check availability for your preferred dates.
            </p>
            <button
                onClick={() => setActiveTab('contact')}
                className="bg-white px-8 py-3 rounded-xl shadow-premium text-cyan-600 font-bold hover:shadow-premium-hover transition-all border border-cyan-50"
            >
                Contact Support
            </button>
        </div>
    </div>
);


const ContactSection = () => (
    <div className="bg-gray-50 rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
        <p className="text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
            Have questions about the villa or the local area? We're here to help make your stay perfect.
            Reach out directly for the best rates.
        </p>

        <div className="grid sm:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="flex flex-col items-center">
                <div className="p-4 bg-white rounded-2xl shadow-premium text-cyan-600 mb-4">
                    <MapPin size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Location</h3>
                <p className="text-gray-500 text-sm">3 Al Marasi St - Al Jazeera Al Hamra<br />Ras Al Khaimah</p>
            </div>

            <div className="flex flex-col items-center">
                <div className="p-4 bg-white rounded-2xl shadow-premium text-cyan-600 mb-4">
                    <Mail size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-500 text-sm">reservations@o2poolvilla.com</p>
            </div>

            <div className="flex flex-col items-center">
                <div className="p-4 bg-white rounded-2xl shadow-premium text-cyan-600 mb-4">
                    <Phone size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                <p className="text-gray-500 text-sm">+971 50 400 0576</p>
            </div>
        </div>

        <div className="flex justify-center gap-6 mt-12">
            <a href="https://www.instagram.com/o2poolvilla/" target="_blank" rel="noopener noreferrer"
                className="p-4 bg-white rounded-2xl text-gray-600 shadow-premium hover:text-cyan-600 hover:shadow-premium-hover transition-all inline-flex items-center justify-center">
                <Instagram size={32} />
            </a>
            <button
                className="p-4 bg-white rounded-2xl text-gray-600 shadow-premium hover:text-cyan-600 hover:shadow-premium-hover transition-all">
                <Facebook size={32} />
            </button>
        </div>
    </div>
);

const Footer = () => (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight">
                        O<span className="text-xs align-baseline relative top-1">2</span> <span className="text-cyan-400">Pool Villa</span>
                    </span>
                </div>

                <div className="flex gap-8 text-sm text-gray-400">
                    <a href="#" className="hover:text-white transition-colors">About Us</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Sitemap</a>
                </div>

                <div className="text-sm text-gray-500">
                    © {new Date().getFullYear()} O2 Pool Villa. All rights reserved.
                </div>
            </div>
        </div>
    </footer>
);

export default function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [isScrolled, setIsScrolled] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isAmenitiesModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isAmenitiesModalOpen]);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-cyan-100">
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} isScrolled={isScrolled} />

            {/* Tab Content */}
            <main>
                {activeTab === 'home' && (
                    <div className="animate-in fade-in duration-500">
                        <Hero setActiveTab={setActiveTab} />

                        {/* Featured Villas Preview */}
                        <div className="max-w-7xl mx-auto px-4 py-24">
                            <div className="text-center mb-16">
                                <span className="text-cyan-600 font-bold tracking-wider text-sm uppercase">Accommodation</span>
                                <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Our Luxury Villas</h2>
                                <div className="h-1 w-20 bg-cyan-500 mx-auto rounded-full" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                                {VILLAS.map((villa, index) =>
                                    <VillaCard key={villa.id} villa={villa} />)}
                            </div>
                        </div>

                        {/* Amenities Highlights */}
                        {/* Airbnb-style Amenities Section */}
                        {/* Airbnb-style Amenities Section */}
                        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 border-t border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">What this place offers</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 mb-8">
                                {CATEGORIZED_AMENITIES.flatMap(cat => cat.items).slice(0, 10).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 py-1">
                                        <div className="text-cyan-600 bg-cyan-50 p-2.5 rounded-xl min-w-10 flex items-center justify-center">
                                            <item.icon size={22} strokeWidth={1.5} />
                                        </div>
                                        <span className="text-gray-700 text-base font-medium">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setIsAmenitiesModalOpen(true)}
                                className="px-6 py-3 border border-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm tracking-wide"
                            >
                                Show all {CATEGORIZED_AMENITIES.reduce((acc, cat) => acc + cat.items.length, 0)} amenities
                            </button>
                        </div>

                        {/* Amenities Modal */}
                        {isAmenitiesModalOpen && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAmenitiesModalOpen(false)} />
                                <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl relative flex flex-col animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                        <button onClick={() => setIsAmenitiesModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                            <X size={20} />
                                        </button>
                                        <h3 className="text-lg font-bold">What this place offers</h3>
                                        <div className="w-9" /> {/* Spacer for centering */}
                                    </div>
                                    <div className="overflow-y-auto p-6 md:p-8 space-y-8">
                                        {CATEGORIZED_AMENITIES.map((category, idx) => (
                                            <div key={idx}>
                                                <h4 className="font-bold text-gray-900 mb-4 text-base">{category.category}</h4>
                                                <div className="space-y-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                                    {category.items.map((item, itemIdx) => (
                                                        <div key={itemIdx} className="flex items-center gap-4">
                                                            <div className="text-cyan-600 bg-cyan-50 p-2 rounded-lg">
                                                                <item.icon size={20} strokeWidth={1.5} />
                                                            </div>
                                                            <span className="text-gray-700 font-medium">{item.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
                            <ContactSection />
                        </div>
                    </div>
                )}

                {activeTab === 'villas' && (
                    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-12">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Sanctuary</h1>
                            <p className="text-xl text-gray-500">Each villa is designed to provide the ultimate O2
                                experience—fresh, clean, and revitalizing.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                            {VILLAS.map((villa, index) =>
                                <VillaCard key={villa.id} villa={villa} />)}
                        </div>
                    </div>
                )}

                {activeTab === 'availability' && (
                    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Plan Your Stay</h1>
                            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                                Check our real-time availability below. Dates marked in red are already booked via Airbnb or Booking.com.
                            </p>
                        </div>
                        <AvailabilitySection setActiveTab={setActiveTab} />
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ContactSection />
                    </div>
                )}
            </main>

            <Footer />

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 p-4 bg-cyan-600 text-white rounded-full shadow-premium hover:shadow-premium-hover hover:bg-cyan-700 transition-all duration-300 z-50 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
            >
                <ArrowUp size={24} />
            </button>
        </div>
    );
}