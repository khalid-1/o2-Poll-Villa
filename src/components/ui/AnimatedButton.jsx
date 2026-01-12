import React from 'react';
import { motion } from "motion/react";
import { cn } from '../../lib/utils';

export const AnimatedButton = ({
    children,
    className,
    variant = "primary",
    size = "md",
    ...props
}) => {
    const baseStyles = "relative overflow-hidden rounded-xl font-bold transition-all duration-300";

    const variants = {
        primary: "bg-gray-900 text-white hover:bg-cyan-600 shadow-lg hover:shadow-cyan-200/50",
        secondary: "bg-white text-gray-900 border border-gray-200 hover:border-cyan-500 hover:text-cyan-600 shadow-sm hover:shadow-md",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-50 hover:text-cyan-600",
        gradient: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-300/50",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <motion.button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            {...props}
        >
            {/* Shimmer effect on hover */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};

export const FloatingElement = ({ children, className, delay = 0 }) => {
    return (
        <motion.div
            className={className}
            animate={{
                y: [0, -10, 0],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay,
            }}
        >
            {children}
        </motion.div>
    );
};

export const FadeInWhenVisible = ({ children, className, delay = 0 }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.25, 0.4, 0.25, 1]
            }}
        >
            {children}
        </motion.div>
    );
};

export const StaggerContainer = ({ children, className, staggerDelay = 0.1 }) => {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem = ({ children, className }) => {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" }
                },
            }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedButton;
