import React, { useState } from "react";
import { format } from "date-fns";
import { Sun, Moon, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/layouts/AdminLayout";
import { toast } from "sonner";

export default function Login() {
    const { login } = useAdmin();
    const [password, setPassword] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        if (login(password)) {
            toast.success("Welcome back!");
        } else {
            toast.error("Invalid password");
        }
    };

    return (
        <div className={`fixed inset-0 flex flex-col safe-area-inset transition-colors ${darkMode ? "bg-neutral-950" : "bg-white"}`}>
            {/* Visual Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={cn(
                    "absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full blur-[120px]",
                    darkMode ? "bg-sky-500/10" : "bg-sky-200/20"
                )} />
                <div className={cn(
                    "absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full blur-[120px]",
                    darkMode ? "bg-indigo-500/10" : "bg-indigo-200/20"
                )} />
            </div>

            <div className={`absolute inset-0 opacity-[0.03] ${darkMode ? 'bg-white' : 'bg-black'}`} style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                backgroundSize: '32px 32px'
            }} />

            <button
                onClick={() => setDarkMode(!darkMode)}
                className={`absolute top-12 right-6 p-3 rounded-xl transition-all z-50 backdrop-blur-md active:scale-95 ${darkMode
                    ? "bg-neutral-800/50 text-neutral-200 border border-neutral-700/50 hover:bg-neutral-800/80"
                    : "bg-white/50 text-neutral-600 border border-neutral-200 hover:bg-white/80"
                    }`}
            >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
                <div className="mb-12 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                            "relative w-32 h-32 mx-auto mb-8 rounded-3xl overflow-hidden border shadow-2xl backdrop-blur-xl flex items-center justify-center",
                            darkMode
                                ? "border-white/10 bg-white/5 shadow-black/40"
                                : "border-neutral-200 bg-white shadow-neutral-200"
                        )}
                    >
                        <Lock className={cn("w-12 h-12", darkMode ? "text-white" : "text-neutral-700")} />
                    </motion.div>
                    <h1 className={`text-3xl font-bold tracking-tight mb-2 ${darkMode ? "text-white" : "text-neutral-900"}`}>
                        Welcome
                    </h1>
                    <p className={`text-xs uppercase tracking-[0.4em] font-semibold opacity-40 ${darkMode ? "text-white" : "text-neutral-900"}`}>
                        ADMIN PORTAL
                    </p>
                    <div className={`mt-6 inline-flex items-center px-4 py-1.5 rounded-full border text-[11px] font-medium backdrop-blur-md ${darkMode
                        ? "bg-white/5 border-white/5 text-neutral-400"
                        : "bg-neutral-50 border-neutral-200 text-neutral-500"
                        }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-2 animate-pulse" />
                        {format(new Date(), 'EEEE, d MMMM yyyy')}
                    </div>
                </div>

                <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
                    <div className="relative group">
                        <input
                            type="password"
                            placeholder="Enter access code"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className={`w-full h-16 text-center text-xl rounded-2xl border-2 focus:ring-0 transition-all duration-300 placeholder:text-neutral-500 backdrop-blur-md outline-none ${darkMode
                                ? "bg-white/5 border-white/5 text-white focus:border-white/20 focus:bg-white/10"
                                : "bg-neutral-100/50 border-neutral-200 text-neutral-900 focus:border-neutral-900/10 focus:bg-neutral-100"
                                }`}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full h-16 text-lg font-semibold rounded-2xl transition-all active:scale-[0.98] shadow-2xl ${darkMode
                            ? "bg-white text-black hover:bg-neutral-200 shadow-white/5"
                            : "bg-neutral-900 text-white hover:bg-neutral-800 shadow-neutral-900/10"
                            }`}
                    >
                        Sign In
                    </button>
                </form>

                <p className={`absolute bottom-8 text-xs tracking-wide ${darkMode ? "text-neutral-500" : "text-neutral-300"}`}>
                    O2 POOL VILLA © {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
