import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/layouts/AdminLayout";
import { Home, Waves, MapPin, ArrowRight } from "lucide-react";

import { villas } from "@/lib/constants";

export default function VillaSelection() {
    const { selectVilla } = useAdmin();
    const [hovered, setHovered] = useState(null);

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Select Property</h1>
                    <p className="text-neutral-500">Choose which villa you want to manage</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {villas.map((villa) => (
                        <motion.button
                            key={villa.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => selectVilla(villa)}
                            onMouseEnter={() => setHovered(villa.id)}
                            onMouseLeave={() => setHovered(null)}
                            className="group relative h-80 rounded-3xl overflow-hidden bg-white shadow-xl text-left border border-neutral-200"
                        >
                            <img
                                src={villa.image}
                                alt={villa.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="mb-auto flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white`}>
                                        <Home className="w-6 h-6" />
                                    </div>
                                    {hovered === villa.id && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
                                        >
                                            Managed by You <ArrowRight className="w-4 h-4" />
                                        </motion.div>
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{villa.name}</h2>
                                    <p className="text-white/80 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {villa.description}
                                    </p>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}
