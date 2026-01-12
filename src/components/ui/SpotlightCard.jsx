import React from 'react';
import { motion } from "motion/react";
import { cn } from '../../lib/utils';

const Spotlight = ({ className, fill }) => {
    return (
        <svg
            className={cn(
                "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0",
                className
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 3787 2842"
            fill="none"
        >
            <g filter="url(#filter)">
                <ellipse
                    cx="1924.71"
                    cy="273.501"
                    rx="1924.71"
                    ry="273.501"
                    transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
                    fill={fill || "white"}
                    fillOpacity="0.21"
                ></ellipse>
            </g>
            <defs>
                <filter
                    id="filter"
                    x="0.860352"
                    y="0.838989"
                    width="3785.16"
                    height="2840.26"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    ></feBlend>
                    <feGaussianBlur
                        stdDeviation="151"
                        result="effect1_foregroundBlur_1065_8"
                    ></feGaussianBlur>
                </filter>
            </defs>
        </svg>
    );
};

export const SpotlightCard = ({
    children,
    className,
    spotlightClassName,
    spotlightFill,
}) => {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-3xl bg-gray-900/5 border border-gray-100",
                className
            )}
        >
            <Spotlight
                className={cn("-top-40 left-0 md:left-60 md:-top-20", spotlightClassName)}
                fill={spotlightFill || "#22d3ee"}
            />
            {children}
        </div>
    );
};

export const GlowingCard = ({ children, className }) => {
    return (
        <motion.div
            className={cn(
                "group relative rounded-3xl overflow-hidden",
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Animated border gradient */}
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Card content */}
            <div className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden">
                {children}
            </div>
        </motion.div>
    );
};

export default SpotlightCard;
