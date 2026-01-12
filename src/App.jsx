import React, { useState, useEffect } from 'react';
import heroImage from './assets/image.png';
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
    Check,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Mail,
    Phone,
    Instagram,
    Facebook
} from 'lucide-react';

// --- Mock Data ---

const VILLAS = [
    {
        id: 1,
        name: "O2 Pool Villa",
        description: "A breath of fresh air. This 3-bedroom villa features an infinity pool, open-air living spaces, and a modern design focused on ventilation and light.",
        price: "1,500 - 2,000",
        rating: 4.92,
        reviews: 128,
        guests: 6,
        bedrooms: 3,
        beds: 4,
        baths: 3,
        images: [
            heroImage,
            heroImage,
            heroImage
        ],
        amenities: ["Private Pool", "Fast Wifi", "Smart TV", "Free Parking", "Kitchen"]
    },
    {
        id: 2,
        name: "Villa 17",
        description: "Immerse yourself in luxury. Villa Ozone offers a larger garden area, a jacuzzi integrated into the main pool, and a rooftop terrace for sunset views.",
        price: "1,500 - 2,000",
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

    return (
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
                        className={`p-2 rounded-md ${isSolid ? 'text-gray-900' : 'text-white'}`}
                    >
                        {isMobileMenuOpen ?
                            <X size={24} /> :
                            <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 py-4 px-4 flex flex-col space-y-4 animate-in slide-in-from-top-5">
                    {['home', 'villas', 'availability', 'contact'].map((item) => (
                        <button key={item} onClick={() => {
                            setActiveTab(item);
                            setIsMobileMenuOpen(false);
                        }}
                            className={`text-lg font-medium text-left capitalize ${activeTab === item ? 'text-cyan-600' :
                                'text-gray-600'}`}
                        >
                            {item}
                        </button>
                    ))}
                    <button className="bg-cyan-600 text-white py-3 rounded-lg font-bold w-full">
                        Check Availability
                    </button>
                </div>
            )}
        </nav>
    );
};

const Hero = ({ setActiveTab }) => (
    <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img src={heroImage}
                alt="O2 Pool Villa Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                Breathe in the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">Luxury</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                Experience the perfect element of relaxation at O2 Pool Villa.
                Your private sanctuary where modern design meets natural serenity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => setActiveTab('villas')}
                    className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100
                transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                >
                    View Villas
                </button>
                <button onClick={() => setActiveTab('availability')}
                    className="w-full sm:w-auto px-8 py-4 bg-cyan-600/90 backdrop-blur-sm text-white rounded-full font-bold
                hover:bg-cyan-600 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center
                gap-2"
                >
                    <Calendar size={20} />
                    Check Dates
                </button>
            </div>
        </div>
    </div>
);

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

const VillaCard = ({ villa }) => (
    <div
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
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
                    <span className="text-lg font-bold text-gray-900">AED {villa.price}</span>
                    <span className="text-gray-500 text-sm"> / night</span>
                </div>
                <button
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-cyan-600 transition-colors">
                    View Details
                </button>
            </div>
        </div>
    </div>
);

const AvailabilityCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Helpers for calendar generation
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty slots for days before start of month
    for (let i = 0; i
        < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-14 sm:h-24 bg-gray-50/50" />);
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() +
            1).padStart(2, '0')}-${String(d).padStart(2, '0')}`; const isBooked = MOCK_BOOKED_DATES.includes(dateStr); const
                isPast = new Date(dateStr) < new Date().setHours(0, 0, 0, 0); days.push(<div key={d} className={` h-14 sm:h-24 border
    border-gray-100 p-1 sm:p-2 relative flex flex-col justify-between group ${isBooked ? 'bg-red-50'
                        : 'bg-white hover:bg-cyan-50'} ${isPast ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} `}>
                    <span className={`text-sm font-medium ${isBooked ? 'text-red-400' : 'text-gray-700'}`}>{d}</span>

                    {isBooked && (
                        <div className="text-[10px] sm:text-xs font-medium text-red-600 bg-red-100 rounded px-1 py-0.5 truncate w-full">
                            Booked
                        </div>
                    )}
                    {!isBooked && !isPast && (
                        <div className="hidden group-hover:block text-[10px] sm:text-xs text-cyan-600 font-medium">
                            AED 1,500
                        </div>
                    )}
                </div>
                );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Availability</h2>
                    <p className="text-gray-500 text-sm mt-1">Synced with Airbnb & Booking.com</p>
                </div>

                <div className="flex items-center space-x-4 bg-gray-100 rounded-lg p-1">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-md transition-shadow shadow-sm">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-semibold text-gray-900 w-32 text-center select-none">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-md transition-shadow shadow-sm">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                {days}
            </div>

            <div className="mt-6 flex items-center justify-end gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white border border-gray-300"></div>
                    <span className="text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></div>
                    <span className="text-gray-600">Booked</span>
                </div>
            </div>
        </div>
    );
};

const ContactSection = () => (
    <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Have questions about the villa or the local area? We're here to help make your stay perfect.
                    Reach out directly for the best rates.
                </p>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-full shadow-sm text-cyan-600">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Location</h3>
                            <p className="text-gray-500">3 Al Marasi St - Al Jazeera Al Hamra<br />Ras Al Khaimah</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-full shadow-sm text-cyan-600">
                            <Mail size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Email</h3>
                            <p className="text-gray-500">reservations@o2poolvilla.com</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-full shadow-sm text-cyan-600">
                            <Phone size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Phone</h3>
                            <p className="text-gray-500">+971 50 400 0576</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-8">
                    <a href="https://www.instagram.com/o2poolvilla/" target="_blank" rel="noopener noreferrer"
                        className="p-3 bg-white rounded-full text-gray-600 hover:text-cyan-600 hover:shadow-md transition-all inline-flex items-center justify-center">
                        <Instagram size={24} />
                    </a>
                    <button
                        className="p-3 bg-white rounded-full text-gray-600 hover:text-cyan-600 hover:shadow-md transition-all">
                        <Facebook size={24} />
                    </button>
                </div>
            </div>

            <form className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100" onSubmit={(e) =>
                e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input type="text"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            placeholder="John" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input type="text"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            placeholder="Doe" />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                        placeholder="john@example.com" />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all h-32 resize-none"
                        placeholder="I'm interested in booking..." />
                </div>
                <button
                    className="w-full py-4 bg-gray-900 text-white rounded-lg font-bold hover:bg-cyan-600 transition-colors">
                    Send Message
                </button>
            </form>
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

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                                {VILLAS.map(villa =>
                                    <VillaCard key={villa.id} villa={villa} />)}
                            </div>
                        </div>

                        {/* Amenities Highlights */}
                        <div className="bg-cyan-50 py-24">
                            <div className="max-w-7xl mx-auto px-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    {[
                                        { icon: Wifi, label: "High-Speed Wifi" },
                                        { icon: Droplets, label: "Private Pool" },
                                        { icon: Coffee, label: "Breakfast Option" },
                                        { icon: Car, label: "Free Parking" }
                                    ].map((item, idx) => (
                                        <div key={idx}
                                            className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                            <div className="p-4 bg-cyan-50 rounded-full text-cyan-600 mb-4">
                                                <item.icon size={32} />
                                            </div>
                                            <h3 className="font-bold text-gray-900">{item.label}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto px-4 py-24">
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
                            {VILLAS.map(villa =>
                                <VillaCard key={villa.id} villa={villa} />)}
                        </div>
                    </div>
                )}

                {activeTab === 'availability' && (
                    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">Plan Your Stay</h1>
                            <p className="text-gray-500 max-w-2xl mx-auto">Check our real-time availability below. Dates marked
                                in red are already booked via Airbnb or Booking.com.</p>
                        </div>
                        <AvailabilityCalendar />
                        <div className="mt-16 max-w-3xl mx-auto text-center bg-gray-50 p-8 rounded-2xl border border-gray-100">
                            <h3 className="font-bold text-lg mb-2">Need help with your dates?</h3>
                            <p className="text-gray-600 mb-6">Sometimes we have cancellations or waiting lists. Contact us
                                directly to double check.</p>
                            <button onClick={() => setActiveTab('contact')}
                                className="text-cyan-600 font-bold hover:text-cyan-700 underline"
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ContactSection />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}